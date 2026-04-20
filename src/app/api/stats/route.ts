import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const MAPPING: { [key: string]: string } = {
    'activeUsers': 'stats_active_users',
    'filesConverted': 'stats_files_converted',
    'onlineTools': 'stats_online_tools',
    'pdfsCreated': 'stats_pdfs_created'
};

async function getStatsFromDb() {
    const db = await getDb();
    const rows = await db.all('SELECT name, value FROM global_stats');
    
    // 기본값 설정
    const stats: any = { activeUsers: 0, filesConverted: 0, onlineTools: 0, pdfsCreated: 0 };
    
    // DB에서 매핑된 값 주입
    rows.forEach(row => {
        // DB 키를 JSON 키로 역매핑
        const jsonKey = Object.keys(MAPPING).find(key => MAPPING[key] === row.name);
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
    } catch (error: any) {
        console.error("STATS_GET_ERROR:", error.message);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { field } = await request.json();
        const dbKey = MAPPING[field];
        
        if (dbKey) {
            const db = await getDb();
            // 기존 값이 없으면 1로 시작, 있으면 +1
            await db.run(
                'INSERT INTO global_stats (name, value) VALUES (?, 1) ON CONFLICT(name) DO UPDATE SET value = value + 1',
                [dbKey]
            );
            
            const stats = await getStatsFromDb();
            return NextResponse.json({ success: true, stats });
        }
        
        return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
    } catch (error: any) {
        console.error("STATS_POST_ERROR:", error.message);
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }
}
