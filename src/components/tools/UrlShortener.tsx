"use client";

import React, { useState, useEffect } from 'react';
import { Link2, Copy, Scissors, ExternalLink, QrCode, X, Home, Clock, Zap, BarChart3, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function UrlShortener() {
    const [longUrl, setLongUrl] = useState('');
    const [expiry, setExpiry] = useState('24시간');
    const [result, setResult] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [stats, setStats] = useState({ activeUrls: 0, todayUrls: 0, totalCreated: 0 });

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/shorten/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Stats fetch error:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);
    const [showQr, setShowQr] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!longUrl) return toast.error('긴 URL을 입력하세요.');
        
        setIsGenerating(true);
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url: longUrl,
                    expiresIn: expiry === '24시간' ? '24h' : 
                               expiry === '48시간' ? '48h' : 
                               expiry === '1주일' ? '1w' : 
                               expiry === '1개월' ? '1m' : 'unlimited'
                })
            });
            
            const data = await response.json();
            if (response.ok) {
                setResult(data.short_url);
                toast.success('단축 URL이 생성되었습니다!');
                fetchStats(); // Update stats after creation
            } else {
                toast.error(data.error || '생성 실패');
            }
        } catch (error) {
            toast.error('서버 연결 오류가 발생했습니다.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                toast.success('복사되었습니다!');
            } else {
                // Fallback for non-secure contexts (HTTP)
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    toast.success('복사되었습니다!');
                } catch (err) {
                    toast.error('복사에 실패했습니다.');
                }
                document.body.removeChild(textArea);
            }
        } catch (err) {
            toast.error('복사에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-transparent overflow-hidden font-outfit">
            
            {/* 1. Global Fixed Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#c7d2fe]/60 rounded-full blur-[80px] animate-drift" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#fbcfe8]/60 rounded-full blur-[80px] animate-drift-delayed" />
                <div className="absolute top-[30%] left-[40%] w-[600px] h-[600px] bg-[#e0e7ff]/60 rounded-full blur-[80px] animate-drift-slow" />
            </div>

            <style jsx global>{`
                @keyframes drift {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(100px, 50px) scale(1.1); }
                }
                .animate-drift { animation: drift 20s infinite alternate ease-in-out; }
                .animate-drift-delayed { animation: drift 20s infinite alternate ease-in-out -5s; }
                .animate-drift-slow { animation: drift 20s infinite alternate ease-in-out -10s; }
            `}</style>

            <div className="relative z-10 w-full max-w-[800px] flex flex-col items-center gap-12">
                
                <div className="text-center">
                    <h1 className="flex items-center justify-center gap-4 mb-3">
                        <span className="text-[2.8rem] font-[800] tracking-tighter text-blue-600">
                            숏 URL 생성기
                        </span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-400 max-w-lg leading-relaxed mb-6">
                        단축 기간을 24시간, 48시간, 1주일, 1개월 중 선택할 수 있습니다.
                    </p>
                </div>

                {/* 3. Main Glass Card (12px Input Curves & Compact Spacing) */}
                <div className="w-full bg-white/40 backdrop-blur-[20px] border border-white/50 rounded-[28px] p-12 shadow-2xl relative">
                    {result ? (
                        <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                                <Scissors size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">단축 완료!</h3>
                            
                            <div className="w-full flex items-center bg-slate-50 border-2 border-blue-100 rounded-2xl p-2 pl-6">
                                <input 
                                    readOnly 
                                    value={result} 
                                    className="flex-1 text-xl font-black text-blue-600 tabular-nums bg-transparent border-none outline-none"
                                />
                                <button 
                                    onClick={() => copyToClipboard(result)}
                                    className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>

                                <button 
                                    onClick={() => {
                                        setResult(null);
                                        setLongUrl('');
                                        setExpiry('24시간');
                                    }}
                                    className="mt-4 px-10 py-3 border-2 border-slate-200 text-slate-400 font-bold rounded-full hover:border-slate-800 hover:text-slate-800 transition-all font-outfit"
                                >
                                    새로운 URL 단축하기
                                </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="main-input-wrapper">
                                <input 
                                    type="url" 
                                    placeholder="긴 URL을 입력하세요 (https://...)" 
                                    required
                                    className="w-full p-6 bg-white/70 border-2 border-white rounded-2xl text-[1.1rem] font-medium outline-none focus:bg-white focus:border-blue-400 focus:shadow-xl transition-all shadow-sm"
                                    value={longUrl}
                                    onChange={(e) => setLongUrl(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <button 
                                    type="submit"
                                    disabled={isGenerating}
                                    className="w-full py-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-50"
                                >
                                    <Scissors size={20} />
                                    {isGenerating ? '생성 중...' : '단축하기'}
                                </button>
                            </div>

                            <div className="flex justify-center flex-wrap gap-3 mt-4">
                                {['24시간', '48시간', '1주일', '1개월'].map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setExpiry(opt)}
                                        className={cn(
                                            "px-6 py-2.5 rounded-full text-[13px] font-bold transition-all border-2",
                                            expiry === opt 
                                                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30" 
                                                : "bg-white/50 text-slate-400 border-white hover:border-slate-200"
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </form>
                    )}
                </div>

                {/* 4. Stats Section Matrix (Restored Original White Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-6 mt-6 mb-20">
                    <div className="bg-white rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100/50">
                        <span className="text-[2.2rem] font-[800] text-blue-600 mb-1 leading-none tabular-nums">{stats.activeUrls}</span>
                        <span className="text-[14px] font-bold text-slate-400">활성 URL</span>
                    </div>
                    <div className="bg-white rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100/50 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1.5 bg-red-500 rounded-full" />
                        <span className="text-[2.2rem] font-[800] text-blue-600 mb-1 leading-none tabular-nums">{stats.todayUrls}</span>
                        <span className="text-[14px] font-bold text-slate-400">오늘 생성</span>
                    </div>
                    <div className="bg-white rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100/50">
                        <span className="text-[2.2rem] font-[800] text-blue-600 mb-1 leading-none tabular-nums">{stats.totalCreated}</span>
                        <span className="text-[14px] font-bold text-slate-400">누적 생성</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
