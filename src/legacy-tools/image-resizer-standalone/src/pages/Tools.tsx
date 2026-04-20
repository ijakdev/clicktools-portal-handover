import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/tools';
import { Link } from 'react-router-dom';
import DynamicIcon from '../components/DynamicIcon';
import { cn } from '../utils/cn';

const Tools: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('All');

    const filteredTools = TOOLS.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container mx-auto px-4 py-16 space-y-12 animate-in pb-32">
            <div className="space-y-4">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">전체 도구 탐색</h1>
                <p className="text-gray-500 font-medium">필요한 작업을 빠르게 찾고 실행하세요.</p>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:flex-grow group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="이미지 변환, PDF 병합, 요약 등 검색..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 focus:bg-white p-5 pl-16 rounded-3xl font-bold text-gray-900 dark:text-white transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex w-full lg:w-fit gap-2">
                    <button className="flex-grow lg:flex-none flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-2xl font-black text-xs text-gray-500 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                        <SlidersHorizontal size={16} />
                        필터
                    </button>
                    <button className="flex-grow lg:flex-none flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-2xl font-black text-xs text-gray-500 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                        <ArrowUpDown size={16} />
                        정렬
                    </button>
                    <button className="hidden sm:flex items-center justify-center bg-blue-50 text-blue-600 px-5 py-4 rounded-2xl font-black">
                        <LayoutGrid size={18} />
                    </button>
                </div>
            </div>

            {/* Categories Scroller */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "whitespace-nowrap px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all",
                            activeCategory === cat
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-blue-100"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                        <Link
                            key={tool.id}
                            to={`/tool/${tool.id}`}
                            className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-blue-600 transition-all hover:shadow-xl hover:-translate-y-1 group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <DynamicIcon name={tool.icon} size={24} />
                                </div>
                                <div className="flex gap-1">
                                    {tool.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[9px] font-black uppercase tracking-tighter bg-gray-50 dark:bg-gray-800 text-gray-400 px-2 py-1 rounded-md">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                            <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed">{tool.shortDesc}</p>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">검색 결과가 없습니다</h3>
                        <p className="text-gray-400 font-medium">다른 키워드로 검색해 보시겠어요?</p>
                        <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline pt-2">필터 초기화</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tools;
