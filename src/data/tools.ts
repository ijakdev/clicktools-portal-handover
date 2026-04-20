export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: "Image" | "Document" | "Link" | "Text" | "Media" | "Calculator";
  icon: string;
  path: string;
  features: string[]; // For Metadata compatibility
  usage: string[];    // For Metadata compatibility
  whyNeeded: string[];
  useCases: string[];
  usageSteps: string[];
  coreSummary: string;
  faq: { q: string; a: string }[];
  color: string;
  bgColor: string;
  brandColor: string;
  guideTitle?: string;
}

export const TOOLS: Tool[] = [
  {
    id: "smart-calc-box",
    name: "스마트 계산기",
    description: "업무와 생활에 필요한 모든 계산을 한 번에 해결하세요.",
    guideTitle: "📏 스마트 계산 완벽 정리 | 단위 변환·수치 계산 한 번에",
    longDescription: "길이 단위는 건축, 쇼핑, 지도 등 일상 전반에서 활용됩니다.\n이미지 크기나 제품 규격이 헷갈릴 때 정확한 수치 계산이 중요합니다.\n\n복잡한 계산 없이\n필요한 값을 빠르게 확인하는 것이 핵심입니다.\n\n👉 스마트 계산으로 단위 변환과 다양한 수치를 쉽고 빠르게 확인해보세요.",
    category: "Calculator",
    icon: "Calculator",
    path: "/tools/smart-calc-box",
    features: ["계산 실수 방지", "시간 절약", "반복 작업 효율 증가", "생활비 계산 / 할인 계산", "업무 수치 계산", "빠른 결과 확인"],
    usage: ["숫자 입력", "연산 선택", "결과 확인"],
    whyNeeded: ["계산 실수 방지", "시간 절약", "반복 작업 효율 증가"],
    useCases: ["생활비 계산 / 할인 계산", "업무 수치 계산", "빠른 결과 확인"],
    usageSteps: ["숫자 입력", "연산 선택", "결과 확인"],
    coreSummary: "생각할 시간 없이 바로 계산하고 끝내세요.",
    faq: [
      { q: "회원가입이 필요한가요?", a: "아니요, 회원가입 없이 즉시 사용 가능합니다." },
      { q: "모바일에서도 사용 가능한가요?", a: "네, 스마트폰과 태블릿 환경에 완벽하게 최적화되어 있습니다." }
    ],
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    brandColor: "bg-blue-600"
  },
  {
    id: "image-resizer",
    name: "이미지 리사이징",
    description: "블로그, SNS용 이미지 크기를 손쉽게 조절하세요.",
    guideTitle: "이미지 리사이징 완벽 정리 | 크기 조정·해상도 최적화 한 번에",
    longDescription: "이미지 크기가 맞지 않으면 업로드 오류가 발생하거나\n화질 저하, 페이지 로딩 속도 문제로 이어질 수 있습니다.\n웹사이트, SNS, 쇼핑몰에 맞는 최적의 이미지 사이즈가 중요합니다.\n\n👉 이미지 리사이징을 활용해 원하는 크기로 빠르게 조정하고, 해상도와 품질까지 동시에 최적화하세요.",
    category: "Image",
    icon: "Maximize",
    path: "/tools/image-resizer",
    features: ["SNS 업로드 제한", "블로그 이미지 최적화", "쇼핑몰 상품 이미지 규격", "인스타 / 블로그 이미지 조정", "썸네일 제작", "웹 최적화"],
    usage: ["이미지 업로드", "크기 설정", "다운로드"],
    whyNeeded: ["SNS 업로드 제한", "블로그 이미지 최적화", "쇼핑몰 상품 이미지 규격"],
    useCases: ["인스타 / 블로그 이미지 조정", "썸네일 제작", "웹 최적화"],
    usageSteps: ["이미지 업로드", "크기 설정", "다운로드"],
    coreSummary: "사이즈 고민 없이 한 번에 해결됩니다.",
    faq: [
      { q: "한 번에 여러 장의 사진을 바꿀 수 있나요?", a: "네, 여러 파일을 동시에 업로드하여 일괄 처리가 가능합니다." }
    ],
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    brandColor: "bg-orange-500"
  },
  {
    id: "pdf-utility",
    name: "PDF 유틸리티",
    description: "PDF 변환, 병합, 분할을 클릭 한 번으로 처리하세요.",
    guideTitle: "📄 PDF 유틸리티 완벽 정리 | 변환·분할·편집 한 번에 해결",
    longDescription: "PDF 파일은 업무, 학습, 문서 공유에서 필수로 사용됩니다.\n하지만 변환, 분할, 병합, 편집 작업이 번거롭게 느껴질 때가 많습니다.\n\n여러 프로그램을 따로 사용할 필요 없이\n하나의 도구로 빠르게 처리하는 것이 효율적입니다.\n\n👉 PDF 유틸리티로 변환, 분할, 병합, 편집까지 한 번에 간편하게 해결하세요.",
    category: "Document",
    icon: "FileText",
    path: "/tools/pdf-utility",
    features: ["문서 제출", "파일 형식 변환", "자료 정리", "PDF 변환 / 병합", "문서 관리", "보고서 제출"],
    usage: ["파일 업로드", "기능 선택", "결과 다운로드"],
    whyNeeded: ["문서 제출", "파일 형식 변환", "자료 정리"],
    useCases: ["PDF 변환 / 병합", "문서 관리", "보고서 제출"],
    usageSteps: ["파일 업로드", "기능 선택", "결과 다운로드"],
    coreSummary: "복잡한 PDF 작업도 한 번에 끝납니다.",
    faq: [
      { q: "파일 보안은 안전한가요?", a: "업로드된 파일은 작업 완료 후 서버에서 즉시 삭제되므로 안심하고 사용하셔도 됩니다." }
    ],
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    brandColor: "bg-rose-500"
  },
  {
    id: "url-shortener",
    name: "숏 URL 생성기",
    description: "길고 복잡한 URL을 공유하기 쉬운 짧은 링크로 줄여줍니다.",
    guideTitle: "🔗 숏 URL 생성기 완벽 정리 | 링크 단축·클릭률 상승 한 번에",
    longDescription: "긴 URL은 가독성이 떨어지고 전달력이 낮아질 수 있습니다.\n특히 SNS, 마케팅, 공유 링크에서는 짧고 깔끔한 링크가 중요합니다.\n\n불필요하게 긴 주소 대신\n누구나 쉽게 클릭하고 공유할 수 있는 형태로 바꾸는 것이 핵심입니다.\n\n👉 숏 URL 생성기로 링크를 간단하게 줄이고, 클릭률과 전달력을 동시에 높여보세요.",
    category: "Link",
    icon: "Link2",
    path: "/tools/url-shortener",
    features: ["가독성 향상", "클릭률 증가", "공유 편의성", "SNS 공유", "마케팅 링크", "쿠팡 파트너스"],
    usage: ["URL 입력", "생성", "복사"],
    whyNeeded: ["가독성 향상", "클릭률 증가", "공유 편의성"],
    useCases: ["SNS 공유", "마케팅 링크", "쿠팡 파트너스"],
    usageSteps: ["URL 입력", "생성", "복사"],
    coreSummary: "링크 하나로 결과가 달라집니다.",
    faq: [
      { q: "생성된 링크는 언제까지 유효한가요?", a: "별도의 삭제 요청이 없는 한 영구적으로 유지됩니다." }
    ],
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    brandColor: "bg-indigo-600"
  },
  {
    id: "qr-generator",
    name: "QR 코드 생성기",
    description: "링크, 텍스트, 명함을 위한 무제한 QR 코드를 만드세요.",
    guideTitle: "📱 QR 코드 생성기 완벽 정리 | 빠른 연결·즉시 공유 한 번에",
    longDescription: "텍스트보다 빠르게 정보를 전달하는 방법, 바로 QR 코드입니다.\nURL, 연락처, 위치, 결제 정보까지 한 번에 전달할 수 있습니다.\n\n복잡한 입력 없이\n스캔 한 번으로 원하는 정보에 바로 접근할 수 있는 것이 핵심입니다.\n\n👉 QR 코드 생성기로 쉽고 빠르게 만들고, 한 번의 스캔으로 바로 연결해보세요.",
    category: "Link",
    icon: "QrCode",
    path: "/tools/qr-generator",
    features: ["빠른 접근", "오프라인 활용", "링크 공유 간편", "명함 / 전단지", "매장 안내", "이벤트 페이지"],
    usage: ["링크 입력", "QR 생성", "이미지 저장"],
    whyNeeded: ["빠른 접근", "오프라인 활용", "링크 공유 간편"],
    useCases: ["명함 / 전단지", "매장 안내", "이벤트 페이지"],
    usageSteps: ["링크 입력", "QR 생성", "이미지 저장"],
    coreSummary: "클릭 없이 연결되는 가장 빠른 방법입니다.",
    faq: [
      { q: "상업적인 용도로 사용해도 되나요?", a: "네, 상업적/비상업적 용도 모두 무료로 사용 가능합니다." }
    ],
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    brandColor: "bg-cyan-600"
  },
  {
    id: "text-all",
    name: "텍스트 올인원",
    description: "문장 비교, 변환, 정리를 한 곳에서 처리하세요.",
    guideTitle: "📝 텍스트 비교 완벽 정리 | 문서 차이·변경 내용 한눈에 확인",
    longDescription: "문서 수정이나 내용 변경을 확인할 때\n작은 차이 하나가 중요한 결과를 만들 수 있습니다.\n\n직접 비교하기 어려운 긴 텍스트도\n자동 비교 기능을 활용하면 빠르고 정확하게 확인할 수 있습니다.\n\n👉 텍스트 비교 기능으로 변경된 부분을 즉시 찾아내고, 작업 효율을 높여보세요.",
    category: "Text",
    icon: "Type",
    path: "/tools/text-all",
    features: ["수정 내용 확인", "오류 발견", "문서 비교", "계약서 비교", "코드 변경 확인", "글 수정 검토"],
    usage: ["텍스트 입력", "비교 실행", "차이 확인"],
    whyNeeded: ["수정 내용 확인", "오류 발견", "문서 비교"],
    useCases: ["계약서 비교", "코드 변경 확인", "글 수정 검토"],
    usageSteps: ["텍스트 입력", "비교 실행", "차이 확인"],
    coreSummary: "눈으로 찾지 말고 자동으로 확인하세요.",
    faq: [
      { q: "긴 문장도 비교가 가능한가요?", a: "네, 대용량 텍스트 비교 알고리즘이 적용되어 있어 원활하게 작동합니다." }
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    brandColor: "bg-purple-600"
  },
  {
    id: "image-compress",
    name: "이미지 압축",
    description: "용량 걱정 없이 고화질을 유지하며 이미지를 압축하세요.",
    guideTitle: "🗜️ 이미지 압축 완벽 정리 | 용량 줄이기·속도 최적화 한 번에",
    longDescription: "이미지 용량이 크면 페이지 로딩 속도가 느려지고\n웹사이트, 쇼핑몰, SNS에서 성능 저하로 이어질 수 있습니다.\n\n불필요하게 큰 파일을 그대로 사용하기보다\n품질을 유지하면서 용량만 줄이는 것이 중요합니다.\n\n👉 이미지 압축으로 화질 손상 없이 용량을 줄이고, 빠른 속도를 경험해보세요.",
    category: "Image",
    icon: "FileImage",
    path: "/tools/image-compress",
    features: ["웹 속도 개선", "저장 공간 절약", "업로드 제한 해결", "블로그 최적화", "쇼핑몰 이미지", "사이트 속도 개선"],
    usage: ["이미지 업로드", "압축 실행", "다운로드"],
    whyNeeded: ["웹 속도 개선", "저장 공간 절약", "업로드 제한 해결"],
    useCases: ["블로그 최적화", "쇼핑몰 이미지", "사이트 속도 개선"],
    usageSteps: ["이미지 업로드", "압축 실행", "다운로드"],
    coreSummary: "가볍게 만들고 빠르게 사용하세요.",
    faq: [
      { q: "어떤 포맷을 지원하나요?", a: "JPG, PNG, WebP 등 주요 이미지 포맷을 모두 지원합니다." }
    ],
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    brandColor: "bg-orange-500"
  },
  {
    id: "video-to-audio",
    name: "영상 오디오 변환기",
    description: "동영상에서 소리만 깨끗하게 추출하여 저장하세요.",
    guideTitle: "🎧 영상 → 오디오 변환 완벽 정리 | 음원 추출·파일 변환 한 번에",
    longDescription: "영상에서 필요한 건 소리일 때가 많습니다.\n강의, 인터뷰, 음악 등은 오디오만 따로 활용하면 더 편리합니다.\n\n불필요한 영상 없이\n가볍고 효율적인 파일로 변환하는 것이 핵심입니다.\n\n👉 영상 → 오디오 변환기로 음원만 빠르게 추출하고, 원하는 형식으로 활용해보세요.",
    category: "Media",
    icon: "Music",
    path: "/tools/video-to-audio",
    features: ["강의 음성 저장", "인터뷰 활용", "콘텐츠 재사용", "유튜브 음성 추출", "강의 녹음 저장", "편집 작업"],
    usage: ["영상 업로드", "변환 실행", "오디오 다운로드"],
    whyNeeded: ["강의 음성 저장", "인터뷰 활용", "콘텐츠 재사용"],
    useCases: ["유튜브 음성 추출", "강의 녹음 저장", "편집 작업"],
    usageSteps: ["영상 업로드", "변환 실행", "오디오 다운로드"],
    coreSummary: "필요한 건 소리, 영상은 필요 없습니다.",
    faq: [
      { q: "변환된 오디오 음질은 어떤가요?", a: "원본 영상의 오디오 데이터 품질을 최대한 보존하여 추출합니다." }
    ],
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    brandColor: "bg-pink-600"
  }
];
