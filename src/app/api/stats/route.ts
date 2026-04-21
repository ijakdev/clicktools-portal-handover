import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAPPING: { [key: string]: string } = {
    activeUsers: 'stats_active_users',
    filesConverted: 'stats_files_converted',
    onlineTools: 'stats_online_tools',
    pdfsCreated: 'stats_pdfs_created',
};

async function getStatsFromDb() {
    const rows = await prisma.globalStat.findMany();

    const stats: Record<string, number> = {
        activeUsers: 0,
        filesConverted: 0,
        onlineTools: 0,
        pdfsCreated: 0,
    };

    rows.forEach((row) => {
        const jsonKey = Object.keys(MAPPING).find((key) => MAPPING[key] === row.name);
        if (jsonKey) {
            stats[jsonKey] = row.value;
        }
    });

    return stats;
}

export async function GET() {
    try {
        const stats = await getStatsFromDb();
        return NextResponse.json(stats);
    } catch (error) {
        if (error instanceof Error) {
            console.error('STATS_GET_ERROR:', error.message);
        }
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { field } = await request.json();
        const dbKey = MAPPING[field];

        if (dbKey) {
            await prisma.globalStat.upsert({
                where: { name: dbKey },
                create: { name: dbKey, value: 1 },
                update: { value: { increment: 1 } },
            });

            const stats = await getStatsFromDb();
            return NextResponse.json({ success: true, stats });
        }

        return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('STATS_POST_ERROR:', error.message);
        }
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }
}
