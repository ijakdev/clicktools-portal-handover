import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import QRCode from 'qrcode';

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

        let shortCode = customCode ? customCode.trim() : '';

        if (shortCode) {
            const existing = await prisma.url.findUnique({ where: { shortCode } });
            if (existing) {
                return NextResponse.json({ error: '이미 사용 중인 단축 코드입니다.' }, { status: 400 });
            }
        } else {
            let isUnique = false;
            let attempts = 0;
            while (!isUnique && attempts < 5) {
                shortCode = generateShortCode();
                const existing = await prisma.url.findUnique({ where: { shortCode } });
                if (!existing) isUnique = true;
                attempts++;
            }
            if (!isUnique) {
                return NextResponse.json({ error: '단축 코드 생성에 실패했습니다.' }, { status: 500 });
            }
        }

        let expiresAt: Date | null = null;
        if (expiresIn && expiresIn !== 'unlimited') {
            const now = new Date();
            if (expiresIn === '24h') now.setHours(now.getHours() + 24);
            else if (expiresIn === '48h') now.setHours(now.getHours() + 48);
            else if (expiresIn === '1w') now.setDate(now.getDate() + 7);
            else if (expiresIn === '1m') now.setMonth(now.getMonth() + 1);
            expiresAt = now;
        }

        await prisma.url.create({
            data: {
                shortCode,
                originalUrl: url,
                expiresAt,
            },
        });

        // 상시 누적 카운터 증가 (없으면 생성)
        await prisma.globalStat.upsert({
            where: { name: 'url_shortener_total_creations' },
            create: { name: 'url_shortener_total_creations', value: 1 },
            update: { value: { increment: 1 } },
        });

        const shortUrl = `https://www.clicktools.co.kr/s/${shortCode}`;
        const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);

        return NextResponse.json({
            short_url: shortUrl,
            qr_code: qrCodeDataUrl,
            short_code: shortCode,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter');

        const rows = filter === 'clicks'
            ? await prisma.url.findMany({
                where: { clickCount: { gt: 0 } },
                orderBy: { clickCount: 'desc' },
                take: 10,
            })
            : await prisma.url.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
            });

        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: '목록 조회 실패' }, { status: 500 });
    }
}
