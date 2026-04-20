// PDF.js will be loaded dynamically in getPdfPageCount

export interface FileMeta {
    name: string;
    size: number;
    type: string;
    dimensions?: { width: number; height: number }; // For images
    pageCount?: number; // For PDFs
}

export async function getFileMeta(file: File): Promise<FileMeta> {
    const meta: FileMeta = {
        name: file.name,
        size: file.size,
        type: file.type,
    };

    if (file.type.startsWith('image/')) {
        try {
            const dimensions = await getImageDimensions(file);
            meta.dimensions = dimensions;
        } catch (e) {
            console.warn('Failed to get image dimensions', e);
        }
    } else if (file.type === 'application/pdf') {
        try {
            const pageCount = await getPdfPageCount(file);
            meta.pageCount = pageCount;
        } catch (e) {
            console.warn('Failed to get PDF page count', e);
        }
    }

    return meta;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

async function getPdfPageCount(file: File): Promise<number> {
    const pdfjsLib = await import('pdfjs-dist');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-utility/pdf.worker.min.mjs';
    }
    const arrayBuffer = await file.arrayBuffer();
    // Using standard font data to avoid CDN font issues if possible, 
    // but for page count we just need the doc.
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
}
