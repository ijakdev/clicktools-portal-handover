import { HtmlToPdfOptions } from '@/types/tools';

export async function validateUrl(url: string): Promise<boolean> {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

// Interface for future server implementation
export async function convertHtmlToPdf(
    options: HtmlToPdfOptions
): Promise<Blob> {
    // Check URL validity first
    if (!await validateUrl(options.url)) {
        throw new Error('Invalid URL format');
    }

    // Use the Real API Route
    const response = await fetch('/pdf-utility/api/html-to-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Variation failed');
    }

    const blob = await response.blob();
    return blob;
}
