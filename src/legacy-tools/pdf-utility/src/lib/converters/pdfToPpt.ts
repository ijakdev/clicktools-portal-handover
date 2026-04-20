
import pptxgen from 'pptxgenjs';
export async function convertPdfToPpt(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();

    // Dynamically load pdfjs to prevent SSR crashes
    const pdfjsLib = await import('pdfjs-dist');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-utility/pdf.worker.min.mjs';
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    const pres = new pptxgen();

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (!context) continue;

        await page.render({
            canvasContext: context,
            viewport: viewport,
        } as any).promise;

        const imgData = canvas.toDataURL('image/jpeg', 0.8);

        const slide = pres.addSlide();

        slide.addImage({
            data: imgData,
            x: 0,
            y: 0,
            w: '100%',
            h: '100%'
        });
    }

    const pptBuffer = await pres.write({ outputType: 'blob' });

    if (pptBuffer instanceof Blob) {
        return pptBuffer;
    }

    return new Blob([pptBuffer as any], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
}
