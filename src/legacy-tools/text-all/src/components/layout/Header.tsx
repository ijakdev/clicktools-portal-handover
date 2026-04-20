"use client";

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-slate-200/60 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-gradient-to-br from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <span className="font-bold text-lg">T</span>
            </span>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              텍스트 변환의 모든것
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">홈</Link>
            <Link href="/tools" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">모든 도구</Link>
            <Link href="/categories/text-cleanup" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">줄/문단 정리</Link>
            <Link href="/favorites" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">즐겨찾기</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="도구 검색..." 
              className="pl-10 pr-4 py-1.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 w-48 md:w-64"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
