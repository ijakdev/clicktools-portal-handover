import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { Calendar, User, ArrowLeft, Calculator, Wrench, ChevronRight, FileText, Type } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const db = await getDb();
  
  // 예약된 포스트는 메타데이터에서도 제외 (404 처리와 동일한 로직)
  const post = await db.get(
    "SELECT title, excerpt FROM blog_posts WHERE slug = ? AND (published_at IS NULL OR published_at = '' OR datetime(published_at) <= datetime('now', 'localtime'))", 
    [slugStr]
  );
  
  if (!post) return { 
    title: '페이지를 찾을 수 없습니다 | ClickTools',
    robots: { index: false, follow: false }
  };

  return {
    title: `${post.title} | ClickTools 블로그`,
    description: post.excerpt,
  };
}

const PREMIUM_STYLES = `
    .blog-content h2 { 
        font-size: 2.25rem !important; 
        line-height: 2.5rem !important; 
        font-weight: 900 !important; 
        margin-top: 5rem !important; 
        margin-bottom: 2.5rem !important; 
        color: #0f172a !important; 
        border-left: 12px solid #2563eb !important; 
        padding-left: 2rem !important; 
        letter-spacing: -0.05em !important;
        font-family: var(--font-outfit), sans-serif !important;
        font-style: italic !important;
        text-transform: uppercase !important;
    }
    .blog-content h3 { 
        font-size: 1.875rem !important; 
        line-height: 2.25rem !important; 
        font-weight: 800 !important; 
        margin-top: 4rem !important; 
        margin-bottom: 2rem !important; 
        color: #1e293b !important; 
        letter-spacing: -0.025em !important;
        font-family: var(--font-outfit), sans-serif !important;
    }
    .blog-content p {
        margin-bottom: 2rem !important;
        color: #334155 !important;
    }
    .blog-content figure {
        margin-top: 4rem !important;
        margin-bottom: 4rem !important;
        background-color: #f8fafc !important;
        padding: 2rem !important;
        border: 2px solid #f1f5f9 !important;
        border-radius: 1.5rem !important;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
    }
    .blog-content figcaption {
        margin-top: 1.5rem !important;
        text-align: center !important;
        font-size: 11px !important;
        color: #64748b !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.2em !important;
        opacity: 0.8;
    }
    .blog-content strong {
        font-weight: 900 !important;
        color: #0f172a !important;
    }
`;

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const lastSegment = slug[slug.length - 1];
  const db = await getDb();
  
  // 끝판왕 검색 로직: 전체 경로 일치 -> 슬래시 포함 일치 -> 마지막 조각 일치 순으로 검색
  const post = await db.get(
    `SELECT * FROM blog_posts 
     WHERE (slug = ? OR slug = ? OR slug = ? OR slug = ?) 
     AND (published_at IS NULL OR published_at = '' OR datetime(published_at) <= datetime('now', 'localtime'))`, 
    [slugStr, `/${slugStr}`, slugStr.replace(/^\//, ''), lastSegment]
  );

    if (!post) {
      notFound();
    }

    const formatContent = (content: string, postData: any) => {
        if (!content) return '';
        
        let formatted = content;

        // 0. Dynamic Image Insertion (Markers)
        for (let i = 1; i <= 3; i++) {
            const marker = `{{IMAGE_${i}}}`;
            const imgUrl = postData[`image${i}`];
            const alt = postData[`image${i}_alt`] || '';
            const caption = postData[`image${i}_caption`] || '';

            if (imgUrl) {
                const imgHtml = `
                    <figure class="my-16 group">
                        <div class="aspect-video w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-100 bg-slate-50">
                            <img src="${imgUrl}" alt="${alt}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        ${caption ? `<figcaption class="mt-4 text-center text-sm text-slate-400 font-medium">📸 ${caption}</figcaption>` : ''}
                    </figure>
                `;
                formatted = formatted.replace(marker, imgHtml);
            } else {
                formatted = formatted.replace(marker, ''); // Remove marker if no image
            }
        }

        // 1. Convert Headers (Mixed Markdown and HTML support)
        // Convert Markdown headers first
        formatted = formatted
            .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-black mt-16 mb-8 text-slate-900 border-l-8 border-blue-600 pl-6 tracking-tight font-outfit">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mt-12 mb-6 text-slate-800 tracking-tight font-outfit">$1</h3>');

        // Apply styles to existing <h2> and <h3> tags (from Editor) - ROBUST REGEX
        formatted = formatted.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '<h2 class="text-3xl font-black mt-16 mb-8 text-slate-900 border-l-8 border-blue-600 pl-6 tracking-tight font-outfit">$1</h2>');
        formatted = formatted.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '<h3 class="text-2xl font-bold mt-12 mb-6 text-slate-800 tracking-tight font-outfit">$1</h3>');

        // 2. Bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>');

        // 3. Links [text](url)
        formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 font-bold hover:underline decoration-2 transition-all">$1</a>');

        // 4. Lists
        formatted = formatted.replace(/^\d\.\s+(.*$)/gm, '<li class="ml-6 list-decimal pl-2 mb-2 text-slate-700">$1</li>');
        formatted = formatted.replace(/^-\s+(.*$)/gm, '<li class="ml-6 list-disc pl-2 mb-2 text-slate-700">$1</li>');

        // 5. Horizontal Rule
        formatted = formatted.replace(/^\s*([-*_])(?:\s*\1){2,}\s*$/gm, '<hr class="my-12 border-t-2 border-slate-100" />');

        return formatted;
    };

    return (
    <article className="bg-white min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm text-slate-400 hover:text-blue-600 mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          목록으로 돌아가기
        </Link>

        {/* Post Header */}
        <div className="mb-12">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg mb-6 inline-block">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight font-outfit">
            {post.title}
          </h1>
          <div className="flex items-center space-x-6 text-sm text-slate-400 border-b border-slate-100 pb-8">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{post.created_at.split(' ')[0]}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>클릭툴스 에디터</span>
            </div>
          </div>
        </div>

        {/* Featured Image Section */}
        <div className="mb-16">
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl mb-4 group ring-1 ring-slate-100">
            <img 
              src={post.thumbnail} 
              alt={post.image_alt || post.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          {post.image_caption && (
            <p className="text-center text-sm text-slate-400 font-medium">
              📸 {post.image_caption}
            </p>
          )}
        </div>

        {/* Post Content */}
        <div className="max-w-none text-slate-700 leading-[2.2] text-lg">
          <style dangerouslySetInnerHTML={{ __html: PREMIUM_STYLES }} />
          <p className="mb-16 font-black text-2xl text-slate-900 leading-[1.6] border-l-[12px] border-blue-600 pl-10 py-10 bg-slate-50 italic">
            {post.excerpt}
          </p>
          
          <div 
            className="blog-content prose prose-slate prose-indigo max-w-none whitespace-pre-wrap leading-relaxed space-y-8"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content, post) }} 
          />
        </div>

        {/* Reference-Grade Premium Tool Hub Section */}
        <div className="mt-24 pt-16 border-t border-slate-100">
          <div className="space-y-12">
            {/* Smart Utility Category */}
            <section>
              <div className="bg-[#48b4b4] text-white p-3 px-5 rounded-t-lg flex items-center gap-3 shadow-sm">
                <Calculator className="w-5 h-5" />
                <h3 className="text-lg font-black tracking-tight">스마트 유틸리티 (20)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-slate-50/50 p-4 border-x border-b border-slate-100 rounded-b-lg gap-2">
                {[
                  { title: "스마트 계산기", id: "" }, 
                  { title: "BMI 계산기", id: "bmi" }, 
                  { title: "퍼센트 계산", id: "pct" }, 
                  { title: "대출 계산기", id: "loan" }, 
                  { title: "이자 계산기", id: "interest" }, 
                  { title: "넓이 변환", id: "area" }, 
                  { title: "무게 변환", id: "weight" }, 
                  { title: "부피 변환", id: "vol" }, 
                  { title: "온도 변환", id: "temp" }, 
                  { title: "압력 변환", id: "press" }, 
                  { title: "속도 변환", id: "speed" }, 
                  { title: "연비 변환", id: "fuel" }, 
                  { title: "데이터양 변환", id: "data" }, 
                  { title: "시간 변환", id: "time" }, 
                  { title: "할인 계산기", id: "disc" }, 
                  { title: "부가세 계산", id: "vat" }, 
                  { title: "날짜 계산기", id: "date" }, 
                  { title: "나이 계산기", id: "age" }, 
                  { title: "평수 계산기", id: "pyeong" }, 
                  { title: "환율 계산기", id: "fx" }
                ].map((tool, i) => (
                  <Link 
                    key={i} 
                    href={tool.id ? `/tools/smart-calc-box/${tool.id}` : "/tools/smart-calc-box"} 
                    className="flex justify-between items-center bg-[#f8fcfd] hover:bg-white p-4 border border-slate-200/50 rounded-md group transition-all hover:shadow-md hover:border-[#48b4b4]/20"
                  >
                    <span className="text-[13px] font-bold text-slate-700 group-hover:text-[#48b4b4] transition-colors">{tool.title}</span>
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#48b4b4]/10 transition-colors">
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#48b4b4] translate-x-[0.5px]" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* PDF Utility Category */}
            <section>
              <div className="bg-[#f97316] text-white p-3 px-5 rounded-t-lg flex items-center gap-3 shadow-sm">
                <FileText className="w-5 h-5" />
                <h3 className="text-lg font-black tracking-tight">PDF 마스터 (6)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-slate-50/50 p-4 border-x border-b border-slate-100 rounded-b-lg gap-2">
                {[
                  { title: "JPG to PDF", id: "jpg-to-pdf" }, 
                  { title: "PDF to JPG", id: "pdf-to-jpg" }, 
                  { title: "HTML to PDF", id: "html-to-pdf" }, 
                  { title: "Word to PDF", id: "word-to-pdf" }, 
                  { title: "Excel to PDF", id: "excel-to-pdf" }, 
                  { title: "PowerPoint to PDF", id: "ppt-to-pdf" }
                ].map((tool, i) => (
                  <Link 
                    key={i} 
                    href={`/tools/pdf-utility?tool=${tool.id}`} 
                    className="flex justify-between items-center bg-[#fff7ed] hover:bg-white p-4 border border-slate-200/50 rounded-md group transition-all hover:shadow-md hover:border-orange-500/20"
                  >
                    <span className="text-[13px] font-bold text-slate-700 group-hover:text-orange-600 transition-colors">{tool.title}</span>
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-orange-600 translate-x-[0.5px]" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Text Utility Category */}
            <section>
              <div className="bg-[#10b981] text-white p-3 px-5 rounded-t-lg flex items-center gap-3 shadow-sm">
                <Type className="w-5 h-5" />
                <h3 className="text-lg font-black tracking-tight">텍스트 매직 (16)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-slate-50/50 p-4 border-x border-b border-slate-100 rounded-b-lg gap-2">
                {[
                  { title: "줄 바꿈 제거", id: "remove-line-breaks" }, 
                  { title: "빈 줄 제거", id: "remove-empty-lines" }, 
                  { title: "중복 줄 제거", id: "remove-duplicate-lines" }, 
                  { title: "HTML 태그 제거", id: "strip-html-tags" }, 
                  { title: "텍스트 → HTML", id: "text-to-html" }, 
                  { title: "가나다순 정렬", id: "alphabetical-sort" }, 
                  { title: "대문자 변환", id: "uppercase" }, 
                  { title: "소문자 변환", id: "lowercase" }, 
                  { title: "단어 첫 글자 대문자", id: "to-title-case" }, 
                  { title: "공백 제거", id: "remove-spaces" }, 
                  { title: "숫자 제거", id: "remove-numbers" }, 
                  { title: "글자/단어 수 세기", id: "word-counter" }, 
                  { title: "자주 나온 단어 분석", id: "word-frequency" }, 
                  { title: "랜덤 선택 생성기", id: "random-picker" }, 
                  { title: "Base64 인코딩", id: "base64-encode-decode" }, 
                  { title: "URL 인코딩", id: "url-encode-decode" }
                ].map((tool, i) => (
                  <Link 
                    key={i} 
                    href={`/tools/text-all?tool=${tool.id}`} 
                    className="flex justify-between items-center bg-[#f0fdf4] hover:bg-white p-4 border border-slate-200/50 rounded-md group transition-all hover:shadow-md hover:border-emerald-500/20"
                  >
                    <span className="text-[13px] font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{tool.title}</span>
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 translate-x-[0.5px]" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Pro Utility Category */}
            <section>
              <div className="bg-[#4f46e5] text-white p-3 px-5 rounded-t-lg flex items-center gap-3 shadow-sm">
                <Wrench className="w-5 h-5 rotate-90" />
                <h3 className="text-lg font-black tracking-tight">프로 유틸리티 (7)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-slate-50/50 p-4 border-x border-b border-slate-100 rounded-b-lg gap-2">
                {[
                  { href: "/tools/image-resizer", title: "이미지 리사이징" },
                  { href: "/tools/pdf-utility", title: "PDF 유틸리티" },
                  { href: "/tools/url-shortener", title: "숏 URL 생성기" },
                  { href: "/tools/qr-generator", title: "QR 코드 생성기" },
                  { href: "/tools/text-all", title: "텍스트 올인원" },
                  { href: "/tools/image-compress", title: "이미지 압축" },
                  { href: "/tools/video-to-audio", title: "영상 오디오 변환기" }
                ].map((tool, i) => (
                  <Link 
                    key={i} 
                    href={tool.href} 
                    className="flex justify-between items-center bg-[#f9fafb] hover:bg-white p-4 border border-slate-200/50 rounded-md group transition-all hover:shadow-md hover:border-indigo-600/20"
                  >
                    <span className="text-[13px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{tool.title}</span>
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-600/10 transition-colors">
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 translate-x-[0.5px]" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-20 p-8 py-12 bg-slate-900 rounded-2xl text-center text-white relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
               <h3 className="text-2xl font-black mb-3">찾으시는 도구가 없으신가요?</h3>
               <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm font-medium">클릭툴스는 사장님의 요청에 따라 매주 새로운 도구를 업데이트하고 있습니다. 모든 도구를 한눈에 확인해 보세요.</p>
               <Link href="/#tools" className="px-10 py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 inline-block uppercase tracking-widest text-[10px]">
                 전체 도구 리스트 보기 (ALL TOOLS)
               </Link>
             </div>
          </div>
        </div>
      </div>
    </article>
  );
}
