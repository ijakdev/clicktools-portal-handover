import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';
import QRCode from 'qrcode';

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateShortCode(length = 4) {
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, BASE62.length);
        code += BASE62[randomIndex];
    }
    return code;
}

function isValidUrl(string: string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { url, customCode, expiresIn } = await req.json();

        if (!url || !isValidUrl(url)) {
            return NextResponse.json({ error: '유효한 HTTP/HTTPS URL을 입력해주세요.' }, { status: 400 });
        }

        const db = await getDb();
        let shortCode = customCode ? customCode.trim() : '';

        // Check if custom code exists
        if (shortCode) {
            const existing = await db.get('SELECT * FROM urls WHERE short_code = ?', [shortCode]);
            if (existing) {
                return NextResponse.json({ error: '이미 사용 중인 단축 코드입니다.' }, { status: 400 });
            }
        } else {
            // Auto generate
            let isUnique = false;
            let attempts = 0;
            while (!isUnique && attempts < 5) {
                shortCode = generateShortCode();
                const existing = await db.get('SELECT * FROM urls WHERE short_code = ?', [shortCode]);
                if (!existing) isUnique = true;
                attempts++;
            }
            if (!isUnique) {
                return NextResponse.json({ error: '단축 코드 생성에 실패했습니다.' }, { status: 500 });
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

        await db.run(
            'INSERT INTO urls (short_code, original_url, expires_at) VALUES (?, ?, ?)',
            [shortCode, url, expiresAt]
        );

        // 상시 누적 카운터 증가
        await db.run(
            'UPDATE global_stats SET value = value + 1 WHERE name = ?',
            ['url_shortener_total_creations']
        );

        // Force production domain for the short URL string
        const shortUrl = `https://www.clicktools.co.kr/s/${shortCode}`;
        
        const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);

        return NextResponse.json({
            short_url: shortUrl,
            qr_code: qrCodeDataUrl,
            short_code: shortCode
        });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter');
        const db = await getDb();
        
        let rows;
        if (filter === 'clicks') {
            rows = await db.all('SELECT * FROM urls WHERE click_count > 0 ORDER BY click_count DESC LIMIT 10');
        } else {
            rows = await db.all('SELECT * FROM urls ORDER BY created_at DESC LIMIT 10');
        }

        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: '목록 조회 실패' }, { status: 500 });
    }
}
