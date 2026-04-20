import { NextRequest, NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import QRCode from 'qrcode';
import archiver from 'archiver';
import { Readable, PassThrough } from 'stream';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const optionsStr = formData.get('options') as string;
        const options = JSON.parse(optionsStr || '{}');

        if (!file) {
            return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as any[];

        if (data.length === 0) {
            return NextResponse.json({ error: '데이터가 없습니다.' }, { status: 400 });
        }

        // Create Zip Stream
        const archive = archiver('zip', { zlib: { level: 9 } });
        const passThrough = new PassThrough();
        archive.pipe(passThrough);

        // Process in background/parallel but we need to wait for archive.finalize()
        const processPromise = (async () => {
            for (let row of data) {
                try {
                    const name = row.name || 'unnamed';
                    const baseUrl = row.url?.startsWith('http') ? row.url : 'https://' + row.url;
                    if (!row.url) continue;

                    const urlObj = new URL(baseUrl);
                    if (row.campaign) urlObj.searchParams.set('utm_campaign', String(row.campaign));
                    if (row.store_code) urlObj.searchParams.set('utm_id', String(row.store_code));
                    urlObj.searchParams.set('utm_source', 'qr');

                    const qrOptions = {
                        errorCorrectionLevel: options.errorCorrectionLevel || 'M',
                        margin: 1,
                        width: parseInt(options.resolution || '300'),
                        color: {
                            dark: options.colorDark || '#000000',
                            light: options.colorLight || '#ffffff'
                        }
                    };

                    const qrBuffer = await QRCode.toBuffer(urlObj.toString(), qrOptions);
                    const filename = `${String(name).replace(/[^a-z0-9가-힣]/gi, '_')}_${row.store_code || Date.now()}.png`;
                    
                    archive.append(qrBuffer, { name: filename });
                } catch (err) {
                    console.error('QR Generate Error:', err);
                }
            }
            await archive.finalize();
        })();

        // Return stream response
        return new NextResponse(passThrough as any, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="qrcodes_${Date.now()}.zip"`,
            },
        });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
