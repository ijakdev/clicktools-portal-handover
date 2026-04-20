"use client";

import Header from '@/components/layout/Header';
import { tools } from '@/data/tools';
import ToolCard from '@/components/ui/ToolCard';
import Link from 'next/link';

export default function AllToolsPage() {
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
              <span className="text-slate-900 font-bold">모든 도구</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">전체 도구 목록</h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              총 {tools.length}개의 유용한 텍스트 도구들이 준비되어 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[12px] text-slate-600">© 2026 텍스트 변환의 모든것. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
