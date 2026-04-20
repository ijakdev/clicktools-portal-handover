"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Tool } from '@/data/tools';
import { CheckCircle2, ChevronRight, HelpCircle, Info, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import MasterGuidePortal from '@/components/tools/MasterGuidePortal';
import { EXPERT_GUIDES } from '@/data/expert-guides';

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  hideHeader?: boolean;
  transparentBackground?: boolean;
  subId?: string;
}

const ToolLayout = ({ tool, children, hideHeader = false, transparentBackground = false, subId }: ToolLayoutProps) => {
  useEffect(() => {
    try {
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: 'activeUsers' })
      });
    } catch (e) {}
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden font-sans selection:bg-indigo-100">
      {!transparentBackground && (
        <div className="fixed inset-0 z-[-1] bg-[#f8fbff]">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-pink-100/30 rounded-full blur-[100px]" />
           <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] bg-blue-100/20 rounded-full blur-[140px]" />
           <div className="absolute inset-0 bg-white/40" />
        </div>
      )}

      <div className="container mx-auto px-4 pt-12 pb-24">
        {/* Breadcrumbs (Hidden for Branded Tools) */}
        {!hideHeader && (
          <nav className="flex items-center space-x-2 text-[12px] font-black uppercase tracking-widest text-slate-400 mb-12">
            <Link href="/" className="hover:text-indigo-600 transition-colors">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/#tools" className="hover:text-indigo-600 transition-colors italic">도구 모음</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 border-b-2 border-indigo-600 pb-0.5">{tool.name}</span>
          </nav>
        )}

        {/* 🚀 Main Tool Area */}
        <div className={cn(
          "relative mb-32 animate-in fade-in zoom-in-95 duration-1000",
          hideHeader ? "mt-0" : "mt-2"
        )}>
          {!hideHeader && (
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase">
                {tool.name}
              </h1>
              <p className="text-lg font-bold text-slate-400">
                {tool.description}
              </p>
            </div>
          )}
          {children}
        </div>

        {/* Detailed Guide Sections - Fully Reconstructed for President's Request */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">
            
            {/* 🚀 Master Guide Area - Dynamic Switch */}
            {EXPERT_GUIDES[tool.id] ? (
              <MasterGuidePortal toolId={tool.id} subId={subId} />
            ) : (
              <div className="space-y-20">
                {/* 1. Intro Section */}
                <section className="bg-white/40 backdrop-blur-sm p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-all duration-1000" />
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-2.5 h-10 bg-indigo-600 rounded-full shadow-lg" />
                      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        {tool.guideTitle || `${tool.name} 마스터 가이드`}
                      </h2>
                  </div>
                  <div className="whitespace-pre-line text-slate-600 text-lg leading-relaxed font-bold italic opacity-80">
                    {tool.longDescription}
                  </div>
                </section>

                {/* 2. Why Needed & Use Cases */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="bg-white/60 p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-indigo-900/5">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                            <span className="text-2xl">📌</span> 왜 필요할까?
                        </h3>
                        <ul className="space-y-4">
                            {tool.whyNeeded.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-700 font-bold">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="bg-white/60 p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-indigo-900/5">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                            <span className="text-2xl">🚀</span> 활용 방법
                        </h3>
                        <ul className="space-y-4">
                            {tool.useCases.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-700 font-bold">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* 3. 사용 프로세스 (⚡ 사용 방법) */}
                <section>
                  <div className="flex items-center gap-4 mb-10 pl-2">
                      <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-black">⚡</div>
                      <h2 className="text-3xl font-black tracking-tight text-slate-900">사용 방법</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tool.usageSteps.map((step, idx) => (
                      <div key={idx} className="flex flex-col bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl group transition-all hover:-translate-y-1">
                        <span className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center font-black text-xl mb-6">
                          {idx + 1}
                        </span>
                        <p className="font-bold leading-relaxed tracking-tight opacity-90">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. 핵심 정리 (🔥 핵심 정리) */}
                <section className="bg-gradient-to-r from-rose-500 to-orange-500 p-1px rounded-[2.5rem]">
                    <div className="bg-white p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-3xl">🔥</div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">핵심 정리</h3>
                                <p className="text-slate-500 font-bold text-sm tracking-tight opacity-70">마스터 가이드 한 줄 요약</p>
                            </div>
                        </div>
                        <div className="text-xl md:text-2xl font-black text-rose-600 tracking-tight italic">
                            👉 {tool.coreSummary}
                        </div>
                    </div>
                </section>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-16">
            <div className="bg-white/40 backdrop-blur-xl p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-indigo-900/5">
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tighter uppercase">연관 도구</h3>
              <div className="space-y-6">
                 <Link href="/#tools" className="block p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 hover:scale-105 transition-all group">
                    <div className="flex items-center justify-between mb-3 text-[11px] font-black uppercase tracking-widest opacity-60">
                        <span>포털 홈</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-lg font-black tracking-tight">전체 도구 카탈로그</div>
                 </Link>
                 <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h4 className="font-black text-slate-900 mb-2 flex items-center gap-2">
                        <HelpCircle size={16} className="text-blue-500" /> FAQ
                    </h4>
                    {tool.faq.map((f, i) => (
                        <div key={i} className={cn("mt-4", i > 0 && "pt-4 border-t border-slate-50")}>
                            <p className="text-[14px] font-black text-slate-800 tracking-tight">Q. {f.q}</p>
                            <p className="text-[13px] font-medium text-slate-500 mt-1 opacity-80">{f.a}</p>
                        </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="bg-slate-900 p-14 rounded-[4rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-indigo-500/40 transition-all duration-1000" />
               <h3 className="text-lg font-black text-white mb-6 leading-tight">번거로운 과정 없이 지금 바로 사용하는 실속형 유틸리티를 경험하세요.</h3>
               <p className="text-slate-400 text-[13px] font-bold mb-10 leading-relaxed opacity-60">
                 업무의 효율을 극한으로 끌어올리는 세계 최고 수준의 아키텍처 가이드를 확인하세요.
               </p>
               <Link href="/blog" className="block text-center py-5 bg-white text-slate-900 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors">
                 인사이트 전체보기
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolLayout;
