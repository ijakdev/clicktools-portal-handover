"use client";

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import ToolCard from '@/components/ui/ToolCard';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools.filter(t => t.isPopular);
    
    // 공백을 제거한 검색어와 대상 텍스트를 비교하여 검색 정확도 향상
    const cleanQuery = searchQuery.replace(/\s+/g, '').toLowerCase();
    
    return tools.filter(t => {
      const cleanName = t.name.replace(/\s+/g, '').toLowerCase();
      const cleanDesc = t.shortDescription.replace(/\s+/g, '').toLowerCase();
      const matchKeywords = t.keywords.some(k => k.replace(/\s+/g, '').toLowerCase().includes(cleanQuery));
      
      return cleanName.includes(cleanQuery) || cleanDesc.includes(cleanQuery) || matchKeywords;
    });
  }, [searchQuery]);

  const popularTools = useMemo(() => tools.filter(t => t.isPopular), []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-16 pb-24 md:pt-24 md:pb-32 border-b border-slate-100">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              텍스트 변환의 <span className="text-blue-600">모든것</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              줄바꿈 제거, HTML 정리, 중복 제거, 정렬, 대소문자 변환까지 
              <br className="hidden sm:block" />
              업무에 꼭 필요한 텍스트 툴을 하나로 모았습니다.
            </p>
            
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
              <div className="relative flex items-center">
                <span className="absolute left-5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="필요한 도구를 검색해보세요 (예: 줄바꿈, HTML, 글자수)"
                  className="w-full pl-14 pr-6 py-4 md:py-5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <span className="text-sm font-semibold text-slate-400 mr-2 flex items-center">추천 키워드:</span>
              {['줄바꿈 제거', 'HTML 태그 제거', '글자수 세기', 'Base64', '랜덤 선택'].map((keyword) => (
                <button 
                  key={keyword}
                  onClick={() => setSearchQuery(keyword)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-sm font-medium text-slate-600 transition-all active:scale-95"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20 bg-[#F8FAFC]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  {searchQuery ? `'${searchQuery}' 검색 결과` : '가장 많이 찾는 도구'}
                </h2>
                <p className="text-slate-500">
                  {searchQuery ? `${filteredTools.length}개의 도구를 찾았습니다.` : '사용자들이 자주 사용하는 인기 도구들입니다.'}
                </p>
              </div>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-400 mb-4">검색 결과가 없습니다.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  초기화하고 인기 도구 보기
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        {!searchQuery && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">카테고리별로 찾아보기</h2>
                <p className="text-slate-500">원하는 목적에 맞는 도구들을 한 곳에서 확인하세요.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((category) => (
                  <div key={category.id} className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <CategoryIcon type={category.id} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{category.name}</h3>
                        <p className="text-slate-500 mb-4 leading-relaxed">{category.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {tools.filter(t => t.category === category.id).slice(0, 4).map(t => (
                            <span key={t.id} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                              {t.name}
                            </span>
                          ))}
                        </div>
                        <a href={`/categories/${category.slug}`} className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700">
                          카테고리 전체보기
                          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="bg-blue-600 w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs">T</span>
            <span className="text-lg font-bold text-white tracking-tight">텍스트 변환의 모든것</span>
          </div>
          <p className="max-w-md mx-auto text-sm leading-relaxed mb-8">
            모든 텍스트 변환은 브라우저에서 안전하게 실행되며, 사용자의 데이터는 서버에 저장되지 않습니다.
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium mb-12">
            <a href="/about" className="hover:text-white transition-colors">도움말</a>
            <a href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="/terms" className="hover:text-white transition-colors">이용약관</a>
            <a href="/contact" className="hover:text-white transition-colors">문의하기</a>
          </div>
          <p className="text-[12px] text-slate-600">
            © 2026 텍스트 변환의 모든것. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function CategoryIcon({ type }: { type: string }) {
  // Simple icons based on type
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );
}
