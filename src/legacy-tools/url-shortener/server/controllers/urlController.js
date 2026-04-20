const urlModel = require('../models/urlModel');
const crypto = require('crypto');
const QRCode = require('qrcode');
const UAParser = require('ua-parser-js');

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateShortCode(length = 6) {
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, BASE62.length);
        code += BASE62[randomIndex];
    }
    return code;
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

const { authenticateToken } = require('./authController');

// ... 생략 ...

async function shortenUrl(req, res) {
    const { url, customCode, expiresIn } = req.body;
    const userId = req.user ? req.user.id : null; // 토큰 파싱 후 유저 정보 확인

    if (!url || !isValidUrl(url)) {
        return res.status(400).json({ error: '유효한 HTTP/HTTPS URL을 입력해주세요.' });
    }

    let shortCode = customCode ? customCode.trim() : '';

    // 비로그인 사용자 방어
    if (shortCode && !userId) {
        return res.status(403).json({ error: '커스텀 코드는 회원만 사용할 수 있습니다.' });
    }
    if (expiresIn === 'unlimited' && !userId) {
        return res.status(403).json({ error: '영구적인 단축 URL은 회원만 생성 가능합니다.' });
    }

    // 커스텀 코드 처리
    if (shortCode) {
        const existing = await urlModel.getUrlByShortCode(shortCode);
        if (existing) {
            return res.status(400).json({ error: '이미 사용 중인 단축 코드입니다.' });
        }
    } else {
        // 자동 생성 로직
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 5) {
            shortCode = generateShortCode();
            const existingCode = await urlModel.getUrlByShortCode(shortCode);
            if (!existingCode) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            return res.status(500).json({ error: '단축 코드 생성에 실패했습니다.' });
        }
    }

    let expiresAt = null;
    if (expiresIn && expiresIn !== 'unlimited') {
        const now = new Date();
        if (expiresIn === '24h') now.setHours(now.getHours() + 24);
        else if (expiresIn === '48h') now.setHours(now.getHours() + 48);
        else if (expiresIn === '1w') now.setDate(now.getDate() + 7);
        else if (expiresIn === '1m') now.setMonth(now.getMonth() + 1);
        expiresAt = now.toISOString();
    }

    try {
        // userModel.createUrl을 호출할 때 userId를 전달하도록 구조가 변경되어야하지만 MVP상 간단히 쿼리로 직결 처리 또는 인자 추가
        const db = await require('../config/db').initDb();
        await db.run(
            'INSERT INTO urls (user_id, short_code, original_url, expires_at) VALUES (?, ?, ?, ?)',
            [userId, shortCode, url, expiresAt]
        );

        const publicHost = req.get('x-forwarded-host') || req.get('host');
        const publicProto = req.get('x-forwarded-proto') || req.protocol;
        const prefix = req.get('x-forwarded-host') ? '/url-shortener' : '';
        const shortUrl = `${publicProto}://${publicHost}${prefix}/${shortCode}`;
        const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);

        res.json({
            short_url: shortUrl,
            qr_code: qrCodeDataUrl,
            short_code: shortCode
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '데이터베이스 오류' });
    }
}

async function redirectToOriginal(req, res) {
    const { shortcode } = req.params;

    try {
        const urlData = await urlModel.getUrlByShortCode(shortcode);

        if (urlData) {
            // 만료 여부 확인
            if (urlData.expires_at) {
                const now = new Date();
                const expireDate = new Date(urlData.expires_at);
                if (now > expireDate) {
                    return res.status(410).send(`<h1 style="text-align:center; padding:50px; font-family:sans-serif;">기간이 만료된 페이지입니다.</h1>`);
                }
            }

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const parser = new UAParser(req.headers['user-agent']);
            const device = parser.getDevice().type || 'desktop';

            urlModel.incrementClickCount(shortcode).catch(console.error);
            urlModel.logClick(shortcode, ip, device).catch(console.error);

            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            res.redirect(302, urlData.original_url);
        } else {
            res.status(404).send(`<h1 style="text-align:center; padding:50px; font-family:sans-serif;">URL을 찾을 수 없습니다.</h1>`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
}

async function getStats(req, res) {
    try {
        const stats = await urlModel.getStats();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '통계 정보를 가져올 수 없습니다.' });
    }
}

async function getMyUrls(req, res) {
    const userId = req.user.id;
    try {
        const urls = await urlModel.getUrlsByUserId(userId);
        res.json(urls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '사용자 URL 목록을 가져올 수 없습니다.' });
    }
}

async function getUrlDetailedStats(req, res) {
    const { shortcode } = req.params;

    try {
        const urlData = await urlModel.getUrlByShortCode(shortcode);
        if (!urlData) {
            return res.status(404).json({ error: '찾을 수 없는 URL입니다.' });
        }

        const clickLogs = await urlModel.getClickLogsByShortCode(shortcode);
        res.json({
            url: urlData,
            stats: clickLogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '통계 정보를 가져올 수 없습니다.' });
    }
}

async function getFilteredUrls(req, res) {
    const { filter } = req.query;
    try {
        const urls = await urlModel.getUrlsByFilter(filter);
        res.json(urls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '목록을 가져올 수 없습니다.' });
    }
}

module.exports = {
    shortenUrl,
    redirectToOriginal,
    getStats,
    getMyUrls,
    getUrlDetailedStats,
    getFilteredUrls
};
