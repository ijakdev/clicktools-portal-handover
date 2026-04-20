import { ToolDef } from '@/types/tools';
import {
    FileImage,
    FileText,
    Globe,
    FileType2,
    FileSpreadsheet,
    Presentation,
    ScanText
} from 'lucide-react';

export const TOOLS: ToolDef[] = [
    {
        id: 'jpg-to-pdf',
        title: 'JPG to PDF',
        description: 'JPG, PNG, BMP, GIF, TIFF 이미지를 PDF로 변환하세요.',
        icon: 'FileImage',
        path: '/convert/jpg-to-pdf',
        isImplemented: true,
    },
    {
        id: 'pdf-to-jpg',
        title: 'PDF to JPG',
        description: 'PDF 페이지를 JPG 이미지로 변환하거나 이미지를 추출하세요.',
        icon: 'FileImage',
        path: '/convert/pdf-to-jpg',
        isImplemented: true,
    },
    {
        id: 'html-to-pdf',
        title: 'HTML to PDF',
        description: '웹페이지 URL을 입력하여 고품질 PDF로 변환하세요.',
        icon: 'Globe',
        path: '/convert/html-to-pdf',
        isImplemented: true, // Interface implemented
    },

    {
        id: 'word-to-pdf',
        title: 'Word to PDF',
        description: 'Word 문서(.docx)를 PDF로 변환하세요.',
        icon: 'FileType2',
        path: '/convert/word-to-pdf',
        isImplemented: true,
    },
    {
        id: 'excel-to-pdf',
        title: 'Excel to PDF',
        description: 'Excel 스프레드시트를 PDF로 변환하세요.',
        icon: 'FileSpreadsheet',
        path: '/convert/excel-to-pdf',
        isImplemented: true,
    },
    {
        id: 'ppt-to-pdf',
        title: 'PowerPoint to PDF',
        description: 'PowerPoint 프레젠테이션을 PDF로 변환하세요.',
        icon: 'Presentation',
        path: '/convert/ppt-to-pdf',
        isImplemented: true,
    }
];
