import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Upload, X, Maximize2, StretchHorizontal,
    Download, RefreshCw, CheckCircle2,
    AlertCircle, Image as ImageIcon,
    Play, Monitor, Smartphone, Square
} from 'lucide-react';
import { cn } from '../../utils/cn';

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
    // Image State
    const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
    const [originalInfo, setOriginalInfo] = useState({ width: 0, height: 0, size: 0, name: '' });

    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Settings State
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

    // Interaction State
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Memory Management: Cleanup Blob URL
    useEffect(() => {
        return () => {
            if (resultImage) {
                URL.revokeObjectURL(resultImage);
            }
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

    useEffect(() => {
        if (initialFile && !sourceImage) {
            handleFileUpload(initialFile);
        }
    }, [initialFile]);

    // Handle Dimension Changes
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

        // Background Fill
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

    // Real-time Preview Engine
    useEffect(() => {
        const canvas = previewCanvasRef.current;
        if (canvas && sourceImage && originalInfo.width > 0) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Viewport dimensions
                const viewportW = 800;
                const viewportH = 500;
                
                // Original image scale reference
                const originalRatio = originalInfo.width / originalInfo.height;
                let refW = viewportW;
                let refH = viewportW / originalRatio;
                if (refH > viewportH) {
                    refH = viewportH;
                    refW = viewportH * originalRatio;
                }

                // Current target aspect ratio
                const targetRatio = targetSize.width / targetSize.height;

                // Scale based on width relative to original
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

    // Interaction Logic (Restored)
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
        <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
            {/* Minimal Header */}
            <header className="h-16 px-6 border-b flex items-center justify-between shrink-0 bg-white z-20">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={onClose}>
                        <div className="text-blue-600 font-black text-2xl flex items-center gap-2">
                             <ImageIcon size={28} className="fill-blue-600" />
                             <span>이미지 변환</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="닫기">
                        <X size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-[#f0f2f5]">
                {/* Main Content (Preview) */}
                <main className="flex-grow relative flex flex-col overflow-hidden">
                    <div className="flex-grow flex items-center justify-center p-8 overflow-hidden">
                        {!sourceImage ? (
                            <div 
                                onClick={() => document.getElementById('file-input')?.click()}
                                className="w-full max-w-2xl aspect-video border-2 border-dashed border-blue-200 rounded-3xl bg-white flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-400 transition-all group"
                            >
                                <div className="p-6 bg-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                                    <Upload size={48} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-900">이미지 선택</p>
                                    <p className="text-gray-500">또는 이미지를 여기에 드롭하세요</p>
                                </div>
                                <input type="file" id="file-input" hidden onChange={handleFileUpload} accept="image/*" />
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center group select-none">
                                <div className="max-w-full max-h-full bg-white p-4 rounded-xl shadow-xl border border-gray-100 relative">
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
                                            "max-w-full max-h-[70vh] rounded shadow-sm bg-checkered",
                                            mode === 'cover' && !resultImage && "cursor-move"
                                        )}
                                    />
                                    {/* Image Label Overlay */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-100/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 flex items-center gap-2 shadow-sm">
                                        <span className="text-[10px] font-bold text-gray-400">{originalInfo.width} x {originalInfo.height}</span>
                                        <Play size={8} className="text-gray-400" />
                                        <span className="text-[10px] font-bold text-blue-600">{targetSize.width} x {targetSize.height}</span>
                                    </div>
                                    <button 
                                        onClick={() => setSourceImage(null)}
                                        className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                
                                <div className="absolute left-8 bottom-8 flex flex-col gap-2">
                                     <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white flex flex-col gap-1">
                                         <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Zoom</label>
                                         <input 
                                             type="range" 
                                             min="0.5" 
                                             max="3" 
                                             step="0.1" 
                                             value={zoom} 
                                             onChange={(e) => setZoom(Number(e.target.value))} 
                                             className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                                         />
                                     </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Sidebar (Options) */}
                <aside className="w-full md:w-[400px] bg-white border-l flex flex-col shrink-0 overflow-y-auto no-scrollbar shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
                    <div className="p-8 space-y-8 flex-grow">
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-bold text-gray-800">크기 조절 옵션</h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex border rounded-xl overflow-hidden shadow-sm">
                            <button 
                                onClick={() => setResizeTab('pixels')}
                                className={cn(
                                    "flex-1 py-6 flex flex-col items-center gap-2 transition-all relative",
                                    resizeTab === 'pixels' ? "bg-white text-blue-600" : "bg-gray-50 text-gray-400 border-r"
                                )}
                            >
                                <Maximize2 size={24} className={resizeTab === 'pixels' ? "text-blue-600" : "text-gray-300"} />
                                <span className="text-xs font-bold">픽셀별</span>
                                {resizeTab === 'pixels' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />}
                            </button>
                            <button 
                                onClick={() => setResizeTab('percentage')}
                                className={cn(
                                    "flex-1 py-6 flex flex-col items-center gap-2 transition-all",
                                    resizeTab === 'percentage' ? "bg-white text-blue-600" : "bg-gray-50 text-gray-400"
                                )}
                            >
                                <StretchHorizontal size={24} className={resizeTab === 'percentage' ? "text-blue-600" : "text-gray-300"} />
                                <span className="text-xs font-bold">퍼센트별</span>
                            </button>
                        </div>

                        {resizeTab === 'pixels' ? (
                            <div className="space-y-6 animate-in">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">이미지를 <span className="text-gray-900">정확한 크기</span>로</p>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-white border rounded-xl p-4 focus-within:border-blue-500 transition-colors group">
                                        <label className="text-sm font-bold text-gray-700">너비 (px):</label>
                                        <input 
                                            type="number" 
                                            value={targetSize.width}
                                            onChange={(e) => handleWidthChange(Number(e.target.value))}
                                            className="w-24 text-right font-bold text-gray-900 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-white border rounded-xl p-4 focus-within:border-blue-500 transition-colors group">
                                        <label className="text-sm font-bold text-gray-700">높이 (px):</label>
                                        <input 
                                            type="number" 
                                            value={targetSize.height}
                                            onChange={(e) => handleHeightChange(Number(e.target.value))}
                                            className="w-24 text-right font-bold text-gray-900 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {RATIO_PRESETS.map(p => (
                                        <button 
                                            key={p.id} 
                                            onClick={() => applyPreset(p)} 
                                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                                        >
                                            <p.icon size={18} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-500">{p.id}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={isRatioLocked} 
                                            onChange={() => setIsRatioLocked(!isRatioLocked)}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">가로 세로 비율 유지</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={dontEnlarge}
                                            onChange={() => setDontEnlarge(!dontEnlarge)}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">더 작을 경우 확대 안함</span>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">이미지를 <span className="text-gray-900">퍼센트</span>로 줄이기</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {[25, 50, 75].map(p => (
                                        <button 
                                            key={p}
                                            onClick={() => handlePercentageChange(p)}
                                            className={cn(
                                                "w-full py-4 px-6 rounded-xl border-2 flex items-center justify-between font-bold transition-all",
                                                percentage === p ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 hover:border-blue-200 text-gray-500"
                                            )}
                                        >
                                            <span>-{p}% 작게</span>
                                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", percentage === p ? "border-blue-600 bg-blue-600" : "border-gray-200")}>
                                                {percentage === p && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t space-y-6">
                             <div className="space-y-4">
                                 <label className="text-sm font-bold text-gray-500 uppercase tracking-tight block">고급 설정</label>
                                 <div className="grid grid-cols-3 gap-2">
                                     {(['cover', 'contain', 'stretch'] as ResizeMode[]).map(m => (
                                         <button 
                                            key={m} 
                                            onClick={() => setMode(m)} 
                                            className={cn(
                                                "py-2 px-1 rounded-lg border text-[10px] font-bold transition-all capitalize", 
                                                mode === m ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400 hover:bg-gray-50"
                                            )}
                                         >
                                             {m}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <div className="flex-1 space-y-2">
                                     <label className="text-[10px] font-bold text-gray-400 uppercase">포맷</label>
                                     <select 
                                        value={format} 
                                        onChange={(e) => setFormat(e.target.value as Format)} 
                                        className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:outline-none"
                                     >
                                         <option value="image/jpeg">JPEG</option>
                                         <option value="image/png">PNG</option>
                                         <option value="image/webp">WEBP</option>
                                     </select>
                                 </div>
                                 <div className="flex-1 space-y-2">
                                     <label className="text-[10px] font-bold text-gray-400 uppercase">배경색</label>
                                     <div className="flex items-center gap-2">
                                         <input 
                                            type="color" 
                                            value={bgColor === 'transparent' ? '#ffffff' : bgColor} 
                                            onChange={(e) => setBgColor(e.target.value)} 
                                            className="w-8 h-8 rounded shrink-0 cursor-pointer overflow-hidden border-none p-0" 
                                            disabled={bgColor === 'transparent'} 
                                         />
                                         <button 
                                            onClick={() => setBgColor(bgColor === 'transparent' ? '#ffffff' : 'transparent')} 
                                            className={cn(
                                                "p-1.5 rounded-lg border text-[10px] font-bold transition-all", 
                                                bgColor === 'transparent' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400"
                                            )}
                                         >
                                             투명
                                         </button>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="p-8 border-t bg-gray-50/50">
                        <button 
                            onClick={handleConvert}
                            disabled={!sourceImage || isProcessing}
                            className={cn(
                                "w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] group",
                                !sourceImage ? "bg-gray-300 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                            )}
                        >
                            {isProcessing ? <RefreshCw className="animate-spin" size={24} /> : (
                                <>
                                    <span>변환 및 처리하기</span>
                                    <Play size={18} fill="currentColor" className="ml-2" />
                                </>
                            )}
                        </button>
                        {resultImage && (
                            <button 
                                onClick={handleDownload}
                                className="w-full mt-4 py-4 rounded-xl border-2 border-emerald-500 text-emerald-600 font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
                            >
                                <Download size={20} /> 결과 다운로드
                            </button>
                        )}
                    </div>
                </aside>
            </div>

            {/* Global Toast */}
            {toast && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl bg-slate-800 text-white text-sm font-bold flex items-center gap-3 z-[100] animate-in slide-in-from-bottom-5">
                    {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-red-400" />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default ImageResizer;
