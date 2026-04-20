import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDb();
        const inquiries = await db.all('SELECT * FROM inquiries ORDER BY created_at DESC');
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error('Inquiries API GET Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'ID와 상태가 필요합니다.' }, { status: 400 });
        }

        const db = await getDb();
        await db.run('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);

        return NextResponse.json({ success: true, message: '문의 상태가 업데이트되었습니다.' });
    } catch (error) {
        console.error('Inquiries API PUT Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });

        const db = await getDb();
        await db.run('DELETE FROM inquiries WHERE id = ?', [id]);

        return NextResponse.json({ success: true, message: '문의가 삭제되었습니다.' });
    } catch (error) {
        console.error('Inquiries API DELETE Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
