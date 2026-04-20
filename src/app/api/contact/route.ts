import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { name, email, title, message } = await req.json();

        if (!name || !email || !title || !message) {
            return NextResponse.json({ error: '모든 필드를 입력해 주세요.' }, { status: 400 });
        }

        const db = await getDb();
        await db.run(
            'INSERT INTO inquiries (name, email, title, message) VALUES (?, ?, ?, ?)',
            [name, email, title, message]
        );

        return NextResponse.json({ success: true, message: '문의가 성공적으로 접수되었습니다.' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
