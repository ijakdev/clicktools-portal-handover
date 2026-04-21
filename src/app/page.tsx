"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/data/tools';
import {
    FileImage, FileText, ArrowRight, Zap, Calculator,
    Maximize, Link2, QrCode, Type, Music, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {format} from "date-fns";
import Image from 'next/image';

const IconMap: { [key: string]: any } = {
    Calculator,
    Maximize,
    FileText,
    Link2,
    QrCode,
    Type,
    FileImage,
    Music
};

export default function Home() {
    const [stats, setStats] = useState<any>({
        activeUsers: 1000000,
        filesConverted: 10000000,
        onlineTools: 200,
        pdfsCreated: 500000
    });

    const [latestPosts, setLatestPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const res = await fetch('/api/blog/latest');
                const data = await res.json();
                setLatestPosts(data);
            } catch (e) {}
        };
        fetchLatestPosts();

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
                setStats({
                    activeUsers: data.activeUsers || 0,
                    filesConverted: data.filesConverted || 0,
                    onlineTools: data.onlineTools || 0,
                    pdfsCreated: data.pdfsCreated || 0
                });
            } catch (e) { }
        };

        fetch('/api/stats', {
            method: 'POST',
            body: JSON.stringify({ field: 'activeUsers' }),
            headers: { 'Content-Type': 'application/json' }
        }).finally(() => {
            fetchStats();
        });
    }, []);

    const formatValue = (num: number) => {
        if (isNaN(num)) return "0";
        return num.toLocaleString();
    };

    return (
        <div className="relative min-h-screen text-slate-900 selection:bg-indigo-100 overflow-hidden bg-[#fbfcfd]">
            {/* 🧿 [Sharp Utility] Distant Industrial Background */}
            <div className="fixed inset-0 z-[-1]">
                <div className="absolute top-0 right-0 w-full h-px bg-slate-200/50" />
                <div className="absolute top-0 left-0 w-px h-full bg-slate-200/50" />
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
            </div>

            {/* 1. Sharp Hero Section */}
            <section className="relative pt-32 pb-8 text-center">
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 font-outfit leading-[1.05] tracking-tighter">
                        필요한 건 많지만, 시간은 없다.<br />
                        <span className="text-indigo-600">한국 사용자에 맞춘 클릭 한 번의 도구들.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-slate-400 font-bold text-lg mb-16 leading-relaxed opacity-80">
                        번거로운 과정 없이<br />
                        지금 바로 사용하는 실속형 유틸리티를 경험하세요.
                    </p>

                    {/* 2. Sharp Grid Menu */}
                    <div id="tools" className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto text-left py-4 px-4">
                        {TOOLS.map((tool) => {
                            const ToolIcon = IconMap[tool.icon] || Zap;
                            return (
                                <Link
                                    key={tool.id}
                                    href={tool.path}
                                    className="group relative flex flex-col bg-white border border-slate-200 hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-xl"
                                >
                                    <div className={cn("h-2 p-0 w-full", tool.brandColor)} />
                                    <div className="p-8 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn("w-12 h-12 flex items-center justify-center text-white", tool.brandColor)}>
                                                <ToolIcon className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">유틸리티</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 mb-2 transition-colors uppercase tracking-tight">{tool.name}</h3>
                                        <p className="text-slate-400 text-[12px] font-bold leading-relaxed mb-6 opacity-80 line-clamp-2">
                                            {tool.description}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest opacity-60", tool.color)}>프로 유틸리티</span>
                                            <div className="group-hover:translate-x-1 transition-transform text-indigo-600">
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 2. Sharp Stats Bar */}
            <section className="py-4 relative">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex bg-white border border-slate-200 p-6 shadow-xl flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-4">
                        {[
                             { val: stats.activeUsers, label: "활동적인\n사용자", color: "text-slate-900" },
                             { val: stats.filesConverted, label: "영상오디오\n변환", color: "text-slate-900" },
                             { val: stats.onlineTools, label: "QR코드\n생성", color: "text-slate-900" },
                             { val: stats.pdfsCreated, label: "이미지\n압축", color: "text-slate-900" }
                         ].map((stat, i) => (
                            <React.Fragment key={i}>
                                <div className="flex items-center gap-4 px-4 group/stat">
                                    <div className="flex flex-col">
                                        <div className={cn("text-3xl md:text-4xl font-black tracking-tighter tabular-nums", stat.color)}>
                                            {typeof stat.val === 'number' ? formatValue(stat.val) : stat.val}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-1.5 h-1.5 bg-indigo-600 animate-pulse" />
                                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">실시간 데이터</span>
                                        </div>
                                    </div>
                                    <div className="text-[12px] font-bold text-slate-500 uppercase leading-tight whitespace-pre-line opacity-80">
                                        {stat.label}
                                    </div>
                                </div>
                                {i < 3 && (
                                    <div className="hidden md:block w-px h-8 bg-slate-200" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Sharp Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <h2 className="text-5xl font-black mb-14 font-outfit text-slate-900 leading-[1.05] tracking-tighter uppercase">
                                로그인 및 설치 불필요<br />
                                <span className="text-3xl text-indigo-600">최고의 무료 유틸리티 경험</span>
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { title: "🎁 완전 무료 사용", desc: "모든 기능 제한 없이 평생 무료", img: "/images/features/premium.png" },
                                    { title: "⚡ 웹 방식의 빠른 처리 속도", desc: "대규모 작업도 즉시 처리", img: "/images/features/speed.png" },
                                    { title: "🔒 자동 삭제 보안", desc: "작업 완료 시 데이터 즉시 폐기", img: "/images/features/security.png" },
                                    { title: "🌐 모든 기기 지원", desc: "PC, 태블릿, 모바일 완벽 호환", img: "/images/features/universal.png" },
                                ].map((item , i) => (
                                    <div key={i} className="p-8 bg-white border border-slate-200 hover:border-indigo-600 transition-all group flex flex-col items-center text-center">
                                       <div className="w-32 h-32 mb-8 flex items-center justify-center p-4 border border-slate-100">
                                            <img src={item.img} alt={item.title} className="w-full h-full object-contain filter grayscale-0 group-hover:grayscale transition-all duration-500" />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-70">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white p-10 md:p-14 border border-slate-200 shadow-2xl h-full flex flex-col relative overflow-hidden">
                                {/* Industrial decoration */}
                                <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-indigo-600/20" />
                                
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">최신 업무 인사이트</h3>
                                    <Link href="/blog" className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 border-b border-indigo-600 pb-1">
                                        전체 보기 <ArrowRight size={14} />
                                    </Link>
                                </div>

                                <div className="space-y-12 flex-grow">
                                    {latestPosts.map((post, i) => (
                                        <Link
                                            key={post.slug}
                                            href={`/blog/${post.slug}`}
                                            className="group/item flex items-start gap-8"
                                        >
                                            <div className="w-40 aspect-[1.3] border border-slate-200 overflow-hidden shrink-0">
                                                <img src={post.thumbnail} alt=""  className="w-full h-full object-cover filter grayscale-0 group-hover/item:grayscale group-hover/item:scale-105 transition-all duration-700" />
                                            </div>
                                            <div className="flex flex-col gap-2 py-1">
                                                <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{post.category}</div>
                                                <h4 className="text-xl font-bold text-slate-900 leading-tight group-hover/item:text-indigo-600 transition-colors">
                                                    {post.title}
                                                </h4>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                                                    {format((post.publishedAt ?? post.createdAt),'yyyy-MM-dd')}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
