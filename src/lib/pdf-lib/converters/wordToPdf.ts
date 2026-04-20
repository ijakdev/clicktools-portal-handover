export async function convertWordToPdf(files: File[]): Promise<Blob> {
    const file = files[0]; // Process only the first for now to match API
    if (!file) throw new Error('파일이 없습니다.');
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/pdf-utility/api/convert/office', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Word 변환 중 오차 발생 (서버 응답 오류)');
    }

    return await response.blob();
}
