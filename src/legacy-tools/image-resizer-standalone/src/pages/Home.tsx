import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Crown } from 'lucide-react';
import { CATEGORIES, getToolsByCategory } from '../data/tools';
import DynamicIcon from '../components/DynamicIcon';
import { cn } from '../utils/cn';

const Home: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('All');
    const filteredTools = getToolsByCategory(activeCategory);

    return (
        <div className="space-y-24 pb-24">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 -z-10" />
                <div className="container mx-auto px-4 text-center space-y-8 animate-in">
                    <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-blue-100 shadow-sm">
                        <Sparkles className="text-blue-600" size={16} />
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Ultimate Productivity Suite</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight">
                        세상의 모든 유틸리티를<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">한 곳에서 해결하세요</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        이미지, 문서, 오디오, 영상 처리를 광고 시청만으로 무료로 이용하세요.<br />
                        단 하나의 구독으로 30개 이상의 고급 도구를 무제한으로.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <Link to="/tools" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                            무료로 시작하기 (광고 보기)
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/pricing" className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2">
                            프리미엄 구독
                            <Crown size={20} className="text-amber-500" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Category Tabs & Tool Grid */}
            <section className="container mx-auto px-4 space-y-12">
                <div className="flex flex-col items-center gap-8">
                    <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest",
                                    activeCategory === cat
                                        ? "bg-white dark:bg-gray-800 text-blue-600 shadow-md"
                                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTools.map((tool) => (
                        <Link
                            key={tool.id}
                            to={`/tool/${tool.id}`}
                            className="group bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-blue-600 transition-all hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col items-start text-left"
                        >
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-6 group-hover:bg-blue-600 transition-colors">
                                <DynamicIcon name={tool.icon} className="text-blue-600 group-hover:text-white transition-colors" size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                                {tool.shortDesc}
                            </p>
                            <div className="mt-auto flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                실행하기
                                <ArrowRight size={14} />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center pt-8">
                    <Link to="/tools" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors">
                        전체 도구 보기
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            {/* Premium Section */}
            <section className="container mx-auto px-4">
                <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 overflow-hidden relative shadow-2xl shadow-blue-600/20">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl space-y-6 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                프리미엄으로 더 강력한<br />기능을 경험하세요
                            </h2>
                            <p className="text-blue-100 text-lg font-medium opacity-80">
                                광고 시청 없이 즉시 실행, 고용량 파일 처리, AI 도구 무제한 사용 등 전문가를 위한 혜택을 제공합니다.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                {[
                                    '광고 없는 무제한 이용',
                                    '우선 순위 처리 속도',
                                    '최대 2GB 파일 업로드',
                                    '모든 고급 AI 필터 해제'
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3 text-white font-bold">
                                        <CheckCircle2 className="text-blue-300" size={20} fill="currentColor" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="shrink-0">
                            <Link to="/pricing" className="bg-white text-blue-600 px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                                지금 구독 시작
                                <Crown size={24} fill="currentColor" />
                            </Link>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
                </div>
            </section>
        </div>
    );
};

export default Home;
