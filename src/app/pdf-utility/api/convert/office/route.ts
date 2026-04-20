import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import os from 'os';
import crypto from 'crypto';

const execFileAsync = promisify(execFile);

// Common installation paths for LibreOffice on Windows
const LIBREOFFICE_PATHS = [
    'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
    'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
];

function getLibreOfficePath(): string | null {
    for (const p of LIBREOFFICE_PATHS) {
        if (existsSync(p)) return p;
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
            return NextResponse.json({ error: 'LibreOffice is not installed on the server.' }, { status: 500 });
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
        } catch (execError: any) {
            console.error('LibreOffice execution failed:', execError);
            throw new Error(`Conversion engine failed: ${execError.message}`);
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

    } catch (error: any) {
        console.error('Office to PDF Native Conversion error:', error);

        if (tempOutputDir && existsSync(tempOutputDir)) {
            await fs.rm(tempOutputDir, { recursive: true, force: true }).catch(e => console.error("Emergency cleanup failed", e));
        }

        return NextResponse.json(
            { error: error.message || 'Failed to convert document natively' },
            { status: 500 }
        );
    }
}
