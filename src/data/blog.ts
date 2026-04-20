export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  thumbnail: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-optimize-images",
    title: "이미지 최적화로 웹사이트 로딩 속도 2배 빨라지게 하는 법",
    excerpt: "고화질 이미지를 유지하면서도 용량을 90%까지 줄이는 비결을 공개합니다.",
    date: "2025-04-01",
    category: "가이드",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&auto=format&fit=crop"
  },
  {
    slug: "pdf-merge-guide",
    title: "번거로운 PDF 합치기, 프로그램 설치 없이 10초 만에 끝내기",
    excerpt: "여러 개의 PDF 문서를 하나로 병합하는 가장 안전하고 빠른 방법을 소개합니다.",
    date: "2025-03-28",
    category: "업무 팁",
    thumbnail: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=400&auto=format&fit=crop"
  },
  {
    slug: "qr-marketing-strategy",
    title: "오프라인 매장 매출 올리는 QR 코드 마케팅 활용 사례 5가지",
    excerpt: "메뉴판부터 이벤트 참여까지, QR 코드를 활용한 스마트한 고객 유치 전략을 알아보세요.",
    date: "2025-03-25",
    category: "마케팅",
    thumbnail: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=400&auto=format&fit=crop"
  }
];
