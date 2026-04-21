import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { uploadToStorage } from '@/lib/storage';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const customFilename = formData.get('customFilename') as string;

        if (!file) {
            return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
        }

        // 파일 유효성 검사 (이미지 파일만 허용)
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 파일명 생성: 사용자 지정 이름이 있으면 사용, 없으면 타임스탬프 기반
        let safeFileName: string;
        if (customFilename && customFilename.trim()) {
            const ext = path.extname(file.name);
            const baseName = customFilename
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            safeFileName = `${baseName}${ext}`;
        } else {
            const timestamp = Date.now();
            safeFileName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;
        }

        // Supabase Storage에 업로드 (blog/ prefix 아래에 저장)
        const key = `blog/${safeFileName}`;
        const url = await uploadToStorage({
            key,
            body: buffer,
            contentType: file.type,
        });

        return NextResponse.json({ url, key });
    } catch (error) {
        console.error('Upload error:', error);
        const message = error instanceof Error ? error.message : '파일 업로드 중 서버 오류가 발생했습니다.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
