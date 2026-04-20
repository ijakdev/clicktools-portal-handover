import { PdfToJpgOptions } from '@/types/pdf-tools';


export async function convertPdfToJpg(
    file: File,
    options: PdfToJpgOptions
): Promise<Blob[]> {
    if (typeof window === 'undefined') {
        throw new Error('PDF conversion must be run in the browser');
    }

    // Dynamic import to prevent SSR DOMMatrix errors
    const pdfjsLib =  await import('pdfjs-dist');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url
        ).toString();
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    const blobs: Blob[] = [];

    const scale = options.quality === 'high' ? 2.0 : 1.5;

    for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (!context) throw new Error('Canvas context failed');

        await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas,
        }).promise;

        // Export to blob
        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.85); // 85% quality Jpg
        });

        if (blob) {
            blobs.push(blob);
        }

        // Cleanup
        // page.cleanup(); // verify if needed in newer versions, usually garbage collected
    }

    return blobs;
}
