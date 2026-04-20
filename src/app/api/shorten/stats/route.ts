import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const db = await getDb();
        
        // 1. Active URLs (Not expired)
        const totalResult = await db.get("SELECT COUNT(*) as count FROM urls WHERE expires_at IS NULL OR expires_at > datetime('now')");
        const activeUrls = totalResult?.count || 0;
        
        // 2. Created Today
        const todayResult = await db.get(
            "SELECT COUNT(*) as count FROM urls WHERE DATE(created_at) = DATE('now', 'localtime')"
        );
        const todayUrls = todayResult?.count || 0;
        
        // 3. Accumulated Creations
        const creationsResult = await db.get('SELECT value FROM global_stats WHERE name = ?', ['url_shortener_total_creations']);
        const totalCreated = creationsResult?.value || 0;
        
        return NextResponse.json({
            activeUrls,
            todayUrls,
            totalCreated
        });

    } catch (error: any) {
        console.error('STATS_FETCH_ERROR:', error);
        return NextResponse.json({ error: '데이터를 가져오는데 실패했습니다.' }, { status: 500 });
    }
}
