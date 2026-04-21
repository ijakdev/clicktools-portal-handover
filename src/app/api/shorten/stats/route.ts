import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
    try {
        const now = new Date();

        // 1. Active URLs (Not expired)
        const activeUrls = await prisma.url.count({
            where: {
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: now } },
                ],
            },
        });

        // 2. Created Today (local midnight)
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const todayUrls = await prisma.url.count({
            where: { createdAt: { gte: startOfDay } },
        });

        // 3. Accumulated Creations
        const creationsResult = await prisma.globalStat.findUnique({
            where: { name: 'url_shortener_total_creations' },
        });
        const totalCreated = creationsResult?.value ?? 0;

        return NextResponse.json({
            activeUrls,
            todayUrls,
            totalCreated,
        });
    } catch (error) {
        console.error('STATS_FETCH_ERROR:', error);
        return NextResponse.json({ error: '데이터를 가져오는데 실패했습니다.' }, { status: 500 });
    }
}
