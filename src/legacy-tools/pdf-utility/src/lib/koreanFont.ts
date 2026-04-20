import { PDFDocument, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// Singleton to cache the downloaded font in memory
let cachedFontBytes: ArrayBuffer | null = null;

export async function getKoreanFont(pdfDoc: PDFDocument): Promise<PDFFont> {
    // Register fontkit to allow custom fonts
    pdfDoc.registerFontkit(fontkit);

    if (!cachedFontBytes) {
        try {
            // Use a highly stable TTF font (Nanum Gothic) because fontkit often fails parsing complex OTF 'topDict' tables
            const url = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/nanumgothic/NanumGothic-Regular.ttf';
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch font: ${response.statusText}`);
            }

            cachedFontBytes = await response.arrayBuffer();
        } catch (error) {
            console.error('Error fetching Korean Font, falling back to basic embed attempt:', error);
            // We pass the error upwards if it completely fails.
            throw error;
        }
    }

    // Embed the custom font
    const customFont = await pdfDoc.embedFont(cachedFontBytes);
    return customFont;
}
