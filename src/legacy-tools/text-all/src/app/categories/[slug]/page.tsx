"use client";

import { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import ToolCard from '@/components/ui/ToolCard';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import Link from 'next/link';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  const categoryTools = useMemo(() => {
    return tools.filter(t => t.category === category.id);
  }, [category]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-16 md:py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-900 font-bold">{category.name}</span>
            </nav>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>

          {categoryTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400">이 카테고리에 등록된 도구가 아직 없습니다.</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[12px] text-slate-600">
            © 2026 텍스트 변환의 모든것. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
