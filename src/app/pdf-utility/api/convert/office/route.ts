import { NextRequest, NextResponse } from 'next/server';
import { execFile, execSync } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import os from 'os';
import crypto from 'crypto';

const execFileAsync = promisify(execFile);

/**
 * 서버 환경에 맞는 LibreOffice(soffice) 실행 파일 경로를 찾아옵니다.
 */
function getLibreOfficePath(): string | null {
    // 1. 운영체제별 공통 경로 목록
    const winPaths = [
        'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
        'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
    ];
    
    const linuxPaths = [
        '/usr/bin/soffice',
        '/usr/bin/libreoffice',
        '/usr/local/bin/soffice',
        '/snap/bin/libreoffice',
    ];

    const platformPaths = process.platform === 'win32' ? winPaths : linuxPaths;

    // 2. 고정 경로 확인
    for (const p of platformPaths) {
        if (existsSync(p)) return p;
    }

    // 3. 시스템 PATH에서 명령어 확인 (which/where)
    try {
        const cmd = process.platform === 'win32' ? 'where soffice' : 'which soffice';
        const result = execSync(cmd).toString().trim();
        if (result) {
            // where 명령어는 여러 경로를 출력할 수 있으므로 첫 번째 줄 사용
            const firstPath = result.split('\n')[0].trim();
            if (existsSync(firstPath)) return firstPath;
        }
    } catch (e) {
        // PATH에 없음
    }

    return null;
}

export async function POST(req: NextRequest) {
    let tempInputPath = '';
    let tempOutputDir = '';
    let expectedOutputPath = '';

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const sofficePath = getLibreOfficePath();
        if (!sofficePath) {
            return NextResponse.json({ 
                error: '서버에 LibreOffice가 설치되어 있지 않거나 경로를 찾을 수 없습니다.',
                details: '서버에 LibreOffice를 설치해 주세요. (Windows: C:\\Program Files\\LibreOffice, Linux: sudo apt install libreoffice)'
            }, { status: 500 });
        }

        // 1. Prepare secure temporary workspace
        const uniqueId = crypto.randomUUID();
        const extension = path.extname(file.name) || '.tmp';

        tempOutputDir = path.join(os.tmpdir(), `office_convert_${uniqueId}`);
        await fs.mkdir(tempOutputDir, { recursive: true });

        tempInputPath = path.join(tempOutputDir, `input_${uniqueId}${extension}`);
        expectedOutputPath = path.join(tempOutputDir, `input_${uniqueId}.pdf`);

        // 2. Write uploaded file to disk
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(tempInputPath, buffer);

        // 3. Execute LibreOffice Headless Native Conversion
        try {
            await execFileAsync(sofficePath, [
                '--headless',
                '--nologo',
                '--nofirststartwizard',
                '--convert-to',
                'pdf',
                '--outdir',
                tempOutputDir,
                tempInputPath
            ], {
                timeout: 120000,
                windowsHide: true,
            });
        } catch (execError) {
            console.error('LibreOffice execution failed:', execError);
            if(execError instanceof Error){
                throw new Error(`Conversion engine failed: ${execError.message}`);
            }else{
                throw new Error(`Conversion engine failed`);
            }
        }

        // 4. Read the PDF output
        if (!existsSync(expectedOutputPath)) {
            throw new Error('Conversion completed but PDF output file was not found.');
        }

        const pdfBuffer = await fs.readFile(expectedOutputPath);

        // 5. Cleanup
        await fs.rm(tempOutputDir, { recursive: true, force: true }).catch(console.error);

        // 6. Return response
        const safeFilename = encodeURIComponent(`${path.parse(file.name).name}.pdf`);
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename*=UTF-8''${safeFilename}`,
            },
        });

    } catch (error) {
        console.error('Office to PDF Native Conversion error:', error);

        if (tempOutputDir && existsSync(tempOutputDir)) {
            await fs.rm(tempOutputDir, { recursive: true, force: true }).catch(e => console.error("Emergency cleanup failed", e));
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message || 'Failed to convert document natively' : 'Unknown error' },
            { status: 500 }
        );
    }
}
