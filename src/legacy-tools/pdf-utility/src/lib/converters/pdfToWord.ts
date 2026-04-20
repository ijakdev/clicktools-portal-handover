
import { Document, Packer, Paragraph, TextRun } from 'docx';
export async function convertPdfToWord(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();

    // Dynamically load pdfjs to prevent SSR crashes
    const pdfjsLib = await import('pdfjs-dist');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-utility/pdf.worker.min.mjs';
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    const children: (Paragraph)[] = [];

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        let lastY = -1;
        let pageText = '';

        const items = textContent.items.map((item: any) => ({
            str: item.str,
            x: item.transform[4],
            y: item.transform[5],
            height: item.height
        })).sort((a, b) => {
            if (Math.abs(a.y - b.y) > 5) {
                return b.y - a.y;
            }
            return a.x - b.x;
        });

        items.forEach((item) => {
            if (lastY !== -1 && Math.abs(item.y - lastY) > 10) {
                pageText += '\n';
            } else if (lastY !== -1) {
                pageText += ' ';
            }
            pageText += item.str;
            lastY = item.y;
        });

        const lines = pageText.split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                children.push(new Paragraph({
                    children: [new TextRun(line)],
                    spacing: { after: 200 },
                }));
            }
        });

        if (i < numPages) {
            children.push(new Paragraph({
                children: [new TextRun({ break: 1 })],
                pageBreakBefore: true
            }));
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    return Packer.toBlob(doc);
}
