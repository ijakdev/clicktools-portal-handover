import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
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

        await prisma.inquiry.update({
            where: { id: Number(id) },
            data: { status },
        });

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

        await prisma.inquiry.delete({ where: { id: Number(id) } });

        return NextResponse.json({ success: true, message: '문의가 삭제되었습니다.' });
    } catch (error) {
        console.error('Inquiries API DELETE Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
