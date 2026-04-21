import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Calendar, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: `정보 블로그 | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
};

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: selectedCategory } = await searchParams;
  const now = new Date();

  // 모든 카테고리 목록 가져오기
  const categoriesTable = await prisma.blogPost.findMany({
    distinct: ['category'],
    select: { category: true },
  });
  const categories = ['전체', ...categoriesTable.map((c) => c.category)];

  // 예약 공개(publishedAt) 반영 + 카테고리 필터
  const posts = await prisma.blogPost.findMany({
    where: {
      AND: [
        {
          OR: [
            { publishedAt: null },
            { publishedAt: { lte: now } },
          ],
        },
        ...(selectedCategory && selectedCategory !== '전체'
          ? [{ category: selectedCategory }]
          : []),
      ],
    },
    orderBy: [
      { publishedAt: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const isNew = (d: Date) => {
    const diff = now.getTime() - d.getTime();
    return diff < 3 * 24 * 60 * 60 * 1000; // 3일 이내
  };

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">ClickTools Insight Blog</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-outfit tracking-tighter text-slate-900 italic uppercase">
            {selectedCategory && selectedCategory !== '전체' 
              ? (selectedCategory === '가이드' ? '블로그 가이드' : `${selectedCategory}`) 
              : '최신 블로그 & 가이드'}
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            클릭툴스의 도구들을 200% 활용하는 비법과 실무형 팁을 확인하세요. 
            단순한 사용법을 넘어 전문가 수준의 워크플로우를 제시합니다.
          </p>
        </div>

        {/* Category Navigation (Premium Style based on User Request) */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const isActive = (selectedCategory === cat) || (!selectedCategory && cat === '전체');
              return (
                <Link
                  key={cat}
                  href={cat === '전체' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                  className={`
                    px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 border
                    ${isActive 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20 translate-y-[-2px]' 
                      : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl max-w-4xl mx-auto">
            <p className="text-slate-300 font-black italic uppercase tracking-widest text-sm">해당 카테고리에 등록된 포스트가 없습니다.</p>
          </div>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {posts.map((post) => {
            const displayDate = post.publishedAt ?? post.createdAt;
            const newlyPublished = isNew(displayDate);

            return (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col"
              >
                {newlyPublished && (
                  <div className="absolute top-6 right-6 z-10">
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black italic rounded-md shadow-lg animate-bounce">
                      NEW
                    </span>
                  </div>
                )}
                
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={post.thumbnail} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl border border-white/20 italic">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center text-[10px] text-slate-400 mb-4 font-black uppercase tracking-[0.2em] space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-blue-500" />
                      <span>{formatDate(displayDate)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 tracking-tighter text-slate-900">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] group/btn italic">
                      <span>자세히 보기</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                    <div className="w-8 h-[1px] bg-slate-100 group-hover:w-16 transition-all duration-500" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
