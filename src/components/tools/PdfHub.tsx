"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
    FileImage, FileText, Globe, FileType2, FileSpreadsheet, 
    Presentation, ScanText, ArrowRight, Upload, X, 
    FileUp, CheckCircle2, RefreshCw, Download, Settings2,
    Layout
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TOOLS } from '@/lib/pdf-lib/constants';
import { ToolId, ImageToPdfOptions, PdfToJpgOptions, ProcessingState, ConversionResult } from '@/types/pdf-tools';
import { convertImagesToPdf } from '@/lib/pdf-lib/converters/imageToPdf';
import { convertExcelToPdf } from '@/lib/pdf-lib/converters/excelToPdf';
import { convertWordToPdf } from '@/lib/pdf-lib/converters/wordToPdf';
import { convertPptToPdf } from '@/lib/pdf-lib/converters/pptToPdf';
import { convertPdfToJpg } from '@/lib/pdf-lib/converters/pdfToJpg';
import { v4 as uuidv4 } from 'uuid';
import { JSZip } from '@/lib/zip'; // Ensure JSZip is available
import { createZip } from '@/lib/zip';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const iconMap: any = {
  FileImage, FileText, Globe, FileType2, FileSpreadsheet, Presentation, ScanText
};

export default function PdfHub() {
    const searchParams = useSearchParams();
    const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);

    useEffect(() => {
        const toolId = searchParams.get('tool') as ToolId;
        if (toolId && TOOLS.some(t => t.id === toolId)) {
            setSelectedTool(toolId);
        }
    }, [searchParams]);

    const [files, setFiles] = useState<any[]>([]); 
    const [processing, setProcessing] = useState<ProcessingState>({
        status: 'idle',
        progress: 0,
        message: ''
    });
    const [result, setResult] = useState<ConversionResult | null>(null);

    // Options for JPG to PDF
    const [jpgOptions, setJpgOptions] = useState<ImageToPdfOptions>({
        pageSize: 'A4',
        margin: 'Small',
        orientation: 'Auto',
        mergeImages: true
    });

    const [pdfToJpgOptions, setPdfToJpgOptions] = useState<PdfToJpgOptions>({
        quality: 'high',
        extractImages: false
    });

    const [htmlUrl, setHtmlUrl] = useState('');
    const [htmlOptions, setHtmlOptions] = useState<HtmlToPdfOptions>({
        url: '',
        pageSize: 'A4',
        orientation: 'Portrait'
    });

    const activeTool = TOOLS.find(t => t.id === selectedTool);

    const handleFileDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let newFiles: File[] = [];
        if ('files' in e.target && e.target.files) {
            newFiles = Array.from(e.target.files);
        } else if ('dataTransfer' in e && e.dataTransfer.files) {
            newFiles = Array.from(e.dataTransfer.files);
        }
        
        if (newFiles.length > 0) {
            const uploaded = newFiles.map(f => ({
                id: uuidv4(),
                file: f,
                status: 'ready' as const
            }));
            setFiles(prev => [...prev, ...uploaded]);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const runConversion = async () => {
        if (!selectedTool) return;
        if (selectedTool !== 'html-to-pdf' && files.length === 0) return;

        setProcessing({ status: 'processing', progress: 30, message: 'PDF 생성 중...' });
        
        try {
            let blob: Blob;
            let filename = `converted_${Date.now()}`;
            const fileList = files.map(f => f.file);

            if (selectedTool === 'jpg-to-pdf') {
                if (jpgOptions.mergeImages) {
                    setProcessing({ status: 'processing', progress: 50, message: 'PDF 병합 중...' });
                    blob = await convertImagesToPdf(fileList, jpgOptions);
                    filename += '.pdf';
                } else {
                    setProcessing({ status: 'processing', progress: 10, message: '개별 PDF 생성 중...' });
                    const pdfFiles = [];
                    for (const f of fileList) {
                        const b = await convertImagesToPdf([f], jpgOptions);
                        pdfFiles.push({ name: `${f.name.replace(/\.[^/.]+$/, "")}.pdf`, content: b });
                    }
                    setProcessing({ status: 'processing', progress: 80, message: 'ZIP 압축 중...' });
                    blob = await createZip(pdfFiles);
                    filename = `converted_pdfs.zip`;
                }
            } else if (selectedTool === 'excel-to-pdf') {
                blob = await convertExcelToPdf(fileList);
                filename += '.pdf';
            } else if (selectedTool === 'word-to-pdf') {
                blob = await convertWordToPdf(fileList);
                filename += '.pdf';
            } else if (selectedTool === 'ppt-to-pdf') {
                blob = await convertPptToPdf(fileList);
                filename += '.pdf';
            } else if (selectedTool === 'pdf-to-jpg') {
                const zipFiles: { name: string; content: Blob }[] = [];
                setProcessing({ status: 'processing', progress: 10, message: 'PDF 분석 및 변환 중...' });
                for (const f of fileList) {
                    const pageBlobs = await convertPdfToJpg(f, pdfToJpgOptions);
                    pageBlobs.forEach((b, idx) => {
                        const pageNum = (idx + 1).toString().padStart(3, '0');
                        zipFiles.push({ name: `${f.name.replace('.pdf', '')}_p${pageNum}.jpg`, content: b });
                    });
                }
                if (zipFiles.length === 0) throw new Error('변환된 페이지가 없습니다.');
                if (zipFiles.length === 1) {
                    blob = zipFiles[0].content;
                    filename = zipFiles[0].name;
                } else {
                    setProcessing({ status: 'processing', progress: 80, message: 'ZIP 압축 중...' });
                    blob = await createZip(zipFiles);
                    filename = `converted_pages.zip`;
                }
            } else if (selectedTool === 'word-to-pdf') {
                setProcessing({ status: 'processing', progress: 10, message: 'Word 문서를 PDF로 변환하는 중...' });
                const { convertWordToPdf } = await import('@/lib/pdf-lib/converters/wordToPdf');
                blob = await convertWordToPdf(files.map(f => f.file));
                filename = `converted_${files[0].file.name.replace(/\.[^/.]+$/, '')}.pdf`;
            } else if (selectedTool === 'excel-to-pdf') {
                setProcessing({ status: 'processing', progress: 10, message: 'Excel 시트를 분석 중...' });
                const { convertExcelToPdf } = await import('@/lib/pdf-lib/converters/excelToPdf');
                blob = await convertExcelToPdf(files.map(f => f.file));
                filename = `converted_${files[0].file.name.replace(/\.[^/.]+$/, '')}.pdf`;
            } else if (selectedTool === 'ppt-to-pdf') {
                setProcessing({ status: 'processing', progress: 10, message: '슬라이드를 분석 중...' });
                const { convertPptToPdf } = await import('@/lib/pdf-lib/converters/pptToPdf');
                blob = await convertPptToPdf(files.map(f => f.file));
                filename = `converted_${files[0].file.name.replace(/\.[^/.]+$/, '')}.pdf`;
            } else if (selectedTool === 'html-to-pdf') {
                setProcessing({ status: 'processing', progress: 10, message: 'URL 분석 중...' });
                if (!htmlUrl) throw new Error('URL을 입력해주세요.');
                
                try {
                    const { convertHtmlToPdf } = await import('@/lib/pdf-lib/converters/htmlToPdf');
                    blob = await convertHtmlToPdf({ ...htmlOptions, url: htmlUrl });
                    filename = `converted_webpage_${Date.now()}.pdf`;
                } catch (err) {
                    throw new Error('현재 데모 버전에서는 실제 변환 API가 연결되지 않았습니다.');
                }
            } else {
                throw new Error('지원되지 않는 도구입니다.');
            }

            setResult({
                file: blob,
                filename,
                type: 'pdf'
            });
            setProcessing({ status: 'completed', progress: 100, message: '변환 완료!' });
            // Increment Stats
            fetch('/api/stats', { method: 'POST', body: JSON.stringify({ field: 'pdfsCreated' }), headers: { 'Content-Type': 'application/json' } }).catch(() => {});
        } catch (err: any) {
            setProcessing({ status: 'error', progress: 0, message: err.message || '변환 중 오류 발생' });
        }
    };

    const reset = () => {
        setSelectedTool(null);
        setFiles([]);
        setProcessing({ status: 'idle', progress: 0, message: '' });
        setResult(null);
    };

    if (!selectedTool) {
        return (
            <div className="space-y-12 animate-in pb-20">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase">PDF 유틸리티</h1>
                    <p className="text-lg font-bold text-slate-400">PDF 변환, 병합, 분할을 클릭 한 번으로 처리하세요.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((tool) => {
                    const Icon = iconMap[tool.icon] || FileText;
                    return (
                        <button
                            key={tool.id}
                            onClick={() => setSelectedTool(tool.id)}
                            className="group relative bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-red-900/5 transition-all hover:border-red-200 text-left overflow-hidden h-full"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="text-red-500 w-6 h-6 -translate-x-2 group-hover:translate-x-0 transition-transform" />
                            </div>

                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Icon size={32} />
                            </div>

                            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-red-700 transition-colors">
                                {tool.title}
                            </h3>

                            <p className="text-slate-400 text-sm font-bold leading-relaxed mb-4">
                                {tool.description}
                            </p>

                            <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-red-400">
                                <CheckCircle2 size={12} />
                                <span>브라우저 직접 처리</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

    return (
        <div className="max-w-4xl mx-auto p-4 animate-in">
            <div className="flex items-center justify-between mb-8">
                <button onClick={reset} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">
                    <X size={18} /> 도구 목록으로 돌아가기
                </button>
                <div className="flex items-center gap-2 text-red-600 font-black">
                    {React.createElement(iconMap[activeTool?.icon || 'FileText'], { size: 20 })}
                    <span>{activeTool?.title}</span>
                </div>
            </div>

            {/* Legacy Title/Desc Style */}
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{activeTool?.title}</h1>
                <p className="text-lg text-slate-500 font-medium">
                    {activeTool?.description}
                </p>
            </div>

            {processing.status === 'idle' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Left Column: Upload & File List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={selectedTool === 'html-to-pdf' ? undefined : handleFileDrop}
                            onClick={selectedTool === 'html-to-pdf' ? undefined : () => document.getElementById('pdf-file-upload')?.click()}
                            className={cn(
                                "border-2 border-dashed border-slate-200 rounded-3xl p-20 bg-white flex flex-col items-center justify-center text-center transition-all group min-h-[450px]",
                                selectedTool !== 'html-to-pdf' && "cursor-pointer hover:border-red-300 hover:bg-slate-50/50"
                            )}
                        >
                            {selectedTool === 'html-to-pdf' ? (
                                <div className="w-full space-y-8" onClick={(e) => e.stopPropagation()}>
                                    <div className="space-y-4 text-left">
                                        <label className="text-sm font-black text-slate-700">변환할 웹페이지 URL</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Globe className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="url"
                                                className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-lg font-bold focus:border-red-400 focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
                                                placeholder="https://example.com"
                                                value={htmlUrl}
                                                onChange={(e) => setHtmlUrl(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 border border-blue-100 text-blue-700 p-6 rounded-3xl flex items-start gap-4 text-left">
                                        <div className="p-2 bg-blue-100 rounded-xl">
                                            <FileType2 className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black">안내 사항</p>
                                            <p className="text-xs font-bold leading-relaxed opacity-80">
                                                현재 이 기능은 <span className="underline decoration-blue-300 decoration-2 underline-offset-2">서버 사이드 렌더링</span>이 필요하여, 데모 버전에서는 인터페이스만 제공됩니다. 실제 변환을 위해서는 백엔드 연동이 필요합니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <input id="pdf-file-upload" type="file" multiple hidden onChange={handleFileDrop} />
                                    <div className="w-24 h-24 bg-red-50/50 rounded-full flex items-center justify-center text-red-500 mb-8 group-hover:scale-105 transition-transform duration-300">
                                        <Upload size={48} strokeWidth={1} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-2">
                                        {selectedTool === 'word-to-pdf' ? 'Word 파일 선택' : 
                                         selectedTool === 'excel-to-pdf' ? 'Excel 파일 선택' : 
                                         selectedTool === 'ppt-to-pdf' ? 'PPT 파일 선택' : '파일 선택'}
                                    </h3>
                                    <p className="text-slate-400 font-bold">
                                        {selectedTool === 'word-to-pdf' ? 'Word 파일 드래그 앤 드롭' : 
                                         selectedTool === 'excel-to-pdf' ? 'Excel 파일 드래그 앤 드롭' : 
                                         selectedTool === 'ppt-to-pdf' ? 'PPT 파일 드래그 앤 드롭' : '파일을 여기에 드래그하거나 클릭하여 선택하세요'}
                                    </p>
                                </>
                            )}
                        </div>

                        {files.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-900/5 transition-all">
                                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
                                    <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest">업로드된 파일 ({files.length})</div>
                                    <FileUp className="w-4 h-4 text-slate-300" />
                                </div>
                                <div className="p-4 max-h-[400px] overflow-y-auto no-scrollbar">
                                    {files.map((f, i) => (
                                        <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl mb-2 last:mb-0 border border-slate-200 hover:border-red-100 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white rounded-xl text-red-400 shadow-sm group-hover:bg-red-50 transition-colors">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-700 truncate max-w-[200px] md:max-w-md">{f.file.name}</span>
                                                    <p className="text-[11px] font-bold text-slate-300 uppercase">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Settings (Always visible to match Image 1) */}
                    <div className="space-y-6">
                        <div className="bg-white p-10 rounded-2xl border border-slate-900 text-left space-y-10 min-h-[400px] flex flex-col shadow-sm">
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-slate-900">설정</h3>
                                <div className="h-px bg-slate-200 w-full" />
                            </div>

                            <div className="flex-grow space-y-8">
                                {selectedTool === 'jpg-to-pdf' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-sm font-black text-slate-700">페이지 크기</label>
                                            <select className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-red-400 transition-all appearance-none cursor-pointer" value={jpgOptions.pageSize} onChange={e => setJpgOptions({...jpgOptions, pageSize: e.target.value as any})}>
                                                <option value="Fit">원본 크기 (Fit)</option>
                                                <option value="A4">A4 (210x297mm)</option>
                                                <option value="Letter">Letter (8.5x11in)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-black text-slate-700">여백</label>
                                            <select className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-red-400 transition-all appearance-none cursor-pointer" value={jpgOptions.margin} onChange={e => setJpgOptions({...jpgOptions, margin: e.target.value as any})}>
                                                <option value="None">없음</option>
                                                <option value="Small">좁게</option>
                                                <option value="Big">넓게</option>
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-black text-slate-700">방향</label>
                                            <select className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-red-400 transition-all appearance-none cursor-pointer" value={jpgOptions.orientation} onChange={e => setJpgOptions({...jpgOptions, orientation: e.target.value as any})}>
                                                <option value="Auto">자동</option>
                                                <option value="Portrait">세로</option>
                                                <option value="Landscape">가로</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3 pt-4">
                                            <input type="checkbox" id="merge-legacy-ui" checked={jpgOptions.mergeImages} onChange={e => setJpgOptions({...jpgOptions, mergeImages: e.target.checked})} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                                            <label htmlFor="merge-legacy-ui" className="text-sm font-bold text-slate-700 cursor-pointer select-none">하나의 PDF로 병합</label>
                                        </div>
                                    </div>
                                )}

                                {selectedTool === 'pdf-to-jpg' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-sm font-black text-slate-700">이미지 품질 (해상도)</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button onClick={() => setPdfToJpgOptions(prev => ({...prev, quality: 'normal'}))} className={cn("py-4 rounded-xl text-xs font-black border transition-all", pdfToJpgOptions.quality === 'normal' ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}>일반(150dpi)</button>
                                                <button onClick={() => setPdfToJpgOptions(prev => ({...prev, quality: 'high'}))} className={cn("py-4 rounded-xl text-xs font-black border transition-all", pdfToJpgOptions.quality === 'high' ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}>고화질(300dpi)</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedTool === 'html-to-pdf' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-sm font-black text-slate-700">페이지 크기</label>
                                            <select className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-red-400 transition-all appearance-none cursor-pointer" value={htmlOptions.pageSize} onChange={e => setHtmlOptions({...htmlOptions, pageSize: e.target.value as any})}>
                                                <option value="A4">A4 (210x297mm)</option>
                                                <option value="Letter">Letter (8.5x11in)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-black text-slate-700">방향</label>
                                            <select className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-red-400 transition-all appearance-none cursor-pointer" value={htmlOptions.orientation} onChange={e => setHtmlOptions({...htmlOptions, orientation: e.target.value as any})}>
                                                <option value="Portrait">세로 (Portrait)</option>
                                                <option value="Landscape">가로 (Landscape)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {['word-to-pdf', 'excel-to-pdf', 'ppt-to-pdf'].includes(selectedTool || '') && (
                                    <div className="space-y-6">
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                            <h3 className="text-sm font-black text-slate-800 mb-2">변환 옵션</h3>
                                            <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                                {selectedTool === 'word-to-pdf' ? '빠른 스마트 변환 엔진이 적용됩니다.' : 
                                                 selectedTool === 'excel-to-pdf' ? '전체 시트 데이터가 고화질 PDF 리포트로 변환됩니다.' : 
                                                 '슬라이드 별로 고해상도 PDF 페이지를 생성합니다.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={runConversion}
                                disabled={selectedTool === 'html-to-pdf' ? !htmlUrl : files.length === 0}
                                className={cn(
                                    "w-full py-5 text-white rounded-lg font-black text-xl shadow-lg transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none",
                                    selectedTool === 'word-to-pdf' ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" :
                                    selectedTool === 'excel-to-pdf' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" :
                                    selectedTool === 'ppt-to-pdf' ? "bg-orange-600 hover:bg-orange-700 shadow-orange-100" :
                                    "bg-[#f87171] hover:bg-[#ef4444] shadow-red-100"
                                )}
                            >
                                PDF로 변환하기
                            </button>
                        </div>
                    </div>
                </div>
            ) : processing.status === 'processing' ? (
                <div className="p-24 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-slate-50 text-center">
                    <div className="relative mb-12">
                        <div className="w-32 h-32 border-4 border-red-50 rounded-full animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="w-12 h-12 text-red-500 animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">{processing.message}</h3>
                    <p className="text-slate-400 font-bold max-w-xs">{activeTool?.title} 엔진이 가동 중입니다. 잠시만 기다려주세요.</p>
                </div>
            ) : processing.status === 'completed' && result ? (
                <div className="p-24 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-emerald-100 text-center animate-in">
                    <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-10">
                        <CheckCircle2 size={64} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">{processing.message}</h3>
                    <p className="text-slate-500 font-bold mb-12">사장님, 완벽하게 변환된 결과물이 준비되었습니다!</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <button 
                            onClick={() => {
                                const url = URL.createObjectURL(result.file);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = result.filename;
                                a.click();
                            }}
                            className="flex-grow py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all"
                        >
                            <Download size={20} /> 다운로드 받기
                        </button>
                        <button onClick={reset} className="px-10 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-lg transition-all">
                            처음으로
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-24 flex flex-col items-center justify-center bg-red-50 rounded-[3rem] text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-red-500 mb-8 shadow-xl">
                        <X size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">앗, 오류가 발생했습니다</h3>
                    <p className="text-red-600 font-bold mb-10">{processing.message}</p>
                    <button onClick={() => setProcessing({ ...processing, status: 'idle' })} className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black shadow-xl">
                        다시 시도하기
                    </button>
                </div>
            )}
        </div>
    );
}
