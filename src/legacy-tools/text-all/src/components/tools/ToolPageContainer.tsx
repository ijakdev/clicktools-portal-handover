import Header from '@/components/layout/Header';
import { Tool } from '@/data/tools';
import Link from 'next/link';

interface ToolPageContainerProps {
  tool: Tool;
  children: React.ReactNode;
  relatedTools?: Tool[];
}

export default function ToolPageContainer({
  tool,
  children,
  relatedTools = []
} : ToolPageContainerProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12 md:py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Navigation */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-8">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/tools" className="hover:text-blue-600">도구</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-bold">{tool.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-grow">
              <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  {tool.name}
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                  {tool.fullDescription}
                </p>
              </div>

              {children}

              {/* Tips / SEO Section */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-200 pt-16">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">?</span>
                    이 도구는 언제 사용하나요?
                  </h3>
                  <ul className="space-y-4">
                    {tool.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-3 py-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <p className="text-slate-600 leading-relaxed">{example}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">✓</span>
                    사용 시 주의사항
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                    <p className="text-slate-600 leading-relaxed text-sm">
                      본 서비스는 사용자의 텍스트 데이터를 서버로 전송하지 않습니다. 모든 작업은 고객님의 브라우저 내에서 안전하게 처리되므로, 중요한 정보나 개인 정보가 포함된 텍스트도 안심하고 변환하실 수 있습니다. 브라우저 캐시를 삭제하면 최근 사용 기록과 즐겨찾기가 초기화될 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar (Tablet/Desktop) */}
            <aside className="hidden xl:block w-80 flex-shrink-0">
              <div className="sticky top-28 space-y-8">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 mb-6">관련 도구 추천</h4>
                  <div className="space-y-4">
                    {relatedTools.length > 0 ? (
                      relatedTools.map(t => (
                        <Link key={t.id} href={`/tools/${t.slug}`} className="block group">
                          <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 mb-1 transition-colors">{t.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{t.shortDescription}</p>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">관련 도구가 준비 중입니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
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
