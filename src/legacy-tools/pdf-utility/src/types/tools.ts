export type ToolId =
    | 'jpg-to-pdf'
    | 'pdf-to-jpg'
    | 'html-to-pdf'
    | 'pdf-to-word'
    | 'pdf-to-excel'
    | 'pdf-to-ppt' // PowerPoint
    | 'ocr-pdf'
    | 'smart-scan'
    | 'word-to-pdf'
    | 'excel-to-pdf'
    | 'ppt-to-pdf';

export interface ToolDef {
    id: ToolId;
    title: string;
    description: string;
    icon: string; // Lucide icon name or component
    path: string;
    isImplemented: boolean;
    comingSoon?: boolean;
}

export type PageSize = 'Fit' | 'A4' | 'Letter';
export type MarginSize = 'None' | 'Small' | 'Big';
export type Orientation = 'Portrait' | 'Landscape' | 'Auto';

export interface ImageToPdfOptions {
    pageSize: PageSize;
    margin: MarginSize;
    orientation: Orientation;
    mergeImages: boolean;
}

export interface PdfToJpgOptions {
    quality: 'normal' | 'high';
    extractImages: boolean; // MVP: false (pages_to_jpg only)
}

export interface HtmlToPdfOptions {
    url: string;
    pageSize: PageSize;
    orientation: Orientation;
}

export interface ProcessingState {
    status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
    progress: number; // 0-100
    message: string;
    error?: string;
}

export interface UploadedFile {
    id: string;
    file: File;
    previewUrl?: string; // For images
    pageCount?: number; // For PDF
    status: 'pending' | 'ready' | 'error';
}

export interface ConversionResult {
    file: Blob;
    filename: string;
    type: 'pdf' | 'zip' | 'jpg';
}
