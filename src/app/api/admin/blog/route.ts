import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const db = await getDb();

        if (slug) {
            const post = await db.get('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
            if (!post) return NextResponse.json({ error: '게시물을 찾을 수 없습니다.' }, { status: 404 });
            return NextResponse.json(post);
        }

        const posts = await db.all('SELECT * FROM blog_posts ORDER BY created_at DESC');
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Blog API GET Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { 
            slug, title, content, excerpt, category, thumbnail, image_alt, image_caption,
            image1, image1_alt, image1_caption,
            image2, image2_alt, image2_caption,
            image3, image3_alt, image3_caption,
            created_at, published_at
        } = data;

        if (!slug || !title || !content || !excerpt || !category || !thumbnail) {
            return NextResponse.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 });
        }

        const db = await getDb();
        await db.run(
            `INSERT INTO blog_posts (
                slug, title, content, excerpt, category, thumbnail, image_alt, image_caption,
                image1, image1_alt, image1_caption,
                image2, image2_alt, image2_caption,
                image3, image3_alt, image3_caption,
                created_at, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                slug, title, content, excerpt, category, thumbnail, image_alt, image_caption,
                image1, image1_alt, image1_caption,
                image2, image2_alt, image2_caption,
                image3, image3_alt, image3_caption,
                created_at || new Date().toISOString().replace('T', ' ').split('.')[0],
                published_at
            ]
        );

        return NextResponse.json({ success: true, message: '게시물이 등록되었습니다.' });
    } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
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
            id, slug, title, content, excerpt, category, thumbnail, image_alt, image_caption,
            image1, image1_alt, image1_caption,
            image2, image2_alt, image2_caption,
            image3, image3_alt, image3_caption,
            created_at, published_at
        } = data;

        if (!id || !slug || !title || !content || !excerpt || !category || !thumbnail) {
            return NextResponse.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 });
        }

        const db = await getDb();
        await db.run(
            `UPDATE blog_posts 
             SET slug = ?, title = ?, content = ?, excerpt = ?, category = ?, thumbnail = ?, 
                 image_alt = ?, image_caption = ?, 
                 image1 = ?, image1_alt = ?, image1_caption = ?,
                 image2 = ?, image2_alt = ?, image2_caption = ?,
                 image3 = ?, image3_alt = ?, image3_caption = ?,
                 created_at = ?,
                 published_at = ?,
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [
                slug, title, content, excerpt, category, thumbnail,
                image_alt, image_caption,
                image1, image1_alt, image1_caption,
                image2, image2_alt, image2_caption,
                image3, image3_alt, image3_caption,
                created_at,
                published_at,
                id
            ]
        );

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

        const db = await getDb();
        await db.run('DELETE FROM blog_posts WHERE id = ?', [id]);

        return NextResponse.json({ success: true, message: '게시물이 삭제되었습니다.' });
    } catch (error) {
        console.error('Blog API DELETE Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
