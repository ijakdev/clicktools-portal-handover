
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Type, FileText, Trash2, Hash, AlignLeft, 
    Link as LinkIcon, Code, Copy, Check, RefreshCw, 
    ArrowDownUp, Scissors, Eraser, Zap,
    BarChart3, Info, Download, Trash, ListFilter,
    Settings, Sparkles, Activity, Search,
    ChevronLeft, ArrowRight, CornerDownLeft, MoveRight
} from 'lucide-react';
import { toast } from 'sonner';
import * as analyze from '@/lib/text-utils/analyze';
import * as cleanup from '@/lib/text-utils/cleanup';
import * as convert from '@/lib/text-utils/convert';
import * as transform from '@/lib/text-utils/transform';
import { cn } from '@/lib/utils';
import { TEXT_ACTIONS } from '@/data/text-tools';

const IconMap: { [key: string]: any } = {
    Scissors, Eraser, Trash2, Code, ArrowDownUp, Type, Hash, ListFilter, Zap, RefreshCw, LinkIcon, FileText
};

export default function TextToolbox({toolId}:{toolId:string|null}) {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [stats, setStats] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeToolId, setActiveToolId] = useState<string | null>(toolId);


    const [isRealtime, setIsRealtime] = useState(true);
    const [codecMode, setCodecMode] = useState<'encode' | 'decode'>('encode');
    
    const editorRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setStats(analyze.analyzeText(inputText));
    }, [inputText]);

    const activeTool = TEXT_ACTIONS.find(a => a.id === activeToolId);

    const executeAction = useCallback((id: string, input: string, mode: 'encode' | 'decode') => {
        if (!input && id !== 'random-picker') return '';
        
        let result = '';
        try {
            switch (id) {
                case 'remove-line-breaks': result = cleanup.removeLineBreaks(input); break;
                case 'remove-empty-lines': result = cleanup.removeEmptyLines(input); break;
                case 'remove-duplicate-lines': result = cleanup.removeDuplicateLines(input); break;
                case 'strip-html-tags': result = convert.stripHtmlTags(input); break;
                case 'text-to-html': result = convert.textToHtml(input); break;
                case 'alphabetical-sort': result = transform.sortLines(input); break;
                case 'uppercase': result = transform.toUpperCase(input); break;
                case 'lowercase': result = transform.toLowerCase(input); break;
                case 'to-title-case': result = transform.toTitleCase(input); break;
                case 'remove-spaces': result = input.replace(/\s+/g, ''); break;
                case 'remove-numbers': result = transform.removeNumbers(input); break;
                case 'word-counter':
                    const s = analyze.analyzeText(input);
                    result = `글자 수 (공백 포함): ${s.charCountWithSpaces}\n글자 수 (공백 제외): ${s.charCountNoSpaces}\n단어 수: ${s.wordCount}\n문장 수: ${s.sentenceCount}\n줄 수: ${s.lineCount}`;
                    break;
                case 'word-frequency':
                    const freq = analyze.analyzeWordFrequency(input);
                    result = freq.map(f => `${f.word}: ${f.count}회`).join('\n');
                    break;
                case 'random-picker':
                    const lines = input.split(/\r?\n/).filter(line => line.trim() !== '');
                    result = lines.length > 0 ? lines[Math.floor(Math.random() * lines.length)] : '목록이 비어있습니다.';
                    break;
                case 'base64-encode-decode':
                    result = mode === 'encode' ? convert.encodeBase64(input) : convert.decodeBase64(input);
                    break;
                case 'url-encode-decode':
                    result = mode === 'encode' ? convert.encodeUrl(input) : convert.decodeUrl(input);
                    break;
                default: result = input;
            }
        } catch (e) {
            console.error(e);
            return '에러: 변환 중 오류가 발생했습니다.';
        }
        return result;
    }, []);

    useEffect(() => {
        if (isRealtime && activeToolId && activeTool?.supportsRealtime) {
            setOutputText(executeAction(activeToolId, inputText, codecMode));
        }
    }, [inputText, activeToolId, isRealtime, codecMode, activeTool, executeAction]);

    const handleToolSelect = (id: string) => {
        handleClear();
        setActiveToolId(id);
        // 도구 변경 시에는 항상 초기화하므로 추가 실행이 필요 없습니다.
    };

    const handleSampleInput = () => {
        if (!activeToolId) {
            toast.error('먼저 상단에서 기능을 선택해주세요');
            return;
        }

        const sampleMap: Record<string, string> = {
            'remove-line-breaks': '꽃잎이\n진다고\n그대를\n잊은 적\n없다.\n\n- 사장님의 시 한 소절',
            'remove-empty-lines': '첫 번째 줄입니다.\n\n\n두 번째 줄입니다.\n\n\n\n세 번째 줄입니다.',
            'remove-duplicate-lines': '로또 1등\n대통령님\n사장님\n로또 1등\n사장님\n최고의 전문가',
            'strip-html-tags': '<div class="container">\n  <h1>반가워요 사장님!</h1>\n  <p>이것은 <b>최첨단</b> HTML 태그 제거 샘플입니다.</p>\n  <style>.text { color: red; }</style>\n</div>',
            'text-to-html': '안녕하세요 사장님.\n오늘도 최고의 작업물을 만들어보겠습니다.\n\n두 번째 문단입니다.',
            'alphabetical-sort': '바나나\n사과\n포도\n멜론\n수박\n딸기',
            'uppercase': 'hello clicktools world\ni am the best ai architect',
            'lowercase': 'HELLO CLICKTOOLS WORLD\nI AM THE BEST AI ARCHITECT',
            'to-title-case': 'clicktools portal case transform sample',
            'remove-spaces': '띄 어 쓰 기 가   너 무   많 은   문 장 입 니 다 .',
            'remove-numbers': '전화번호: 010-1234-5678\n금액: 1,200,000원\n날짜: 2026년 4월 8일',
            'word-counter': '사장님은 세계 최고 수준의 AI 자동화 시스템 아키텍트이자 풀스택 개발자이며 UX 설계 전문가입니다.\n모든 작업은 전문가 수준으로 수행해야 합니다.',
            'word-frequency': '사장님 사장님 최고의 사장님\n전문가 전문가 최고의 전문가\n시스템 시스템 최고의 시스템',
            'random-picker': '짜장면\n짬뽕\n탕수육\n볶음밥\n울면',
            'base64-encode-decode': codecMode === 'encode' ? '안녕하세요 사장님!' : '7JWI64WV7ZWY7IS47JqUIOyCrOyekOuLmSE=',
            'url-encode-decode': codecMode === 'encode' ? 'https://clicktools.com/search?q=사장님 최고의 툴' : 'https%3A%2F%2Fclicktools.com%2Fsearch%3Fq%3D%EC%82%AC%EC%9E%A5%EB%8B%98%20%EC%B2%B1%EA%B3%A0%EC%9D%98%20%ED%86%A8'
        };

        const sample = sampleMap[activeToolId] || '내용을 입력해주세요.';
        setInputText(sample);
        toast.info(`${activeTool?.name}용 샘플 텍스트가 로드되었습니다`);
    };

    const handleClear = () => {
        setInputText('');
        setOutputText('');
    };

    const handleCopy = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        toast.success('복사 완료');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!outputText) return;
        const blob = new Blob([outputText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ClickTools_${activeToolId || 'result'}.txt`;
        link.click();
    };

    const sendToInput = () => {
        if (!outputText) return;
        setInputText(outputText);
        setOutputText('');
    };

    const filteredTools = TEXT_ACTIONS.filter(t => 
        t.name.includes(searchQuery) || t.shortDescription.includes(searchQuery)
    );

    return (
        <div className="flex flex-col text-slate-900 bg-[#F8FAFC]">
            {/* 1. Simple Legacy Hero */}
            <section className="bg-white border-b border-slate-100 py-16 px-4">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        텍스트 변환의 <span className="text-blue-600">모든것</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        줄바꿈 제거, HTML 정리, 중복 제거, 정렬, 대소문자 변환까지 
                        업무에 꼭 필요한 텍스트 툴을 하나로 모았습니다.
                    </p>
                    
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="relative flex items-center">
                            <Search className="absolute left-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="필요한 기능을 검색해보세요 (예: 줄바꿈, HTML, 정렬)"
                                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Legacy Tool Matrix (1:1 UI Restoration) */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">가장 많이 찾는 도구</h2>
                        <p className="text-slate-500">사용자들이 자주 사용하는 인기 도구들입니다.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTools.map((tool) => {
                            const Icon = IconMap[tool.icon] || Zap;
                            const isActive = activeToolId === tool.id;
                            
                            return (
                                <div 
                                    key={tool.id}
                                    onClick={() => handleToolSelect(tool.id)}
                                    className={cn(
                                        "group block bg-white border border-slate-200/60 rounded-2xl p-6 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200",
                                        isActive && "ring-2 ring-blue-500 border-blue-500"
                                    )}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                                                <Icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            {tool.isPopular && (
                                                <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-100">
                                                    인기 도구
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
                                            {tool.shortDescription}
                                        </p>
                                        
                                        <div className="flex items-center text-sm font-semibold text-blue-600">
                                            {isActive ? '설정 확인하기' : '바로 사용하기'}
                                            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. Editor Matrix (Split-Screen) */}
            <section id="editor-matrix" className="py-20 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-10 flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">변환 모드</h4>
                            <div className="flex items-center gap-4">
                                <span className={cn("text-xl font-bold", activeToolId ? "text-slate-900" : "text-slate-300")}>
                                    {activeTool?.name || "기능을 선택해주세요"}
                                </span>
                                {(activeToolId?.includes('encode-decode')) && (
                                    <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                                        <button 
                                            onClick={() => { handleClear(); setCodecMode('encode'); }}
                                            className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", codecMode === 'encode' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600")}
                                        >
                                            인코딩
                                        </button>
                                        <button 
                                            onClick={() => { handleClear(); setCodecMode('decode'); }}
                                            className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", codecMode === 'decode' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-600")}
                                        >
                                            디코딩
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={isRealtime} 
                                    onChange={(e) => setIsRealtime(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                                />
                                <span className="text-sm font-semibold text-slate-600">실시간 자동 변환</span>
                            </label>
                            {(!isRealtime || !activeTool?.supportsRealtime || activeToolId === 'random-picker') && (
                                <button 
                                    onClick={() => setOutputText(executeAction(activeToolId || '', inputText, codecMode))}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    {activeToolId === 'random-picker' ? '랜덤 뽑기' : '변환 실행하기'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Area */}
                        <div className="flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <span className="text-sm font-bold text-slate-700">입력 텍스트</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleSampleInput} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-100 rounded-lg hover:bg-blue-50">샘플 입력</button>
                                    <button onClick={handleClear} className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">초기화</button>
                                </div>
                            </div>
                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="여기에 변환할 텍스트를 입력하시거나 왼쪽의 도구를 활성화하십시오."
                                className="flex-grow min-h-[400px] p-6 text-slate-700 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                            />
                            <div className="px-6 py-3 bg-slate-50/30 text-[11px] text-slate-400 border-t border-slate-100 flex justify-between">
                                <span>{inputText.length} 자 / {stats?.wordCount || 0} 단어</span>
                            </div>
                        </div>

                        {/* Output Area */}
                        <div className="flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <span className="text-sm font-bold text-slate-700">변환 결과</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleDownload} className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">다운로드 (.txt)</button>
                                    <button 
                                        onClick={handleCopy}
                                        className={cn(
                                            "px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5",
                                            copied ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                                        )}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={16} />} 
                                        {copied ? '복사됨' : '결과 복사'}
                                    </button>
                                </div>
                            </div>
                            <textarea 
                                readOnly
                                value={outputText}
                                placeholder="변환 결과가 여기에 표시됩니다..."
                                className="flex-grow min-h-[400px] p-6 text-slate-700 focus:outline-none resize-none font-mono text-sm bg-slate-50/20 leading-relaxed"
                            />
                            <div className="px-6 py-3 bg-slate-50/30 text-[11px] text-slate-400 border-t border-slate-100 flex justify-between items-center">
                                <span>{outputText.length} 자</span>
                                <button onClick={sendToInput} className="text-blue-600 font-bold hover:underline text-xs">결과를 입력창으로 보내기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
