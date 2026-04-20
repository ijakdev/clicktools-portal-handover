import JSZip from 'jszip';

export async function createZip(
    files: { name: string; content: Blob }[]
): Promise<Blob> {
    const zip = new JSZip();

    files.forEach((file) => {
        zip.file(file.name, file.content);
    });

    return await zip.generateAsync({ type: 'blob' });
}

export { JSZip };
