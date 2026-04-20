const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function mergeImagesToPdf() {
    const artifactDir = 'C:\\Users\\lotto\\.gemini\\antigravity\\brain\\03dabe7c-493e-4b2e-97a1-1e231b0bab07';
    const outputPdfPath = path.join(artifactDir, 'enhans_document.pdf');
    
    const files = fs.readdirSync(artifactDir)
        .filter(f => f.startsWith('enhans_page_') && f.endsWith('.png'))
        .sort((a, b) => {
            const pageA = parseInt(a.match(/page_(\d+)/)[1]);
            const pageB = parseInt(b.match(/page_(\d+)/)[1]);
            return pageA - pageB;
        });

    console.log(`Found ${files.length} images to merge.`);

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
        const filePath = path.join(artifactDir, file);
        const imageBytes = fs.readFileSync(filePath);
        const image = await pdfDoc.embedPng(imageBytes);
        const { width, height } = image.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
        console.log(`Added page ${file}`);
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPdfPath, pdfBytes);
    console.log(`PDF saved to ${outputPdfPath}`);
}

mergeImagesToPdf().catch(console.error);
