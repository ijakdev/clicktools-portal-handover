import { PDFDocument, PageSizes } from 'pdf-lib';
import { ImageToPdfOptions } from '@/types/pdf-tools';

export async function convertImagesToPdf(
    files: File[],
    options: ImageToPdfOptions
): Promise<Blob> {
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
        let image;
        const arrayBuffer = await file.arrayBuffer();

        // Check type and embed appropriate format
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            try {
                image = await pdfDoc.embedJpg(arrayBuffer);
            } catch (e) {
                console.warn('Failed standard JPG embed, falling back to canvas', e);
                const pngBuffer = await convertImageToPngBuffer(file);
                image = await pdfDoc.embedPng(pngBuffer);
            }
        } else if (file.type === 'image/png') {
            try {
                image = await pdfDoc.embedPng(arrayBuffer);
            } catch (e) {
                console.warn('Failed standard PNG embed, falling back to canvas', e);
                const pngBuffer = await convertImageToPngBuffer(file);
                image = await pdfDoc.embedPng(pngBuffer);
            }
        } else {
            // Fallback: convert to PNG using canvas (e.g. WebP)
            const pngBuffer = await convertImageToPngBuffer(file);
            image = await pdfDoc.embedPng(pngBuffer);
        }

        // Determine Page Size
        let [pageWidth, pageHeight] = PageSizes.A4; // Default A4
        if (options.pageSize === 'Letter') [pageWidth, pageHeight] = PageSizes.Letter;

        // If Fit, use image dimensions (plus margins later?)
        // For simplicity, Fit adopts image aspect ratio but maybe scales to fit standard page?
        // Usually 'Fit' means "Page matches Image size exactly".
        if (options.pageSize === 'Fit') {
            pageWidth = image.width;
            pageHeight = image.height;
        }

        // Handle Orientation (Swap if needed)
        if (options.orientation === 'Landscape') {
            if (pageWidth < pageHeight) [pageWidth, pageHeight] = [pageHeight, pageWidth];
        } else if (options.orientation === 'Portrait') {
            if (pageWidth > pageHeight) [pageWidth, pageHeight] = [pageHeight, pageWidth];
        } else if (options.orientation === 'Auto' && options.pageSize !== 'Fit') {
            // Auto: Match image orientation
            const isImageLandscape = image.width > image.height;
            const isPageLandscape = pageWidth > pageHeight;
            if (isImageLandscape !== isPageLandscape) {
                [pageWidth, pageHeight] = [pageHeight, pageWidth];
            }
        }

        // Determine Draw Dimensions (scaling)
        let drawWidth = image.width;
        let drawHeight = image.height;

        // Apply Margins
        let margin = 0;
        if (options.margin === 'Small') margin = 20;
        if (options.margin === 'Big') margin = 50;

        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);

        // Calculate scale to fit
        if (options.pageSize !== 'Fit') {
            const scale = Math.min(availableWidth / image.width, availableHeight / image.height, 1);
            drawWidth = image.width * scale;
            drawHeight = image.height * scale;
        } else {
            // For Fit, add margins to page size
            pageWidth += margin * 2;
            pageHeight += margin * 2;
            // Image stays original size
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Center logic
        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        page.drawImage(image, {
            x,
            y,
            width: drawWidth,
            height: drawHeight,
        });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
}

function convertImageToPngBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        blob.arrayBuffer().then(resolve).catch(reject);
                    } else {
                        reject(new Error('Canvas to Blob failed'));
                    }
                }, 'image/png');
            } else {
                reject(new Error('Canvas context failed'));
            }
            URL.revokeObjectURL(url);
        };
        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
        };
        img.src = url;
    });
}
