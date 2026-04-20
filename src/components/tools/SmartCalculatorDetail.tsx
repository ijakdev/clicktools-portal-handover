"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Copy, X, Sparkles, Star, ChevronRight, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CALCULATOR_DATA, CATEGORIES } from '@/data/calculator-data';
import { renderCalculator, copyToClipboard } from './calculators';

interface SmartCalculatorDetailProps {
    id: string;
}

export default function SmartCalculatorDetail({ id }: SmartCalculatorDetailProps) {
    const [currentResult, setCurrentResult] = useState('');
    const [activeCat, setActiveCat] = useState('all');
    
    // Find selected tool
    const tool = CALCULATOR_DATA.find(t => t.id === id);
    if (!tool) return <div>Tool Not Found</div>;

    const filteredCalculators = CALCULATOR_DATA.filter(calc => activeCat === 'all' || calc.cat === activeCat);

    const handleResult = (res: any) => {
        const str = typeof res === 'number' ? res.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(res);
        setCurrentResult(str);
    };

    // Scroll to top on id change with a slight delay to ensure render is complete
    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        setCurrentResult('');
        return () => clearTimeout(timer);
    }, [id]);

    return (
        <div className="bg-white min-h-screen font-outfit text-slate-900 pb-20">
            {/* Active Calculator Section - Tier 0 High Focus */}
            <div className="container mx-auto px-6 max-w-[1000px] pt-10 pb-16">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                        {React.createElement(tool.icon || Sparkles, { size: 28 })}
                    </div>
                    <h2 className="text-3xl font-[1000] text-slate-900 tracking-tighter">{tool.title}</h2>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="p-8 relative z-10">
                        <div className="mb-10">
                            {renderCalculator(id, handleResult)}
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                            <button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm" 
                                onClick={() => copyToClipboard(currentResult)}
                            >
                                <Copy size={18} /> 결과 복사
                            </button>
                            <Link 
                                href="/tools/smart-calc-box"
                                className="bg-slate-50 text-slate-500 font-bold py-3 px-8 rounded-lg transition-all hover:bg-slate-100 hover:text-slate-800 flex items-center justify-center"
                            >
                                닫기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Selection Section - Tier 1 (Now at the bottom) */}
            <div className="bg-slate-50/50 border-y border-slate-100 py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col items-center mb-16">
                        <h3 className="text-3xl font-[1000] text-slate-900 mb-4 tracking-tight">다른 도구 바로가기</h3>
                        <div className="w-16 h-1.5 bg-indigo-600 rounded-full" />
                    </div>

                    {/* Category Bar */}
                    <div className="flex justify-center mb-12 overflow-x-auto no-scrollbar">
                        <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100 flex gap-2">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => setActiveCat(cat.id)} 
                                    className={cn(
                                        "px-5 py-2.5 text-[13px] font-black tracking-tight rounded-xl transition-all whitespace-nowrap", 
                                        activeCat === cat.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
                        {filteredCalculators.map((calc) => (
                            <Link 
                                key={calc.id} 
                                href={`/tools/smart-calc-box/${calc.id}`}
                                className={cn(
                                    "bg-white p-5 py-6 rounded-2xl border transition-all cursor-pointer group flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 relative",
                                    calc.id === id ? "border-indigo-600 ring-4 ring-indigo-50" : "border-slate-100"
                                )}
                            >
                                <div className="text-indigo-600 mb-4 group-hover:scale-110 transition-transform bg-indigo-50/50 p-3 rounded-xl">
                                    <calc.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[1rem] font-[1000] text-slate-900 tracking-tight">{calc.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
