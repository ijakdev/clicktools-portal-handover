import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const GOTENBERG_URL = 'http://211.43.12.67:5000/forms/libreoffice/convert';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const gotenbergForm = new FormData();
        gotenbergForm.append('files', file, file.name);

        const response = await fetch(GOTENBERG_URL, {
            method: 'POST',
            body: gotenbergForm,
            signal: AbortSignal.timeout(120000),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`Gotenberg conversion failed (${response.status}): ${errorText}`);
        }

        const pdfBuffer = await response.arrayBuffer();
        const safeFilename = encodeURIComponent(`${path.parse(file.name).name}.pdf`);

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename*=UTF-8''${safeFilename}`,
            },
        });

    } catch (error) {
        console.error('Office to PDF conversion error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to convert document' },
            { status: 500 }
        );
    }
}
