export interface TextAction {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  icon: string;
  isPopular: boolean;
  supportsRealtime: boolean;
}

export const TEXT_ACTIONS: TextAction[] = [
  {
    id: 'remove-line-breaks',
    slug: 'remove-line-breaks',
    name: '줄 바꿈 제거',
    shortDescription: '문장의 모든 줄 바꿈을 제거하여 한 줄로 만듭니다.',
    fullDescription: '텍스트의 줄 바꿈(엔터)을 제거하여 끊김 없는 하나의 문단으로 변환합니다.',
    category: 'cleanup',
    icon: 'Scissors',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'remove-empty-lines',
    slug: 'remove-empty-lines',
    name: '빈 줄 제거',
    shortDescription: '텍스트 사이의 불필요한 빈 줄을 모두 제거합니다.',
    fullDescription: '텍스트 중간중간 섞여 있는 빈 라인을 찾아 제거하여 결과물을 압축합니다.',
    category: 'cleanup',
    icon: 'Eraser',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'remove-duplicate-lines',
    slug: 'remove-duplicate-lines',
    name: '중복 줄 제거',
    shortDescription: '중복되는 줄을 찾아 하나만 남기고 삭제합니다.',
    fullDescription: '목록에서 중복된 항목을 자동으로 감지하여 고유한 항목만 남깁니다.',
    category: 'cleanup',
    icon: 'Trash2',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'strip-html-tags',
    slug: 'strip-html-tags',
    name: 'HTML 태그 제거',
    shortDescription: 'HTML 코드에서 텍스트만 추출하고 태그는 삭제합니다.',
    fullDescription: 'HTML 문서나 코드 스니펫에서 모든 태그(<...>)를 지우고 순수 텍스트 내용만 남깁니다.',
    category: 'html-web',
    icon: 'Code',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'text-to-html',
    slug: 'text-to-html',
    name: '텍스트 → HTML 변환',
    shortDescription: '일반 텍스트를 HTML 형식(p, br 태그 등)으로 바꿉니다.',
    fullDescription: '줄 바꿈이 포함된 텍스트를 웹에서 보기 편하도록 <p> 또는 <br> 태그가 포함된 HTML 코드로 변환합니다.',
    category: 'html-web',
    icon: 'FileText',
    isPopular: false,
    supportsRealtime: true
  },
  {
    id: 'alphabetical-sort',
    slug: 'alphabetical-sort',
    name: '알파벳순/가나다순 정렬',
    shortDescription: '텍스트 줄을 가나다 또는 ABC 순서로 정렬합니다.',
    fullDescription: '목록 형태의 텍스트를 사전 순서대로 오름차순 또는 내림차순 정렬합니다.',
    category: 'sort-filter',
    icon: 'ArrowDownUp',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'uppercase',
    slug: 'uppercase',
    name: '대문자 변환',
    shortDescription: '모든 영문자를 대문자(ABC)로 바꿉니다.',
    fullDescription: '입력된 영문 소문자를 전부 대문자로 일괄 변환합니다.',
    category: 'case-convert',
    icon: 'Type',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'lowercase',
    slug: 'lowercase',
    name: '소문자 변환',
    shortDescription: '모든 영문자를 소문자(abc)로 바꿉니다.',
    fullDescription: '입력된 영문 대문자를 전부 소문자로 일괄 변환합니다.',
    category: 'case-convert',
    icon: 'Type',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'to-title-case',
    slug: 'to-title-case',
    name: '각 단어 첫 글자 대문자',
    shortDescription: '모든 단어의 첫 글자만 대문자로 변환합니다.',
    fullDescription: '영문 텍스트의 각 단어 시작을 대문자로 바꿔 제목 스타일(Title Case)로 만듭니다.',
    category: 'case-convert',
    icon: 'Type',
    isPopular: false,
    supportsRealtime: true
  },
  {
    id: 'remove-spaces',
    slug: 'remove-spaces',
    name: '공백 제거',
    shortDescription: '텍스트 내의 모든 공백을 완전히 삭제합니다.',
    fullDescription: '띄어쓰기, 탭, 줄 바꿈 등 모든 종류의 공백을 제거하여 붙여넣은 텍스트로 만듭니다.',
    category: 'case-convert',
    icon: 'ListFilter',
    isPopular: false,
    supportsRealtime: true
  },
  {
    id: 'remove-numbers',
    slug: 'remove-numbers',
    name: '숫자 제거',
    shortDescription: '텍스트에서 모든 숫자를 찾아 삭제합니다.',
    fullDescription: '문자열에 포함된 0부터 9까지의 모든 숫자를 일괄 제거합니다.',
    category: 'case-convert',
    icon: 'Hash',
    isPopular: false,
    supportsRealtime: true
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: '문자/단어 수 세기',
    shortDescription: '글자 수(공백 포함/제외)와 단어 수를 세어줍니다.',
    fullDescription: '입력한 텍스트의 전체 글자 수, 공백 제외 글자 수, 단어 수, 문장 수, 줄 수를 실시간으로 계산합니다.',
    category: 'counter-analyze',
    icon: 'Zap',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'word-frequency',
    slug: 'word-frequency',
    name: '자주 나온 단어 분석',
    shortDescription: '텍스트에서 어떤 단어가 가장 많이 쓰였는지 분석합니다.',
    fullDescription: '텍스트 전체를 분석하여 사용 빈도가 높은 핵심 키워드 순위를 추출합니다.',
    category: 'counter-analyze',
    icon: 'ListFilter',
    isPopular: false,
    supportsRealtime: true
  },
  {
    id: 'random-picker',
    slug: 'random-picker',
    name: '랜덤 선택 생성기',
    shortDescription: '목록 중에서 하나 이상을 랜덤으로 골라줍니다.',
    fullDescription: '입력된 항목들(줄 단위) 중에서 설정한 개수만큼 무작위로 선택합니다.',
    category: 'random-generator',
    icon: 'RefreshCw',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'base64-encode-decode',
    slug: 'base64-encode-decode',
    name: 'Base64 인코딩/디코딩',
    shortDescription: '텍스트를 Base64 형식으로 바꾸거나 되돌립니다.',
    fullDescription: '문자열을 64진법 숫자로 인코딩하거나, 인코딩된 데이터를 원래 텍스트로 복구합니다.',
    category: 'encoding-decoding',
    icon: 'Code',
    isPopular: true,
    supportsRealtime: true
  },
  {
    id: 'url-encode-decode',
    slug: 'url-encode-decode',
    name: 'URL 인코딩/디코딩',
    shortDescription: '특수문자가 포함된 URL을 인코딩하거나 복구합니다.',
    fullDescription: '웹 주소에 사용되는 특수 기호들을 인코딩(Percent-encoding)하거나 원래 문자로 변환합니다.',
    category: 'encoding-decoding',
    icon: 'LinkIcon',
    isPopular: true,
    supportsRealtime: true
  }
];
