import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const now = new Date();
        const posts = await prisma.blogPost.findMany({
            where: {
                OR: [
                    { publishedAt: null },
                    { publishedAt: { lte: now } },
                ],
            },
            orderBy: [
                { publishedAt: 'desc' },
                { createdAt: 'desc' },
            ],
            take: 3,
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Latest Blog API Error:', error);
        return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
}
