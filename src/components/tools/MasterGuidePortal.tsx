"use client";

import React, { useState } from 'react';
import { EXPERT_GUIDES, ExpertGuide } from '@/data/expert-guides';
import { cn } from '@/lib/utils';
import { 
    ChevronDown, ChevronRight, Zap, Lightbulb, Flame, Info, CheckCircle2,
    Calculator, Ruler, RefreshCw, ClipboardCheck,
    Upload, Maximize, Download, Sparkles,
    FileText, LayoutGrid, Image, Plus, FileArchive, Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MasterGuidePortalProps {
    toolId: string;
    subId?: string;
}

const RichStepGraphic = ({ type, index }: { type: string; index: number }) => {
    // [President's Request] PDF Utility Graphics
    if (type === 'pdf-utility') {
        if (index === 0) { // Step 01: PDF Upload
            return (
                <div className="relative w-28 h-32 flex items-center justify-center">
                    <div className="w-20 h-28 bg-white rounded-lg shadow-xl relative border-2 border-slate-100 flex flex-col items-center justify-end pb-4">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-slate-50 rounded-bl-xl border-b-2 border-l-2 border-slate-100" />
                        <div className="bg-rose-500 text-[10px] font-black text-white px-2 py-0.5 rounded-sm">PDF</div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-slate-900 flex items-center justify-center text-white shadow-lg">
                            <CheckCircle2 size={14} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            );
        }
        if (index === 1) { // Step 02: Tool Choice Grid
            return (
                <div className="grid grid-cols-3 gap-2 p-2">
                    {['JPG', 'HTML', 'DOCX', 'XLSX', 'PPT', 'XPTX'].map(ext => (
                        <div key={ext} className="bg-slate-700/50 text-[8px] font-black text-slate-300 px-2 py-1.5 rounded-md border border-slate-600/50 shadow-inner">
                            {ext}
                        </div>
                    ))}
                </div>
            );
        }
        if (index === 2) { // Step 03: File Save
            return (
                <div className="relative w-32 h-24 flex items-center justify-center">
                    <div className="w-24 h-12 bg-blue-500 rounded-xl relative shadow-lg shadow-blue-500/20">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-blue-400 animate-bounce">
                            <Download size={40} strokeWidth={3} />
                        </div>
                        <div className="absolute inset-x-2 bottom-2 h-1 bg-white/20 rounded-full" />
                    </div>
                </div>
            );
        }
    }
    
    // [President's Request] 23-Tool Master Guide Graphics
    if (type === 'smart-calc-box') {
        if (index === 0) { // Step 01: 도구 선택
            return (
                <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-800/30 rounded-xl border border-slate-700/50 shadow-inner">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-indigo-500/40 rounded-[2px] border border-indigo-400/20" />
                    ))}
                </div>
            );
        }
        if (index === 1) { // Step 02: 수치 입력
            return (
                <div className="relative w-24 h-20 flex items-center justify-center">
                    <div className="w-16 h-12 bg-white/5 rounded-lg border-2 border-white/10 flex items-center justify-center gap-1 px-2">
                        <div className="w-full h-1.5 bg-indigo-500/40 rounded-full" />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                    </div>
                </div>
            );
        }
        if (index === 2) { // Step 03: 실시간 확인
            return (
                <div className="relative group">
                    <Sparkles className="text-amber-400 drop-shadow-lg animate-pulse" size={56} strokeWidth={1} />
                </div>
            );
        }
    }

    // [President's Request] Short URL Generator Graphics
    if (type === 'url-shortener') {
        if (index === 0) { // Step 01: URL 입력
            return (
                <div className="relative w-32 h-24 bg-slate-800/50 rounded-xl border border-slate-700/80 p-3 shadow-inner overflow-hidden">
                    <div className="flex gap-1 mb-2">
                        <div className="w-1.5 h-1.5 bg-rose-500/50 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full" />
                    </div>
                    <div className="bg-slate-900/80 rounded-lg p-2 flex items-center gap-2 border border-slate-700/30">
                        <div className="text-indigo-400 font-bold text-[10px] tracking-tight truncate">www.long-url-address...</div>
                        <div className="ml-auto w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <Sparkles size={10} className="text-white" />
                        </div>
                    </div>
                </div>
            );
        }
        if (index === 1) { // Step 02: 기간 선택
            return (
                <div className="grid grid-cols-3 gap-2 px-2">
                    {['24H', '48H', '1W', '1M', '3M', '6M'].map(p => (
                        <div key={p} className="bg-blue-600/20 text-blue-400 text-[8px] font-black px-2 py-1 rounded-md border border-blue-500/30 text-center">
                            {p}
                        </div>
                    ))}
                </div>
            );
        }
        if (index === 2) { // Step 03: 복사
            return (
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="w-20 h-24 bg-white/10 rounded-xl border-2 border-white/10 relative overflow-hidden flex flex-col items-center justify-center gap-4">
                        <ClipboardCheck size={40} className="text-indigo-400 opacity-80" />
                        <div className="absolute bottom-1 right-1 w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-slate-900 scale-75">
                            <Sparkles size={18} className="text-white" />
                        </div>
                    </div>
                </div>
            );
        }
    }

    // [President's Request] QR Code Generator Graphics
    if (type === 'qr-generator') {
        if (index === 0) { // Step 01: 링크 입력
            return (
                <div className="relative w-36 h-28 bg-slate-800/80 rounded-2xl border border-slate-700/50 p-4 shadow-2xl overflow-hidden flex flex-col justify-end">
                    <div className="flex gap-1.5 mb-3">
                        <div className="w-2 h-2 bg-rose-500/60 rounded-full" />
                        <div className="w-2 h-2 bg-amber-500/60 rounded-full" />
                        <div className="w-2 h-2 bg-emerald-500/60 rounded-full" />
                    </div>
                    <div className="bg-white/90 rounded-xl p-3 flex items-center gap-3 border border-indigo-100 shadow-sm transition-all group-hover:scale-105">
                        <div className="text-indigo-600 font-black text-[10px] tracking-tight truncate">https://www.example.com</div>
                        <div className="ml-auto w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
                            <Sparkles size={12} className="text-white rotate-12" />
                        </div>
                    </div>
                </div>
            );
        }
        if (index === 1) { // Step 02: QR 생성 (Paintbrush)
            return (
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-xl shadow-lg border border-slate-100 p-2 grid grid-cols-3 gap-1 relative z-10 transition-transform group-hover:rotate-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className={cn("rounded-[2px]", i % 2 === 0 ? "bg-slate-900" : "bg-slate-200")} />
                        ))}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-xl rotate-12 group-hover:-rotate-12 transition-all">
                            <Sparkles size={20} />
                        </div>
                    </div>
                    {/* Brush Effect */}
                    <div className="absolute -bottom-2 right-0 w-12 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-md opacity-40 animate-pulse" />
                </div>
            );
        }
        if (index === 2) { // Step 03: 이미지 저장
            return (
                <div className="relative w-32 h-24 flex items-center justify-center">
                    <div className="w-24 h-14 bg-blue-600 rounded-2xl relative shadow-xl shadow-blue-500/30 flex items-center justify-center transition-transform group-hover:scale-105">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-xl shadow-lg border border-slate-100 p-2 grid grid-cols-2 gap-1 scale-75 group-hover:-translate-y-2 transition-transform">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-slate-900 rounded-[1px]" />
                            ))}
                        </div>
                        <Download size={28} className="text-white mt-4" strokeWidth={3} />
                    </div>
                </div>
            );
        }
    }

    // [President's Request] Text All-in-One Graphics
    if (type === 'text-all') {
        if (index === 0) { // Step 01: 텍스트 입력
            return (
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="w-20 h-24 bg-white rounded-lg shadow-lg border border-slate-100 relative p-4 flex flex-col gap-2">
                        <div className="w-10 h-1 bg-slate-200 rounded-full" />
                        <div className="w-full h-1 bg-slate-100 rounded-full" />
                        <div className="w-8 h-1 bg-slate-200 rounded-full" />
                        <div className="absolute center w-10 h-10 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <FileText size={20} className="text-indigo-400" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full border-4 border-slate-900 flex items-center justify-center text-white shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                            <Sparkles size={18} />
                        </div>
                    </div>
                </div>
            );
        }
        if (index === 1) { // Step 02: 도구 선택 (ABC, 123, Brush)
            return (
                <div className="flex items-center gap-2 p-3 bg-slate-800/40 rounded-[2rem] border border-slate-700/50 shadow-inner">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110">
                        <Sparkles size={18} />
                    </div>
                    <div className="bg-slate-700/50 text-[10px] font-black text-slate-300 px-3 py-2 rounded-xl border border-white/5">ABC</div>
                    <div className="bg-slate-700/50 text-[10px] font-black text-slate-300 px-3 py-2 rounded-xl border border-white/5">123</div>
                    <div className="bg-slate-700/50 text-[10px] font-black text-slate-300 px-3 py-2 rounded-xl border border-white/5">&lt;/&gt;</div>
                </div>
            );
        }
        if (index === 2) { // Step 03: 결과 복사
            return (
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="w-20 h-24 bg-blue-500 rounded-2xl shadow-xl shadow-blue-900/40 relative flex items-center justify-center group-hover:translate-z-10 transition-transform">
                        <ClipboardCheck size={44} className="text-white opacity-90" />
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-600 text-blue-600 scale-90 group-hover:scale-110 transition-transform">
                            <Sparkles size={18} />
                        </div>
                    </div>
                </div>
            );
        }
    }

    // [President's Request] Image Compress Graphics
    if (type === 'image-compress') {
        if (index === 0) { // Step 01: 이미지 선택
            return (
                <div className="relative w-36 h-28 flex items-center justify-center">
                    <div className="absolute -left-4 top-2 w-24 h-16 bg-slate-800/50 rounded-lg border border-slate-700/50 -rotate-12 transition-transform group-hover:-translate-x-2" />
                    <div className="absolute -right-4 top-4 w-24 h-16 bg-slate-800/50 rounded-lg border border-slate-700/50 rotate-12 transition-transform group-hover:translate-x-2" />
                    <div className="w-28 h-20 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 relative z-10 transition-transform group-hover:scale-105">
                        <div className="w-full h-full bg-slate-50 rounded-lg overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-600/10" />
                            <Image size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center text-white">
                            <Plus size={14} strokeWidth={4} />
                        </div>
                    </div>
                </div>
            );
        }
        if (index === 1) { // Step 02: 압축 설정 (Sliders/Toggles)
            return (
                <div className="w-40 bg-slate-800/80 rounded-2xl border border-slate-700/50 p-4 shadow-2xl space-y-3 scale-90">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[8px] font-black text-slate-400">
                            <span>압축 품질</span>
                            <span className="text-blue-400">80%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-700 rounded-full relative">
                            <div className="absolute inset-y-0 left-0 w-4/5 bg-blue-500 rounded-full" />
                            <div className="absolute -top-1 left-[80%] w-3 h-3 bg-white rounded-full shadow-lg border-2 border-blue-500" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-slate-400 uppercase">저장 포맷</span>
                        <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                            <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full" />
                        </div>
                    </div>
                </div>
            );
        }
        if (index === 2) { // Step 03: 압축 저장 (Zipper/Folder)
            return (
                <div className="relative w-32 h-28 flex items-center justify-center">
                    <div className="w-20 h-24 bg-blue-600 rounded-2xl shadow-xl relative flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                        <div className="w-8 h-12 bg-white/20 rounded-md border-b-2 border-white/30 flex flex-col gap-1 p-1 mb-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-0.5 w-full bg-white/40" />
                            ))}
                        </div>
                        <Download size={24} className="text-white" strokeWidth={3} />
                        <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6">
                            <div className="w-6 h-6 bg-amber-500/20 rounded-md border border-amber-500/30 flex items-center justify-center">
                                <FileArchive size={14} className="text-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // [President's Request] Video to Audio Graphics
    if (type === 'video-to-audio') {
        if (index === 0) { // Step 01: 영상 업로드
            return (
                <div className="relative w-36 h-28 flex items-center justify-center">
                    <div className="w-28 h-20 bg-blue-600 rounded-2xl shadow-xl relative flex items-center justify-center transition-transform group-hover:scale-105">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center">
                            <Upload size={28} className="text-blue-500 animate-bounce" />
                        </div>
                        <div className="w-full h-1/2 bg-white/10 mt-auto rounded-b-2xl border-t border-white/20" />
                    </div>
                </div>
            );
        }
        if (index === 1) { // Step 02: 포맷 선택 (Badges Grid)
            return (
                <div className="w-48 bg-slate-800/80 rounded-2xl border border-slate-700/50 p-3 shadow-2xl space-y-2 scale-90">
                    <div className="grid grid-cols-2 gap-1.5">
                        <div className="bg-blue-600 text-[9px] font-black text-white px-2 py-1.5 rounded-lg border border-blue-400/30 text-center">MP3</div>
                        <div className="bg-slate-700/50 text-[9px] font-black text-slate-300 px-2 py-1.5 rounded-lg border border-white/5 text-center">WAV</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-xl p-2 flex items-center justify-center gap-1">
                        {[4, 8, 5, 10, 6, 8, 4].map((h, i) => (
                            <div key={i} style={{ height: `${h}px` }} className="w-1 bg-blue-400/50 rounded-full animate-pulse" />
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                        {['M4A', 'FLAC', 'OGG'].map(f => (
                            <div key={f} className="bg-slate-700/50 text-[7px] font-black text-slate-400 px-1 py-1 rounded-md border border-white/5 text-center">{f}</div>
                        ))}
                    </div>
                </div>
            );
        }
        if (index === 2) { // Step 03: 변환 & 다운로드
            return (
                <div className="relative w-32 h-28 flex items-center justify-center">
                    <div className="w-20 h-20 bg-blue-500 rounded-full shadow-xl relative flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Music size={40} className="text-white opacity-90 drop-shadow-lg" strokeWidth={3} />
                        <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6">
                            <Download size={24} className="text-blue-600" strokeWidth={3} />
                        </div>
                    </div>
                </div>
            );
        }
    }
    
    // Default fallback graphic
    const icons = [Zap, Lightbulb, Flame, Info];
    const FallbackIcon = icons[index % 4];
    return (
        <div className="p-7 bg-white/5 rounded-[2.5rem] text-blue-500 group-hover:scale-110 group-hover:text-blue-400 transition-all duration-500 shadow-inner">
            <FallbackIcon size={56} strokeWidth={1} />
        </div>
    );
};

export default function MasterGuidePortal({ toolId, subId }: MasterGuidePortalProps) {
    const guides = EXPERT_GUIDES[toolId];
    if (!guides || guides.length === 0) return null;

    // Enhanced Fallback Logic: Try subId, then 'master' or first guide
    let guide = subId ? guides.find(g => g.id === subId) : null;
    if (!guide) {
        guide = guides.find(g => g.id.includes('master')) || guides[0];
    }

    return (
        <div className="w-full space-y-20 animate-in fade-in slide-in-from-bottom-5 duration-1000 mt-20">
            {/* 1. Master Guide Banner - Simplified Executive Look */}
            <div className="bg-white/40 backdrop-blur-sm p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden group mb-12">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-2.5 h-10 bg-indigo-600 rounded-full shadow-lg" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{guide.title}</h2>
                </div>
                <div className="whitespace-pre-line text-slate-600 text-lg leading-relaxed font-bold italic opacity-80">{guide.content.intro}</div>
            </div>

            {/* 3. Usage Steps - High Fidelity Redesign matching User Reference */}
            <div className="mb-24">
                <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-0 relative max-w-6xl mx-auto">
                    {guide.content.usageSteps.map((step, idx) => {
                        const title = typeof step === 'string' ? step : step.title;
                        const subtitle = typeof step === 'string' ? '' : step.subtitle;

                        return (
                            <React.Fragment key={idx}>
                                <div className="relative flex-1 group min-w-0">
                                    {/* Dual-Tone Premium Card */}
                                    <div className="flex flex-col h-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-3">
                                        {/* Top Section: Dark Graphic area */}
                                        <div className="bg-slate-900 p-10 flex flex-col items-center justify-center min-h-[280px] relative">
                                            {/* Circular Step Badge (Prominent) */}
                                            <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-[1000] shadow-xl absolute -top-4 -left-4 border-4 border-white z-20">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            
                                            {/* Rich Graphic Illustration */}
                                            <div className="mt-4">
                                                <RichStepGraphic type={toolId} index={idx} />
                                            </div>
                                            
                                            {/* Floating Info inside Dark Area */}
                                            <div className="mt-10 text-center">
                                                <h3 className="text-white font-[1000] text-2xl tracking-tighter mb-2">{title}</h3>
                                                <p className="text-slate-400 font-bold text-xs opacity-70">{subtitle}</p>
                                            </div>
                                        </div>

                                        {/* Bottom Section: White Info area (Standard Design) */}
                                        <div className="bg-white p-10 flex flex-col items-center justify-center text-center border-t border-slate-100">
                                            <h4 className="text-slate-900 font-black text-lg mb-2">
                                                {String(idx + 1).padStart(2, '0')} {title}
                                            </h4>
                                            <p className="text-slate-500 font-bold text-sm leading-relaxed">{subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bold Solid Blue Arrow */}
                                {idx < guide.content.usageSteps.length - 1 && (
                                    <div className="hidden md:flex items-center justify-center w-12 shrink-0 z-20 mx-2">
                                        <div className="w-full h-2 bg-blue-500/20 rounded-full relative">
                                            <div className="absolute inset-y-0 left-0 bg-blue-500 w-full rounded-full shadow-lg shadow-blue-500/30" />
                                            <ChevronRight className="absolute -right-2 top-1/2 -translate-y-1/2 text-blue-500" size={24} strokeWidth={4} />
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* 2. Why Needed Grid (Moved below for focus) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm">
                    <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">📌 왜 필요할까?</h4>
                    <ul className="space-y-4">
                        {(guide.content.whyNeeded || []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-indigo-600 font-bold">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0" />{item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm">
                    <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">🚀 활용 방법</h4>
                    <ul className="space-y-4">
                        {guide.content.situations.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-indigo-600 font-bold">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0" />{item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 4. Core Summary Section */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-4 shadow-sm">
                <div className="bg-rose-50/30 rounded-[2rem] border border-rose-100/50 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl shrink-0">🔥</div>
                        <div>
                            <h4 className="text-sm font-[1000] text-slate-400 uppercase tracking-[0.2em] mb-1">핵심 정리</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">마스터 가이드 한 줄 요약</p>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <p className="text-2xl md:text-3xl font-[1000] text-rose-500 italic flex items-center justify-end gap-3">
                            <span className="text-2xl">👉</span>{guide.content.summary.replace('👉 ', '')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
