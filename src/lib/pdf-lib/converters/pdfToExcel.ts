
import * as XLSX from 'xlsx';
export async function convertPdfToExcel(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();

    // Dynamically load pdfjs to prevent SSR crashes
    const pdfjsLib = await import('pdfjs-dist');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url
        ).toString();
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    const workbook = XLSX.utils.book_new();

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const rows: Record<number, any[]> = {};

        textContent.items.forEach((item: any) => {
            const y = Math.round(item.transform[5]);
            if (!rows[y]) rows[y] = [];
            rows[y].push({
                str: item.str,
                x: item.transform[4]
            });
        });

        const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a);

        const sheetData: any[][] = [];

        sortedY.forEach(y => {
            const rowItems = rows[y].sort((a, b) => a.x - b.x);
            const rowData = rowItems.map(item => item.str);
            sheetData.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i}`);
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
