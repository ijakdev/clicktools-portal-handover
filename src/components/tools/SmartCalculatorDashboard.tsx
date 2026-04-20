"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES, CALCULATOR_DATA } from '@/data/calculator-data';

export default function SmartCalculatorDashboard() {
    const [activeCat, setActiveCat] = useState('all');
    const filteredCalculators = CALCULATOR_DATA.filter(calc => activeCat === 'all' || calc.cat === activeCat);

    return (
        <div className="min-h-screen bg-white font-outfit text-slate-900">
            {/* [Tier 0] Centered Header - Smart Calc Box */}
            <div className="pt-20 pb-8 bg-white text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-[1000] text-slate-900 tracking-tighter mb-2 shadow-indigo-600/10">스마트 계산기</h1>
                    <p className="text-lg font-bold text-indigo-600 tracking-tight">일상에 필요한 23가지 무료 계산기</p>
                    <div className="w-16 h-1 bg-indigo-600 mx-auto mt-8 rounded-full hidden md:block" />
                </div>
            </div>

            {/* [Tier 1.1] Category Bar */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-40 overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-6 max-w-6xl flex justify-center">
                    {CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={cn("px-6 py-5 text-sm font-black tracking-tight border-b-4 transition-all whitespace-nowrap", activeCat === cat.id ? "text-indigo-600 border-indigo-600 bg-indigo-50/20" : "text-slate-400 border-transparent hover:text-slate-600")}>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* [Tier 1.2] Calculator Grid */}
            <div className="container mx-auto px-6 max-w-7xl py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
                    {filteredCalculators.map((calc) => (
                        <Link 
                            key={calc.id} 
                            href={`/tools/smart-calc-box/${calc.id}`}
                            className="bg-white p-6 py-8 rounded-2xl border border-slate-100 shadow-sm transition-all cursor-pointer group flex flex-col items-center text-center hover:border-indigo-600 hover:shadow-2xl hover:-translate-y-2 relative"
                        >
                            <div className="absolute top-5 right-5 text-slate-100 group-hover:text-amber-400 transition-colors">
                                <Star size={18} fill="currentColor" />
                            </div>
                            <div className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform bg-indigo-50/50 p-4 rounded-2xl">
                                <calc.icon size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-[1.2rem] font-[1000] text-slate-900 tracking-tight mb-2">{calc.title}</h3>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{calc.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
