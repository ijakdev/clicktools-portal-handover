import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const post = await prisma.blogPost.findUnique({ where: { slug } });
            if (!post) return NextResponse.json({ error: '게시물을 찾을 수 없습니다.' }, { status: 404 });
            return NextResponse.json(post);
        }

        const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Blog API GET Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

function parseDate(value: unknown): Date | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    if (value instanceof Date) return value;
    const d = new Date(String(value));
    return isNaN(d.getTime()) ? null : d;
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const {
            slug, title, content, excerpt, category, thumbnail,
            image_alt, image_caption,
            image1, image1_alt, image1_caption,
            image2, image2_alt, image2_caption,
            image3, image3_alt, image3_caption,
            created_at, published_at,
        } = data;

        if (!slug || !title || !content || !excerpt || !category || !thumbnail) {
            return NextResponse.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 });
        }

        const createdAt = parseDate(created_at) ?? new Date();
        const publishedAt = parseDate(published_at);

        await prisma.blogPost.create({
            data: {
                slug, title, content, excerpt, category, thumbnail,
                imageAlt: image_alt ?? null,
                imageCaption: image_caption ?? null,
                image1: image1 ?? null,
                image1Alt: image1_alt ?? null,
                image1Caption: image1_caption ?? null,
                image2: image2 ?? null,
                image2Alt: image2_alt ?? null,
                image2Caption: image2_caption ?? null,
                image3: image3 ?? null,
                image3Alt: image3_alt ?? null,
                image3Caption: image3_caption ?? null,
                createdAt,
                publishedAt: publishedAt ?? null,
            },
        });

        return NextResponse.json({ success: true, message: '게시물이 등록되었습니다.' });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: '이미 존재하는 슬러그입니다.' }, { status: 400 });
        }
        console.error('Blog API POST Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const {
            id, slug, title, content, excerpt, category, thumbnail,
            image_alt, image_caption,
            image1, image1_alt, image1_caption,
            image2, image2_alt, image2_caption,
            image3, image3_alt, image3_caption,
            created_at, published_at,
        } = data;

        if (!id || !slug || !title || !content || !excerpt || !category || !thumbnail) {
            return NextResponse.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 });
        }

        const createdAt = parseDate(created_at);
        const publishedAt = parseDate(published_at);

        await prisma.blogPost.update({
            where: { id: Number(id) },
            data: {
                slug, title, content, excerpt, category, thumbnail,
                imageAlt: image_alt ?? null,
                imageCaption: image_caption ?? null,
                image1: image1 ?? null,
                image1Alt: image1_alt ?? null,
                image1Caption: image1_caption ?? null,
                image2: image2 ?? null,
                image2Alt: image2_alt ?? null,
                image2Caption: image2_caption ?? null,
                image3: image3 ?? null,
                image3Alt: image3_alt ?? null,
                image3Caption: image3_caption ?? null,
                ...(createdAt !== undefined ? { createdAt: createdAt ?? new Date() } : {}),
                publishedAt: publishedAt ?? null,
            },
        });

        return NextResponse.json({ success: true, message: '게시물이 수정되었습니다.' });
    } catch (error) {
        console.error('Blog API PUT Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });

        await prisma.blogPost.delete({ where: { id: Number(id) } });

        return NextResponse.json({ success: true, message: '게시물이 삭제되었습니다.' });
    } catch (error) {
        console.error('Blog API DELETE Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
