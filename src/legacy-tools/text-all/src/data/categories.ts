export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'cleanup',
    slug: 'text-cleanup',
    name: '줄/문단 정리',
    description: '줄 바꿈, 빈 줄, 중복 줄 등을 깔끔하게 정리합니다.',
    icon: 'LinesIcon',
    color: 'blue'
  },
  {
    id: 'html-web',
    slug: 'html-web-convert',
    name: 'HTML/웹 변환',
    description: 'HTML 태그 제거 및 엔티티, URL 인코딩/디코딩 기능을 제공합니다.',
    icon: 'CodeIcon',
    color: 'emerald'
  },
  {
    id: 'sort-filter',
    slug: 'sort-filter',
    name: '정렬/필터/중복 제거',
    description: '텍스트를 정렬하거나 특정 조건으로 필터링합니다.',
    icon: 'SortIcon',
    color: 'amber'
  },
  {
    id: 'case-convert',
    slug: 'case-convert',
    name: '대소문자/문자 변환',
    description: '대소문자 전환 및 숫자, 특수문자 제거 기능을 제공합니다.',
    icon: 'CaseIcon',
    color: 'purple'
  },
  {
    id: 'counter-analyze',
    slug: 'counter-analyze',
    name: '카운터/분석',
    description: '글자 수, 단어 수 세기 및 자주 등장하는 단어를 분석합니다.',
    icon: 'ChartIcon',
    color: 'pink'
  },
  {
    id: 'random-generator',
    slug: 'random-generator',
    name: '랜덤/생성기',
    description: '랜덤 선택, 문자열 생성, 비밀번호 생성 기능을 제공합니다.',
    icon: 'ShuffleIcon',
    color: 'indigo'
  },
  {
    id: 'encoding-decoding',
    slug: 'encoding-decoding',
    name: '인코딩/디코딩',
    description: 'Base64, ROT13, 유니코드 변환 기능을 제공합니다.',
    icon: 'LockIcon',
    color: 'orange'
  }
];
