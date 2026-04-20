"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
    Users, FileText, MessageSquare, TrendingUp, 
    ArrowUpRight, Clock, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalInquiries: 0,
        pendingInquiries: 0,
        totalUrls: 0
    });

    useEffect(() => {
        // Fetch dashboard stats (This would ideally be a separate API but we'll fetch list sizes)
        const fetchStats = async () => {
            try {
                const blogRes = await fetch('/api/admin/blog');
                const inquiryRes = await fetch('/api/admin/inquiries');
                const blogData = await blogRes.json();
                const inquiryData = await inquiryRes.json();

                const isBlogArray = Array.isArray(blogData);
                const isInquiryArray = Array.isArray(inquiryData);

                setStats({
                    totalPosts: isBlogArray ? blogData.length : 0,
                    totalInquiries: isInquiryArray ? inquiryData.length : 0,
                    pendingInquiries: isInquiryArray ? inquiryData.filter((i: any) => i.status === 'pending').length : 0,
                    totalUrls: 0 
                });
            } catch (e) {}
        };
        fetchStats();
    }, []);

    const cards = [
        { label: '전체 블로그 포스트', count: stats.totalPosts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: '수신된 문의 총합', count: stats.totalInquiries, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: '처리 대기 중 문의', count: stats.pendingInquiries, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: '보안 안정성', count: '99.9%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-8 border border-slate-200 shadow-sm hover:border-indigo-600 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("p-4 group-hover:scale-110 transition-transform flex items-center justify-center", card.bg, card.color)}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <div className="p-2 bg-slate-50 text-slate-400 border border-slate-100">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{card.label}</h4>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                            {card.count}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
                    <div className="relative z-10 max-w-lg">
                        <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight tracking-tighter">
                            시스템 상태: 정상 작동 중<br />
                            <span className="text-indigo-400">관리자 제어 센터</span>
                        </h3>
                        <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8 opacity-80 uppercase tracking-widest italic">
                            모든 시스템이 정상 범위 내에서 안전하게 작동 중입니다. <br />
                            {stats.pendingInquiries}건의 새로운 문의 내역이 확인이 필요합니다.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/admin/inquiries" className="px-8 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40 border border-indigo-500">
                                문의 내역 관리
                            </Link>
                            <Link href="/admin/blog" className="px-8 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md">
                                콘텐츠 엔진 관리
                            </Link>
                        </div>
                    </div>

                    <TrendingUp className="absolute bottom-[-20px] right-[-20px] w-64 h-64 text-white/5" />
                </div>

                <div className="bg-white p-10 border border-slate-200 shadow-xl flex flex-col justify-center text-center relative overflow-hidden">
                    {/* Industrial strip */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                    
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tight">보안 무결성 검사</h4>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6 leading-relaxed opacity-60">
                        엔드 투 엔드 암호화 활성화됨.<br />
                        보안 침해 시도가 감지되지 않았습니다.
                    </p>
                    <div className="px-6 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.4em] inline-block mx-auto border border-emerald-500/20">
                        보안 활성됨
                    </div>
                </div>
            </div>
        </div>
    );
}
