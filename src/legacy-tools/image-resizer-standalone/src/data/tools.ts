export interface MockOption {
    id: string;
    label: string;
    type: 'select' | 'number' | 'checkbox' | 'text';
    options?: string[];
    defaultValue: string | number | boolean;
}

export interface Tool {
    id: string;
    name: string;
    category: '이미지' | '문서' | '오디오' | '영상' | '텍스트' | '기타';
    tags: string[];
    shortDesc: string;
    icon: string;
    acceptedFileTypes: string[];
    mockOptions: MockOption[];
    outputType: 'image' | 'text' | 'file';
}

export const CATEGORIES = ['All', '이미지', '문서', '오디오', '영상', '텍스트', '기타'] as const;

export const TOOLS: Tool[] = [
    // 이미지
    {
        id: 'img-resize',
        name: '이미지 리사이즈',
        category: '이미지',
        tags: ['압축', '비율'],
        shortDesc: '이미지의 크기를 품질 저하 없이 원하는 해상도로 조정합니다.',
        icon: 'Maximize',
        acceptedFileTypes: ['.jpg', '.png', '.webp'],
        mockOptions: [
            { id: 'width', label: '너비 (px)', type: 'number', defaultValue: 1920 },
            { id: 'quality', label: '품질', type: 'select', options: ['최고', '높음', '보통'], defaultValue: '최고' }
        ],
        outputType: 'image'
    },
    {
        id: 'img-bg-remove',
        name: '배경 제거 (AI)',
        category: '이미지',
        tags: ['AI', '누끼'],
        shortDesc: 'AI를 사용하여 이미지의 배경을 정교하게 제거합니다.',
        icon: 'Eraser',
        acceptedFileTypes: ['.jpg', '.png'],
        mockOptions: [
            { id: 'refine', label: '가장자리 보정', type: 'checkbox', defaultValue: true }
        ],
        outputType: 'image'
    },
    {
        id: 'img-upscale',
        name: '이미지 업스케일',
        category: '이미지',
        tags: ['AI', '고화질'],
        shortDesc: '저해상도 이미지를 AI로 선명하게 4배까지 확대합니다.',
        icon: 'Zap',
        acceptedFileTypes: ['.jpg', '.png'],
        mockOptions: [
            { id: 'scale', label: '배율', type: 'select', options: ['2x', '4x'], defaultValue: '2x' }
        ],
        outputType: 'image'
    },
    // 문서
    {
        id: 'pdf-merge',
        name: 'PDF 병합',
        category: '문서',
        tags: ['PDF', '편집'],
        shortDesc: '여러 개의 PDF 파일을 하나로 합칩니다.',
        icon: 'FilePlus',
        acceptedFileTypes: ['.pdf'],
        mockOptions: [
            { id: 'order', label: '페이지 순서 최적화', type: 'checkbox', defaultValue: true }
        ],
        outputType: 'file'
    },
    {
        id: 'pdf-to-word',
        name: 'PDF → Word',
        category: '문서',
        tags: ['변환', 'OCR'],
        shortDesc: 'PDF 문서를 편집 가능한 Word 형식으로 변환합니다.',
        icon: 'FileText',
        acceptedFileTypes: ['.pdf'],
        mockOptions: [
            { id: 'ocr', label: '텍스트 인식(OCR) 활성화', type: 'checkbox', defaultValue: true }
        ],
        outputType: 'file'
    },
    // 오디오
    {
        id: 'audio-stt',
        name: 'STT (음성 → 텍스트)',
        category: '오디오',
        tags: ['AI', '자막'],
        shortDesc: '음성 파일을 분석하여 텍스트 대본으로 변환합니다.',
        icon: 'Mic',
        acceptedFileTypes: ['.mp3', '.wav', '.m4a'],
        mockOptions: [
            { id: 'language', label: '언어 설정', type: 'select', options: ['한국어', '영어', '일본어'], defaultValue: '한국어' },
            { id: 'timestamp', label: '타임스탬프 포함', type: 'checkbox', defaultValue: false }
        ],
        outputType: 'text'
    },
    // 영상
    {
        id: 'video-shorts',
        name: '쇼츠 리사이즈 (9:16)',
        category: '영상',
        tags: ['유튜브', '리사이즈'],
        shortDesc: '가로 영상을 틱톡/릴스/쇼츠용 세로 비율로 변환합니다.',
        icon: 'Video',
        acceptedFileTypes: ['.mp4', '.mov'],
        mockOptions: [
            { id: 'focus', label: '중심 고정 방식', type: 'select', options: ['자동 피사체 추적', '중앙 고정'], defaultValue: '자동 피사체 추적' }
        ],
        outputType: 'file'
    },
    // 텍스트
    {
        id: 'text-summarize',
        name: '텍스트 요약 (AI)',
        category: '텍스트',
        tags: ['AI', '효율'],
        shortDesc: '긴 글을 핵심 내용 위주로 짧게 요약합니다.',
        icon: 'FileStack',
        acceptedFileTypes: ['.txt', '.docx', '.pdf'],
        mockOptions: [
            { id: 'length', label: '요약 길이', type: 'select', options: ['한 문장', '3줄', '상세 요약'], defaultValue: '3줄' }
        ],
        outputType: 'text'
    },
    // 기타
    {
        id: 'qr-gen',
        name: 'QR 코드 생성',
        category: '기타',
        tags: ['마케팅', '링크'],
        shortDesc: 'URL이나 텍스트를 고화질 QR 코드로 생성합니다.',
        icon: 'QrCode',
        acceptedFileTypes: [],
        mockOptions: [
            { id: 'url', label: '연결할 URL', type: 'text', defaultValue: 'https://example.com' },
            { id: 'color', label: '색상', type: 'select', options: ['검정', '파랑', '빨강'], defaultValue: '검정' }
        ],
        outputType: 'image'
    }
];

export const getToolById = (id: string) => TOOLS.find(t => t.id === id);
export const getToolsByCategory = (category: string) =>
    category === 'All' ? TOOLS : TOOLS.filter(t => t.category === category);
