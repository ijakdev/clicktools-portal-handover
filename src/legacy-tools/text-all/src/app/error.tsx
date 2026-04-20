"use client";

import { useEffect } from 'react';
import Header from '@/components/layout/Header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20 bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg mx-auto">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 17c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">무언가 잘못되었습니다</h2>
          <p className="text-slate-500 mb-8">
            도구를 실행하는 중에 오류가 발생했습니다. <br />
            다시 시도하거나 메인 페이지로 이동해주세요.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
            >
              다시 시도
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              홈으로 가기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
