import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#0b1120] text-slate-400 pt-12 pb-8 border-t border-slate-800 mt-20 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="group flex items-center gap-4 mb-8 no-underline">
              <div className="relative w-14 h-14 bg-gradient-to-br from-slate-800 to-black flex items-center justify-center rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footer-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="50%" stopColor="#CA8A04" />
                      <stop offset="100%" stopColor="#854D0E" />
                    </linearGradient>
                  </defs>
                  {/* Sparkles */}
                  <g stroke="url(#footer-gold)" strokeWidth="1.5" strokeLinecap="round" className="opacity-80">
                    <path d="M4 1V0" />
                    <path d="M7 1L8 0" />
                    <path d="M8 4H9" />
                    <path d="M7 7L8 8" />
                    <path d="M4 8V9" />
                    <path d="M1 7L0 8" />
                    <path d="M0 4H1" />
                    <path d="M1 1L0 0" />
                  </g>
                  {/* Arrow */}
                  <path 
                    d="M4 4l7.07 16.97 2.51-7.39 7.39-2.51L4 4z" 
                    fill="url(#footer-gold)" 
                    stroke="#0f172a" 
                    strokeWidth="0.5"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline leading-none">
                  <span className="text-[28px] font-[900] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-300 to-slate-400">
                    Click
                  </span>
                  <span className="text-[28px] font-[900] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-600">
                    Tools
                  </span>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-amber-500/60 ml-px mt-1">
                  초격차 업무 도구 포털
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-8 font-medium text-slate-400 opacity-90">
              클릭 한 번으로 해결하는 초격차 업무 도구 포털. 이미지, PDF, 텍스트 변환 등 필요한 모든 유틸리티를 세계 최고 수준의 품질로 제공합니다.<br />
              처리된 파일과 처리되지 않은 파일을 포함한 모든 파일은 서버에 남기지 않고 로컬에만 존재하며, 서버에는 남지 않습니다.
            </p>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">인기 프리미엄 도구</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/tools/image-compress" className="hover:text-blue-400 transition-colors">이미지 압축</Link></li>
              <li><Link href="/tools/pdf-utility" className="hover:text-blue-400 transition-colors">PDF 유틸리티</Link></li>
              <li><Link href="/tools/url-shortener" className="hover:text-blue-400 transition-colors">숏 URL 생성기</Link></li>
              <li><Link href="/tools/smart-calc-box" className="hover:text-blue-400 transition-colors">스마트 계산기</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">커뮤니티</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">최신 블로그 & 가이드</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">문의하기</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">법적 고지</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">이용약관</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-400 transition-colors">면책조항</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - No N mark, 2026 Year */}
        <div className="border-t border-slate-800 pt-8 flex flex-col items-center text-center text-[10px] tracking-[0.1em] font-medium text-slate-500 uppercase">
          <p className="leading-loose flex flex-wrap justify-center items-center">
            <span className="font-black text-slate-400">© 2026 ClickTools (클릭툴스)</span>
            <span className="mx-3 opacity-20 hidden md:inline">|</span>
            <span>이미지 리사이즈, PDF 변환, URL 단축, QR 생성 등 다양한 무료 도구 제공</span>
            <span className="mx-3 opacity-20 hidden md:inline">|</span>
            <span>빠르고 간편한 온라인 유틸 서비스</span>
            <span className="mx-3 opacity-20 hidden md:inline">|</span>
            <span className="italic opacity-60">All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
