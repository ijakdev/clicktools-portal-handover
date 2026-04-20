export async function convertWordToPdf(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/pdf-utility/api/convert/office', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        let errMsg = '네이티브 워드 변환 실패';
        try {
            const errJson = await response.json();
            errMsg = errJson.error || errMsg;
        } catch (e) { }
        throw new Error(errMsg);
    }

    return await response.blob();
}
