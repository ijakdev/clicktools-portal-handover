export interface Tool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  keywords: string[];
  icon: string;
  isPopular: boolean;
  supportsRealtime: boolean;
  examples: string[];
  seoTitle: string;
  seoDescription: string;
}

export const tools: Tool[] = [
  // 1. 줄/문단 정리
  {
    id: 'remove-line-breaks',
    slug: 'remove-line-breaks',
    name: '줄 바꿈 제거',
    shortDescription: '문장의 모든 줄 바꿈을 제거하여 한 줄로 만듭니다.',
    fullDescription: '텍스트의 줄 바꿈(엔터)을 제거하여 끊김 없는 하나의 문단으로 변환합니다.',
    category: 'cleanup',
    keywords: ['줄바꿈', '엔터제거', '라인브레이크', '한줄로'],
    icon: 'RemoveLines',
    isPopular: true,
    supportsRealtime: true,
    examples: ['여러 줄로 된 시를 한 줄로 만들기', 'PDF 복사 텍스트 정리'],
    seoTitle: '줄 바꿈 제거기 - 텍스트를 한 줄로 깔끔하게 정리',
    seoDescription: '텍스트의 모든 줄 바꿈을 제거하여 하나의 문단으로 합쳐줍니다. 쉽고 빠른 온라인 도구.'
  },
  {
    id: 'remove-empty-lines',
    slug: 'remove-empty-lines',
    name: '빈 줄 제거',
    shortDescription: '텍스트 사이의 불필요한 빈 줄을 모두 제거합니다.',
    fullDescription: '텍스트 중간중간 섞여 있는 빈 라인을 찾아 제거하여 결과물을 압축합니다.',
    category: 'cleanup',
    keywords: ['빈줄', '공백라인', '줄정리'],
    icon: 'EmptyLines',
    isPopular: true,
    supportsRealtime: true,
    examples: ['코드 정리', '명단 정리'],
    seoTitle: '빈 줄 제거 - 텍스트 공백 라인 정리 도구',
    seoDescription: '텍스트에서 불필요한 빈 줄을 즉시 제거하여 내용을 정돈하세요.'
  },
  {
    id: 'remove-duplicate-lines',
    slug: 'remove-duplicate-lines',
    name: '중복 줄 제거',
    shortDescription: '중복되는 줄을 찾아 하나만 남기고 삭제합니다.',
    fullDescription: '목록에서 중복된 항목을 자동으로 감지하여 고유한 항목만 남깁니다.',
    category: 'cleanup',
    keywords: ['중복제거', '유니크', '중복삭제'],
    icon: 'DuplicateLines',
    isPopular: true,
    supportsRealtime: true,
    examples: ['이메일 리스트 중복 제거', '단어장 정리'],
    seoTitle: '중복 줄 제거 - 리스트에서 중복 항목 삭제하기',
    seoDescription: '중복된 텍스트 줄을 한 번에 정리하여 고유한 목록을 만드세요.'
  },
  
  // 2. HTML/웹 변환
  {
    id: 'strip-html-tags',
    slug: 'strip-html-tags',
    name: 'HTML 태그 제거',
    shortDescription: 'HTML 코드에서 텍스트만 추출하고 태그는 삭제합니다.',
    fullDescription: 'HTML 문서나 코드 스니펫에서 모든 태그(<...>)를 지우고 순수 텍스트 내용만 남깁니다.',
    category: 'html-web',
    keywords: ['html제거', '태그삭제', '순수텍스트', '추출'],
    icon: 'CodeIcon',
    isPopular: true,
    supportsRealtime: true,
    examples: ['웹페이지 본문만 복사하기', 'HTML 코드 정리'],
    seoTitle: 'HTML 태그 제거 - 온라인 HTML 텍스트 추출기',
    seoDescription: '복잡한 HTML 코드에서 태그만 말끔히 제거하고 순수 텍스트를 추출하세요.'
  },
  {
    id: 'text-to-html',
    slug: 'text-to-html',
    name: '텍스트 → HTML 변환',
    shortDescription: '일반 텍스트를 HTML 형식(p, br 태그 등)으로 바꿉니다.',
    fullDescription: '줄 바꿈이 포함된 텍스트를 웹에서 보기 편하도록 <p> 또는 <br> 태그가 포함된 HTML 코드로 변환합니다.',
    category: 'html-web',
    keywords: ['html변환', '텍스트tohtml', '태그추가'],
    icon: 'HtmlIcon',
    isPopular: false,
    supportsRealtime: true,
    examples: ['블로그 글 작성 보조', '게시판 텍스트 변환'],
    seoTitle: '텍스트 HTML 변환기 - 편리한 웹 코드 생성',
    seoDescription: '텍스트를 자동으로 HTML 태그 형식으로 바꾸어 웹페이지용 코드를 생성합니다.'
  },

  // 3. 정렬/필터
  {
    id: 'alphabetical-sort',
    slug: 'alphabetical-sort',
    name: '알파벳순/가나다순 정렬',
    shortDescription: '텍스트 줄을 가나다 또는 ABC 순서로 정렬합니다.',
    fullDescription: '목록 형태의 텍스트를 사전 순서대로 오름차순 또는 내림차순 정렬합니다.',
    category: 'sort-filter',
    keywords: ['정렬', '순서바꾸기', '가나다순', '알파벳순'],
    icon: 'SortIcon',
    isPopular: true,
    supportsRealtime: true,
    examples: ['이름 목록 정렬', '단어 리스트 정리'],
    seoTitle: '텍스트 정렬 도구 - 가나다순/알파벳순 온라인 정렬',
    seoDescription: '텍스트를 쉽고 빠르게 정렬하여 목록의 순서를 깔끔하게 맞추세요.'
  },

  // 4. 대소문자/문자 변환
  {
    id: 'uppercase',
    slug: 'uppercase',
    name: '대문자 변환',
    shortDescription: '모든 영문자를 대문자(ABC)로 바꿉니다.',
    fullDescription: '입력된 영문 소문자를 전부 대문자로 일괄 변환합니다.',
    category: 'case-convert',
    keywords: ['대문자', '영문대문자', '변환'],
    icon: 'UppercaseIcon',
    isPopular: true,
    supportsRealtime: true,
    examples: ['ID 생성', '강조 문구 작성'],
    seoTitle: '대문자 변환기 - 영문 소문자를 대문자로 한 번에',
    seoDescription: '영문 텍스트를 즉시 대문자로 바꿀 수 있는 무료 온라인 도구입니다.'
  },
  {
    id: 'lowercase',
    slug: 'lowercase',
    name: '소문자 변환',
    shortDescription: '모든 영문자를 소문자(abc)로 바꿉니다.',
    fullDescription: '입력된 영문 대문자를 전부 소문자로 일괄 변환합니다.',
    category: 'case-convert',
    keywords: ['소문자', '영문소문자', '변환'],
    icon: 'LowercaseIcon',
    isPopular: true,
    supportsRealtime: true,
    examples: ['이메일 주소 정리', '코드 네이밍'],
    seoTitle: '소문자 변환기 - 모든 영문을 소문자로 즉시 변경',
    seoDescription: '대문자로 된 영문 텍스트를 간편하게 소문자로 변환하세요.'
  },
  {
    id: 'to-title-case',
    slug: 'to-title-case',
    name: '각 단어 첫 글자 대문자',
    shortDescription: '모든 단어의 첫 글자만 대문자로 변환합니다.',
    fullDescription: '영문 텍스트의 각 단어 시작을 대문자로 바꿔 제목 스타일(Title Case)로 만듭니다.',
    category: 'case-convert',
    keywords: ['타이틀케이스', '제목스타일', '첫글자대문자'],
    icon: 'TitleCaseIcon',
    isPopular: false,
    supportsRealtime: true,
    examples: ['도서 제목 정리', '영상 제목 작성'],
    seoTitle: 'Title Case 변환기 - 영문 각 단어 첫 글자 대문자로',
    seoDescription: '영문 텍스트를 제목 형식으로 세련되게 변환해 주는 도구입니다.'
  },
  {
    id: 'remove-spaces',
    slug: 'remove-spaces',
    name: '공백 제거',
    shortDescription: '텍스트 내의 모든 공백을 완전히 삭제합니다.',
    fullDescription: '띄어쓰기, 탭, 줄 바꿈 등 모든 종류의 공백을 제거하여 붙여넣은 텍스트로 만듭니다.',
    category: 'case-convert',
    keywords: ['공백제거', '띄어쓰기제거', '압축'],
    icon: 'RemoveSpacesIcon',
    isPopular: false,
    supportsRealtime: true,
    examples: ['비밀번호 생성 보조', '코드 압축'],
    seoTitle: '공백 제거기 - 텍스트 내 모든 띄어쓰기 삭제',
    seoDescription: '텍스트에서 불필요한 모든 공백을 즉시 제거하여 내용을 하나로 합치세요.'
  },
  {
    id: 'remove-numbers',
    slug: 'remove-numbers',
    name: '숫자 제거',
    shortDescription: '텍스트에서 모든 숫자를 찾아 삭제합니다.',
    fullDescription: '문자열에 포함된 0부터 9까지의 모든 숫자를 일괄 제거합니다.',
    category: 'case-convert',
    keywords: ['숫자제거', '숫자삭제', '텍스트만남기'],
    icon: 'RemoveNumbersIcon',
    isPopular: false,
    supportsRealtime: true,
    examples: ['전화번호에서 숫자만 빼기', '혼합 텍스트 정제'],
    seoTitle: '숫자 제거기 - 텍스트에서 숫자만 깨끗하게 삭제',
    seoDescription: '문서에서 모든 숫자를 제거하고 순수 문자열만 남기세요.'
  },

  // 5. 카운터/분석
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: '문자/단어 수 세기',
    shortDescription: '글자 수(공백 포함/제외)와 단어 수를 세어줍니다.',
    fullDescription: '입력한 텍스트의 전체 글자 수, 공백 제외 글자 수, 단어 수, 문장 수, 줄 수를 실시간으로 계산합니다.',
    category: 'counter-analyze',
    keywords: ['글자수세기', '단어수', '문자카운트', '자소서글자수'],
    icon: 'CounterIcon',
    isPopular: true,
    supportsRealtime: true,
    examples: ['자기소개서 분량 체크', '블로그 포스팅 길이 확인'],
    seoTitle: '글자수세기 도구 - 정확한 문자 및 단어 수 측정',
    seoDescription: '공백 포함/제외 글자 수와 단어 수를 실시간으로 확인하고 텍스트 길이를 조절하세요.'
  },
  {
    id: 'word-frequency',
    slug: 'word-frequency',
    name: '자주 나온 단어 분석',
    shortDescription: '텍스트에서 어떤 단어가 가장 많이 쓰였는지 분석합니다.',
    fullDescription: '텍스트 전체를 분석하여 사용 빈도가 높은 핵심 키워드 순위를 추출합니다.',
    category: 'counter-analyze',
    keywords: ['키워드분석', '단어빈도', '자주쓰는단어'],
    icon: 'FrequencyIcon',
    isPopular: false,
    supportsRealtime: false,
    examples: ['작성한 글의 핵심 키워드 확인', '문장 패턴 분석'],
    seoTitle: '단어 빈도 분석기 - 텍스트 키워드 순위 추출',
    seoDescription: '내 글에서 가장 많이 사용된 단어가 무엇인지 즉시 분석해 보세요.'
  },

  // 6. 랜덤/생성기
  {
    id: 'random-picker',
    slug: 'random-picker',
    name: '랜덤 선택 생성기',
    shortDescription: '목록 중에서 하나 이상을 랜덤으로 골라줍니다.',
    fullDescription: '입력된 항목들(줄 단위) 중에서 설정한 개수만큼 무작위로 선택합니다.',
    category: 'random-generator',
    keywords: ['추첨', '랜덤추첨', '뽑기', '무작위'],
    icon: 'PickerIcon',
    isPopular: true,
    supportsRealtime: false,
    examples: ['점심 메뉴 고르기', '당첨자 추첨'],
    seoTitle: '랜덤 항목 추첨기 - 목록에서 무작위 선택 도구',
    seoDescription: '입력한 리스트에서 공정하게 랜덤으로 항목을 뽑아주는 온라인 도구입니다.'
  },

  // 7. 인코딩/디코딩
  {
    id: 'base64-encode-decode',
    slug: 'base64-encode-decode',
    name: 'Base64 인코딩/디코딩',
    shortDescription: '텍스트를 Base64 형식으로 바꾸거나 되돌립니다.',
    fullDescription: '문자열을 64진법 숫자로 인코딩하거나, 인코딩된 데이터를 원래 텍스트로 복구합니다.',
    category: 'encoding-decoding',
    keywords: ['base64', '인코딩', '디코딩', '변환'],
    icon: 'Base64Icon',
    isPopular: true,
    supportsRealtime: true,
    examples: ['데이터 암호화 보조', '이미지 코드 변환'],
    seoTitle: 'Base64 인코딩/디코딩 - 온라인 64진법 변환기',
    seoDescription: '텍스트를 Base64로 간편하게 인코딩하거나 디코딩하세요.'
  },
  {
    id: 'url-encode-decode',
    slug: 'url-encode-decode',
    name: 'URL 인코딩/디코딩',
    shortDescription: '특수문자가 포함된 URL을 인코딩하거나 복구합니다.',
    fullDescription: '웹 주소에 사용되는 특수 기호들을 인코딩(Percent-encoding)하거나 원래 문자로 변환합니다.',
    category: 'encoding-decoding',
    keywords: ['url인코딩', '퍼센트인코딩', '주소변환'],
    icon: 'UrlIcon',
    isPopular: true,
    supportsRealtime: true,
    examples: ['한글 URL 주소 정리', '파라미터 안전 변환'],
    seoTitle: 'URL 인코딩/디코딩 - 복잡한 주소 깔끔하게 변환하기',
    seoDescription: '웹 브라우저에서 읽을 수 있도록 URL을 인코딩하거나 보기 좋게 디코딩하세요.'
  }
];
