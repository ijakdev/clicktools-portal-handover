import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const posts = await db.all("SELECT * FROM blog_posts WHERE (published_at IS NULL OR published_at = '' OR datetime(published_at) <= datetime('now', 'localtime')) ORDER BY COALESCE(published_at, created_at) DESC LIMIT 3");
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Latest Blog API Error:', error);
        return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
}
