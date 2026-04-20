"use client";

import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20 bg-[#F8FAFC]">
        <div className="text-center">
          <h1 className="text-9xl font-extrabold text-blue-600/10 mb-[-40px]">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">페이지를 찾을 수 없습니다</h2>
          <p className="text-slate-500 mb-10 max-w-md mx-auto">
            요청하신 도구나 페이지가 존재하지 않거나 이전되었습니다. <br />
            메인 페이지에서 다른 도구를 찾아보세요.
          </p>
          <Link href="/" className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
