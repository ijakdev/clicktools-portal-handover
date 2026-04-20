import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Upload, File, Settings, Play, Download, RefreshCw,
    CheckCircle2, AlertTriangle, Info,
    ChevronRight, Trash2
} from 'lucide-react';
import { getToolById } from '../data/tools';
import {
    hasAccess, grantFreeAccess, mockProcess,
    type ProcessingProgress, downloadDummy
} from '../utils/subscription';
import { cn } from '../utils/cn';
import DynamicIcon from '../components/DynamicIcon';
import GateModal from '../components/GateModal';
import AdModal from '../components/AdModal';
import ProgressBar from '../components/ProgressBar';
import ImageResizer from '../components/tools/ImageResizer';

const ToolDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const tool = getToolById(id || '');

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [options, setOptions] = useState<Record<string, any>>({});

    // Access states
    const [showGate, setShowGate] = useState(false);
    const [showAd, setShowAd] = useState(false);

    // Processing states
    const [isProcessing, setIsProcessing] = useState(false);
    const [processData, setProcessData] = useState<ProcessingProgress | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isResizerOpen, setIsResizerOpen] = useState(false);

    // Auto-open resizer if id is img-resize
    useEffect(() => {
        if (id === 'img-resize') {
            setIsResizerOpen(true);
        }
    }, [id]);

    // Initialize options
    useEffect(() => {
        if (tool) {
            const defaults: Record<string, any> = {};
            tool.mockOptions.forEach(opt => {
                defaults[opt.id] = opt.defaultValue;
            });
            setOptions(defaults);
        }
    }, [tool]);

    const startProcessing = useCallback(async () => {
        setShowGate(false);
        setIsProcessing(true);
        setProcessData({ progress: 0, message: '초기화 중...', isDone: false });

        await mockProcess((data) => {
            setProcessData(data);
        });

        setIsProcessing(false);
        setIsCompleted(true);
    }, []);

    if (!tool) {
        return (
            <div className="container mx-auto px-4 py-32 text-center space-y-8 animate-in">
                <div className="bg-red-50 text-red-600 inline-flex p-10 rounded-full">
                    <AlertTriangle size={64} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900">도구를 찾을 수 없습니다</h2>
                    <p className="text-gray-500 font-medium">잘못된 접근이거나 삭제된 도구일 수 있습니다.</p>
                </div>
                <button onClick={() => navigate('/tools')} className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">
                    모든 도구 목록으로 돌아가기
                </button>
            </div>
        );
    }

    const handleExecute = () => {
        if (!file && tool.acceptedFileTypes.length > 0) {
            if (tool.id === 'img-resize') {
                setIsResizerOpen(true);
            }
            return;
        }

        if (hasAccess()) {
            if (tool.id === 'img-resize') {
                setIsResizerOpen(true);
            } else {
                startProcessing();
            }
        } else {
            setShowGate(true);
        }
    };

    const handleAdComplete = () => {
        grantFreeAccess();
        setShowAd(false);
        window.dispatchEvent(new Event('storage')); // Update header
        startProcessing();
    };

    const handleDownload = () => {
        const ext = tool.outputType === 'image' ? 'png' : (tool.outputType === 'text' ? 'txt' : 'file');
        downloadDummy(`UtilityPro_${tool.id}_result.${ext}`);
    };

    return (
        <div className="bg-gray-50/50 dark:bg-gray-950/50 min-h-screen pt-12 pb-32 selection:bg-blue-100">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-3 text-xs font-black text-gray-400 mb-12 uppercase tracking-[0.2em]">
                    <Link to="/tools" className="hover:text-blue-600 transition-colors">TOOLS</Link>
                    <ChevronRight size={14} className="opacity-40" />
                    <span className="text-gray-900 dark:text-gray-200">{tool.category}</span>
                    <ChevronRight size={14} className="opacity-40" />
                    <span className="text-blue-600">{tool.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Action Area */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/40 dark:shadow-none p-10 md:p-16">
                            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
                                <div className="bg-blue-600 p-5 rounded-[2rem] shadow-xl shadow-blue-500/30 shrink-0">
                                    <DynamicIcon name={tool.icon} className="text-white" size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{tool.name}</h1>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">{tool.shortDesc}</p>
                                </div>
                            </div>

                            {/* Main Interaction Area */}
                            {isProcessing ? (
                                <div className="py-24 md:py-36">
                                    <ProgressBar
                                        progress={processData?.progress || 0}
                                        message={processData?.message || '준비 중...'}
                                    />
                                </div>
                            ) : isCompleted ? (
                                <div className="py-16 text-center animate-in space-y-12">
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 w-32 h-32 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-500/10">
                                        <CheckCircle2 size={64} fill="currentColor" className="text-green-500" />
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">준비가 완료되었습니다!</h2>
                                        <p className="text-gray-500 font-medium max-w-sm mx-auto">설정한 옵션에 맞추어 {tool.name} 처리가 성공적으로 끝났습니다.</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <button
                                            onClick={handleDownload}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-6 px-16 rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-blue-500/30 scale-105 active:scale-95"
                                        >
                                            <Download size={24} />
                                            결과물 다운로드
                                        </button>
                                        <button
                                            onClick={() => { setIsCompleted(false); setFile(null); }}
                                            className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black py-6 px-12 rounded-[2rem] hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                                        >
                                            <RefreshCw size={24} />
                                            다른 파일 시도
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={cn(
                                        "relative border-4 border-dashed rounded-[4rem] p-16 md:p-32 transition-all duration-500 text-center group overflow-hidden",
                                        isDragging
                                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                                            : "border-gray-100 dark:border-gray-800 hover:border-blue-200 bg-gray-50/30 dark:bg-gray-900/30"
                                    )}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept={tool.acceptedFileTypes.join(',')}
                                        onChange={(e) => e.target.files && setFile(e.target.files[0])}
                                    />

                                    {file ? (
                                        <div className="space-y-8 animate-in">
                                            <div className="relative inline-block group/file">
                                                <div className="bg-white dark:bg-gray-900 w-32 h-32 rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto border border-gray-100 dark:border-gray-800">
                                                    <File size={56} className="text-blue-600" />
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                    className="absolute -top-4 -right-4 p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{file.name}</h3>
                                                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB • {file.type || 'UNKNOWN'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="file-upload" className="cursor-pointer block space-y-8">
                                            <div className="bg-white dark:bg-gray-900 w-32 h-32 rounded-[3.5rem] shadow-2xl flex items-center justify-center mx-auto border border-gray-100 dark:border-gray-800 group-hover:scale-110 transition-transform duration-700">
                                                <Upload size={56} className="text-blue-600" />
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-3xl font-black text-gray-900 dark:text-white">파일을 드래구하거나 선택하세요</h3>
                                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                                    지원: {tool.acceptedFileTypes.join(', ')}
                                                </p>
                                            </div>
                                        </label>
                                    )}

                                    {/* Exec Button */}
                                    <div className="mt-16">
                                        <button
                                            onClick={handleExecute}
                                            disabled={!file && tool.acceptedFileTypes.length > 0}
                                            className={cn(
                                                "w-full max-w-md py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl",
                                                (!file && tool.acceptedFileTypes.length > 0)
                                                    ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 hover:scale-105 active:scale-95"
                                            )}
                                        >
                                            <Play size={24} fill="currentColor" />
                                            기능 실행하기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Guide Section */}
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-12">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                                <Info size={24} className="text-blue-600" />
                                사용 가이드 및 보안 안내
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-medium text-gray-500 leading-relaxed">
                                <div className="space-y-4">
                                    <p>1. 원하는 파일을 업로드 영역에 끌어다 놓으세요.</p>
                                    <p>2. 우측 패널에서 도구 전용 옵션을 설정할 수 있습니다.</p>
                                    <p>3. '실행하기'를 누르면 AI 처리가 시작됩니다.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                        <p className="font-black text-gray-900 dark:text-white text-xs mb-2 uppercase">완전한 보안 보장</p>
                                        <p className="text-[11px]">업로드된 모든 파일은 처리 즉시 서버에서 영구 삭제됩니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Options Panel */}
                    <aside className="lg:col-span-4 sticky top-28 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/40 dark:shadow-none p-10">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-10 flex items-center gap-4">
                                <Settings size={24} className="text-blue-600" />
                                구성 옵션
                            </h3>

                            {tool.mockOptions.length > 0 ? (
                                <div className="space-y-10">
                                    {tool.mockOptions.map((opt) => (
                                        <div key={opt.id} className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{opt.label}</label>
                                                {opt.type === 'number' && <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{options[opt.id]}</span>}
                                            </div>

                                            {opt.type === 'select' && (
                                                <select
                                                    className="w-full p-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                                                    value={options[opt.id]}
                                                    onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                                                >
                                                    {opt.options?.map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            )}

                                            {opt.type === 'number' && (
                                                <input
                                                    type="range"
                                                    min="100"
                                                    max="4000"
                                                    className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-600"
                                                    value={options[opt.id]}
                                                    onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                                                />
                                            )}

                                            {opt.type === 'checkbox' && (
                                                <button
                                                    onClick={() => setOptions({ ...options, [opt.id]: !options[opt.id] })}
                                                    className="flex items-center gap-4 group w-full"
                                                >
                                                    <div className={cn(
                                                        "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all",
                                                        options[opt.id] ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 bg-white"
                                                    )}>
                                                        {options[opt.id] && <CheckCircle2 size={18} fill="currentColor" />}
                                                    </div>
                                                    <span className="font-bold text-gray-700 dark:text-gray-300">활성화됨</span>
                                                </button>
                                            )}

                                            {opt.type === 'text' && (
                                                <input
                                                    type="text"
                                                    className="w-full p-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl text-sm font-bold"
                                                    value={options[opt.id]}
                                                    onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-400 font-black px-10 leading-relaxed uppercase tracking-widest">
                                        이 도구는<br />추가 옵션이 필요 없습니다
                                    </p>
                                </div>
                            )}

                            <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <span>출력 타입</span>
                                    <span className="text-blue-600">{tool.outputType}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Modals */}
            {showGate && (
                <GateModal
                    onClose={() => setShowGate(false)}
                    onWatchAd={() => { setShowGate(false); setShowAd(true); }}
                />
            )}

            {showAd && (
                <AdModal onComplete={handleAdComplete} />
            )}

            {isResizerOpen && (
                <ImageResizer
                    initialFile={file}
                    onClose={() => setIsResizerOpen(false)}
                />
            )}
        </div>
    );
};

export default ToolDetail;
