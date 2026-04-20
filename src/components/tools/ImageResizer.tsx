"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Upload, X, Maximize2, StretchHorizontal,
    Download, RefreshCw, CheckCircle2,
    AlertCircle, Image as ImageIcon,
    Play, Monitor, Smartphone, Square
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ImageResizerProps {
    onClose?: () => void;
    initialFile?: File | null;
}

type ResizeMode = 'cover' | 'contain' | 'stretch';
type Format = 'image/png' | 'image/jpeg' | 'image/webp';
type Alignment = 'center' | 'top' | 'bottom' | 'left' | 'right';

const RATIO_PRESETS = [
    { id: '16:9', label: 'YouTube / Wide', ratio: 16 / 9, width: 1920, height: 1080, icon: Monitor },
    { id: '9:16', label: 'TikTok / Reels', ratio: 9 / 16, width: 1080, height: 1920, icon: Smartphone },
    { id: '1:1', label: 'Instagram / Square', ratio: 1, width: 1080, height: 1080, icon: Square },
];

const ImageResizer: React.FC<ImageResizerProps> = ({ onClose, initialFile }) => {
    const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
    const [originalInfo, setOriginalInfo] = useState({ width: 0, height: 0, size: 0, name: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [mode, setMode] = useState<ResizeMode>('cover');
    const [targetSize, setTargetSize] = useState({ width: 1920, height: 1080 });
    const [isRatioLocked, setIsRatioLocked] = useState(true);
    const [currentRatio, setCurrentRatio] = useState(16 / 9);
    const [resizeTab, setResizeTab] = useState<'pixels' | 'percentage'>('pixels');
    const [percentage, setPercentage] = useState(100);
    const [dontEnlarge, setDontEnlarge] = useState(false);
    const [format, setFormat] = useState<Format>('image/jpeg');
    const [quality] = useState(0.9);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [alignment] = useState<Alignment>('center');
    const [zoom, setZoom] = useState(1.0);
    const [offsetPercent, setOffsetPercent] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        return () => {
            if (resultImage) URL.revokeObjectURL(resultImage);
        };
    }, [resultImage]);

    const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ msg, type });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | File) => {
        const file = e instanceof File ? e : e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            showToast('파일 크기가 너무 큽니다 (최대 50MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setSourceImage(img);
                setOriginalInfo({
                    width: img.width,
                    height: img.height,
                    size: file.size,
                    name: file.name,
                });
                setTargetSize({ width: img.width, height: img.height });
                setCurrentRatio(img.width / img.height);
                showToast('이미지가 업로드되었습니다.');
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        }
    };

    useEffect(() => {
        if (initialFile && !sourceImage) {
            handleFileUpload(initialFile);
        }
    }, [initialFile, sourceImage]);

    const handleWidthChange = (w: number) => {
        const newW = Math.max(1, w);
        if (isRatioLocked) {
            setTargetSize({ width: newW, height: Math.round(newW / currentRatio) });
        } else {
            setTargetSize(prev => ({ ...prev, width: newW }));
            if (targetSize.height > 0) setCurrentRatio(newW / targetSize.height);
        }
    };

    const handleHeightChange = (h: number) => {
        const newH = Math.max(1, h);
        if (isRatioLocked) {
            setTargetSize({ width: Math.round(newH * currentRatio), height: newH });
        } else {
            setTargetSize(prev => ({ ...prev, height: newH }));
            if (targetSize.width > 0) setCurrentRatio(targetSize.width / newH);
        }
    };

    const handlePercentageChange = (p: number) => {
        setPercentage(p);
        const scale = (100 - p) / 100;
        const newW = Math.round(originalInfo.width * scale);
        const newH = Math.round(originalInfo.height * scale);
        setTargetSize({ width: newW, height: newH });
        if (newH > 0) setCurrentRatio(newW / newH);
    };

    const drawImageBase = useCallback((ctx: CanvasRenderingContext2D, targetW: number, targetH: number) => {
        if (!sourceImage) return;

        const iw = sourceImage.width;
        const ih = sourceImage.height;

        ctx.save();
        ctx.clearRect(0, 0, targetW, targetH);

        if (format === 'image/jpeg' || (mode === 'contain' && bgColor !== 'transparent')) {
            ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
            ctx.fillRect(0, 0, targetW, targetH);
        }

        let dx = 0, dy = 0, dw = targetW, dh = targetH;

        if (mode === 'cover') {
            const scale = Math.max(targetW / iw, targetH / ih) * zoom;
            dw = iw * scale;
            dh = ih * scale;
            dx = (targetW - dw) / 2 + offsetPercent.x * dw;
            dy = (targetH - dh) / 2 + offsetPercent.y * dh;
        } else if (mode === 'contain') {
            const scale = Math.min(targetW / iw, targetH / ih);
            dw = iw * scale;
            dh = ih * scale;
            if (alignment === 'center') { dx = (targetW - dw) / 2; dy = (targetH - dh) / 2; }
            else if (alignment === 'top') { dx = (targetW - dw) / 2; dy = 0; }
            else if (alignment === 'bottom') { dx = (targetW - dw) / 2; dy = targetH - dh; }
            else if (alignment === 'left') { dx = 0; dy = (targetH - dh) / 2; }
            else if (alignment === 'right') { dx = targetW - dw; dy = (targetH - dh) / 2; }
        } else if (mode === 'stretch') {
             dx = 0; dy = 0; dw = targetW; dh = targetH;
        }

        ctx.drawImage(sourceImage, dx, dy, dw, dh);
        ctx.restore();
    }, [sourceImage, mode, zoom, offsetPercent, bgColor, alignment, format]);

    useEffect(() => {
        const canvas = previewCanvasRef.current;
        if (canvas && sourceImage && originalInfo.width > 0) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const viewportW = 800;
                const viewportH = 500;
                const originalRatio = originalInfo.width / originalInfo.height;
                let refW = viewportW;
                let refH = viewportW / originalRatio;
                if (refH > viewportH) {
                    refH = viewportH;
                    refW = viewportH * originalRatio;
                }
                const targetRatio = targetSize.width / targetSize.height;
                const scaleW = targetSize.width / originalInfo.width;
                const displayW = refW * scaleW;
                const displayH = displayW / targetRatio;

                canvas.width = displayW;
                canvas.height = displayH;
                
                ctx.save();
                ctx.scale(displayW / targetSize.width, displayH / targetSize.height);
                drawImageBase(ctx, targetSize.width, targetSize.height);
                ctx.restore();
            }
        }
    }, [sourceImage, targetSize, drawImageBase, originalInfo]);

    const handleConvert = async () => {
        if (!sourceImage) return;
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 600));

        try {
            if (resultImage) URL.revokeObjectURL(resultImage);
            const canvas = document.createElement('canvas');
            canvas.width = targetSize.width;
            canvas.height = targetSize.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                drawImageBase(ctx, targetSize.width, targetSize.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        setResultImage(url);
                        showToast('이미지 변환에 성공했습니다.');
                    } else {
                        showToast('변환 실패: Blob 생성 오류', 'error');
                    }
                    setIsProcessing(false);
                }, format, quality);
            }
        } catch (err) {
            console.error(err);
            showToast('변환 중 치명적 오류가 발생했습니다.', 'error');
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!resultImage) return;
        const link = document.createElement('a');
        const timestamp = `${targetSize.width}x${targetSize.height}`;
        link.href = resultImage;
        link.download = `${originalInfo.name.split('.')[0] || 'Image'}_${timestamp}.${format.split('/')[1]}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('다운로드를 시작합니다.');
    };

    const applyPreset = (p: typeof RATIO_PRESETS[0]) => {
        setCurrentRatio(p.ratio);
        setTargetSize({ width: p.width, height: p.height });
        setIsRatioLocked(true);
        showToast(`${p.id} 프리셋 적용`);
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (mode !== 'cover' || resultImage) return;
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        setDragStart({ x: clientX, y: clientY });
    };

    const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !sourceImage) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const dx = clientX - dragStart.x;
        const dy = clientY - dragStart.y;
        const canvas = previewCanvasRef.current;
        if (canvas) {
            const pixelRatio = targetSize.width / canvas.width;
            const scale = Math.max(targetSize.width / sourceImage.width, targetSize.height / sourceImage.height) * zoom;
            const dw = sourceImage.width * scale;
            const dh = sourceImage.height * scale;
            setOffsetPercent(prev => ({
                x: prev.x + (dx * pixelRatio) / dw,
                y: prev.y + (dy * pixelRatio) / dh,
            }));
        }
        setDragStart({ x: clientX, y: clientY });
    };

    const handleDragEnd = () => setIsDragging(false);

    return (
        <div className="w-full flex flex-col border-t border-slate-100 bg-white">
            {/* Internal Header */}
            <div className="text-center space-y-4 py-20 bg-slate-50/30 border-b border-slate-100 animate-in fade-in slide-in-from-top-4 duration-1000">
               <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase">이미지 리사이징</h1>
               <p className="text-lg font-bold text-slate-400">사진 크기 조정을 고화질 그대로, 클릭 한 번으로 끝내세요.</p>
            </div>
            
            <div className="flex flex-col md:flex-row min-h-[600px]">
            <main className="flex-grow flex items-center justify-center p-8 bg-slate-50/50 relative overflow-hidden">
                {!sourceImage ? (
                    <div 
                        onClick={() => document.getElementById('resizer-file-input')?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="w-full max-w-2xl aspect-video border-4 border-dashed border-blue-100 rounded-[2.5rem] bg-white flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group"
                    >
                        <div className="p-8 bg-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                            <Upload size={56} />
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-slate-800 mb-2">이미지 리사이징 시작</p>
                            <p className="text-slate-400 font-bold">이미지를 여기에 드롭하거나 클릭하여 선택하세요</p>
                        </div>
                        <input type="file" id="resizer-file-input" hidden onChange={handleFileUpload} accept="image/*" />
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center group select-none animate-in">
                        <div className="max-w-full bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 relative">
                            <canvas
                                ref={previewCanvasRef}
                                onMouseDown={handleDragStart}
                                onMouseMove={handleDrag}
                                onMouseUp={handleDragEnd}
                                onMouseLeave={handleDragEnd}
                                onTouchStart={handleDragStart}
                                onTouchMove={handleDrag}
                                onTouchEnd={handleDragEnd}
                                className={cn(
                                    "max-w-full max-h-[60vh] rounded-lg shadow-sm bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50",
                                    mode === 'cover' && !resultImage && "cursor-move"
                                )}
                            />
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 flex items-center gap-3 shadow-xl">
                                <span className="text-[12px] font-black text-slate-400">{originalInfo.width}x{originalInfo.height}</span>
                                <Play size={10} className="fill-slate-300 text-slate-300" />
                                <span className="text-[12px] font-black text-blue-600">{targetSize.width}x{targetSize.height}</span>
                            </div>
                            <button onClick={() => setSourceImage(null)} className="absolute -top-4 -right-4 bg-slate-900 text-white p-2.5 rounded-full shadow-2xl hover:bg-red-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="absolute left-10 bottom-10 flex flex-col gap-3">
                              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white flex flex-col gap-2">
                                 <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">줌 레벨 (Live Zoom)</label>
                                 <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-40 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                             </div>
                        </div>
                    </div>
                )}
            </main>

            <aside className="w-full md:w-[450px] bg-white border-l border-slate-100 flex flex-col shrink-0">
                <div className="p-10 space-y-10 flex-grow">
                    <div className="flex border-2 border-slate-50 rounded-2xl overflow-hidden p-1 bg-slate-50">
                        <button onClick={() => setResizeTab('pixels')} className={cn("flex-1 py-4 flex flex-col items-center gap-2 transition-all rounded-xl", resizeTab === 'pixels' ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600")}>
                            <Maximize2 size={24} />
                            <span className="text-[12px] font-black">픽셀 (Pixels)</span>
                        </button>
                        <button onClick={() => setResizeTab('percentage')} className={cn("flex-1 py-4 flex flex-col items-center gap-2 transition-all rounded-xl", resizeTab === 'percentage' ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600")}>
                            <StretchHorizontal size={24} />
                            <span className="text-[12px] font-black">비율 (Scale)</span>
                        </button>
                    </div>

                    {resizeTab === 'pixels' ? (
                        <div className="space-y-8 animate-in">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-400 uppercase ml-1">Width (px)</label>
                                    <input type="number" value={targetSize.width} onChange={(e) => handleWidthChange(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-900 focus:ring-2 focus:ring-blue-500/10 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-400 uppercase ml-1">Height (px)</label>
                                    <input type="number" value={targetSize.height} onChange={(e) => handleHeightChange(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-900 focus:ring-2 focus:ring-blue-500/10 outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {RATIO_PRESETS.map(p => (
                                    <button key={p.id} onClick={() => applyPreset(p)} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-50 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                                        <p.icon size={20} className="text-slate-300 group-hover:text-blue-500" />
                                        <span className="text-[12px] font-black text-slate-400 group-hover:text-blue-600">{p.id}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="space-y-4 pt-4">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <input type="checkbox" checked={isRatioLocked} onChange={() => setIsRatioLocked(!isRatioLocked)} className="w-6 h-6 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                    <span className="text-sm font-bold text-slate-600">가로 세로 비율 강제 유지</span>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in">
                            <div className="grid grid-cols-1 gap-4">
                                {[25, 50, 75].map(p => (
                                    <button key={p} onClick={() => handlePercentageChange(p)} className={cn("w-full py-5 px-8 rounded-2xl border-2 flex items-center justify-between font-black transition-all", percentage === p ? "border-blue-600 bg-blue-50 text-blue-600 shadow-xl shadow-blue-900/5" : "border-slate-50 hover:border-blue-100 text-slate-400")}>
                                        <span className="text-lg">원본 대비 -{p}% 스케일</span>
                                        <div className={cn("w-6 h-6 rounded-full border-4 flex items-center justify-center", percentage === p ? "border-blue-600 bg-blue-600" : "border-slate-100")}>
                                            {percentage === p && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-10 border-t border-slate-100 space-y-8">
                         <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-3">
                                 <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">저장 포맷 (Format)</label>
                                 <select value={format} onChange={(e) => setFormat(e.target.value as Format)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/10 outline-none">
                                     <option value="image/jpeg">JPEG (고압축)</option>
                                     <option value="image/png">PNG (무손실)</option>
                                     <option value="image/webp" className="text-[12px]">WEBP (웹 최적화)</option>
                                 </select>
                             </div>
                             <div className="space-y-3">
                                 <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">배경색 (Background)</label>
                                 <div className="flex items-center gap-3">
                                     <input type="color" value={bgColor === 'transparent' ? '#ffffff' : bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 overflow-hidden" disabled={bgColor === 'transparent'} />
                                     <button onClick={() => setBgColor(bgColor === 'transparent' ? '#ffffff' : 'transparent')} className={cn("flex-grow py-3 rounded-xl border text-xs font-black transition-all", bgColor === 'transparent' ? "border-blue-600 bg-blue-600 text-white" : "border-slate-100 text-slate-400")}>
                                         배경 투명
                                     </button>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="p-10 border-t border-slate-100 bg-slate-50/30">
                    <button 
                        onClick={handleConvert}
                        disabled={!sourceImage || isProcessing}
                        className={cn("w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] group", !sourceImage ? "bg-slate-200 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-slate-900 shadow-blue-900/10")}
                    >
                        {isProcessing ? <RefreshCw className="animate-spin" size={28} /> : (
                            <>
                                <span>지금 변환하기</span>
                                <Play size={20} fill="currentColor" />
                            </>
                        )}
                    </button>
                    {resultImage && (
                        <button onClick={handleDownload} className="w-full mt-6 py-5 rounded-2xl border-2 border-emerald-500 text-emerald-600 font-black flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-900/5">
                            <Download size={24} /> 무료 다운로드 받기
                        </button>
                    )}
                </div>
            </aside>
            {toast && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-10 py-5 rounded-3xl shadow-2xl bg-slate-900 text-white text-[12px] font-black flex items-center gap-4 z-[100] animate-in slide-in-from-bottom-8">
                    {toast.type === 'success' ? <CheckCircle2 size={24} className="text-emerald-400" /> : <AlertCircle size={24} className="text-rose-400" />}
                    {toast.msg}
                </div>
            )}
            </div>
        </div>
    );
};

export default ImageResizer;
