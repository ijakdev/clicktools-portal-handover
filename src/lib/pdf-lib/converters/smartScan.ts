
import { createWorker } from 'tesseract.js';

export interface SmartScanResult {
    text: string;
    pdfBlob: Blob;
    imagePreview: string; // Data URL for preview
}

export async function processSmartScan(file: File, onProgress?: (progress: number, status: string) => void): Promise<SmartScanResult> {

    if (onProgress) onProgress(5, 'OCR ?îÏßÑ Ï¥àÍ∏∞??Ï§?..');

    try {
        // Use local files to avoid CDN issues
        const worker = await createWorker('eng', 1, {
            workerPath: '/pdf-utility/tesseract-worker.min.js',
            corePath: '/pdf-utility/tesseract-core.wasm.js',
            langPath: 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0', // Github fallback
            logger: m => {
                if (m.status === 'recognizing text' && onProgress) {
                    onProgress(Math.round(m.progress * 100), `?çÏä§??Î∂ÑÏÑù Ï§?.. ${Math.round(m.progress * 100)}%`);
                } else if (onProgress && m.status) {
                    onProgress(0, `?ÅÌÉú: ${m.status}`);
                }
            },
        });

        const imageUrl = URL.createObjectURL(file);

        if (onProgress) onProgress(10, '?¥Î?ÏßÄ Î∂ÑÏÑù ?§Ìñâ...');

        // Tesseract.js v7: PDF is returned in data.pdf if output.pdf is true
        const { data } = await worker.recognize(imageUrl, {
            pdfTitle: "SmartScan",
        }, {
            pdf: true,
            text: true
        });

        const text = data.text;

        if (onProgress) onProgress(80, 'PDF ?ùÏÑ± Ï§?..');

        // In v7, data.pdf is number[] | null. 
        // We do NOT call getPDF().
        if (!data.pdf) {
            throw new Error("PDF ?ùÏÑ±???§Ìå®?àÏäµ?àÎã§. (PDF ?∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§)");
        }

        await worker.terminate();

        if (onProgress) onProgress(100, '?ÑÎ£å!');

        // Convert number[] to Uint8Array
        const pdfUint8Array = new Uint8Array(data.pdf);
        const pdfBlob = new Blob([pdfUint8Array], { type: 'application/pdf' });

        return {
            text,
            pdfBlob,
            imagePreview: imageUrl
        };
    } catch (e: any) {
        console.error("Smart Scan Error:", e);
        let msg = String(e);
        if (e instanceof Error) msg = e.message;
        if (e?.message) msg = e.message;
        throw new Error(`OCR ?§Ìå®: ${msg}`);
    }
}
