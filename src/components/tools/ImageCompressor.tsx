"use client";

import { useState, useCallback, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { 
  Upload, 
  Download, 
  Trash2, 
  Settings2, 
  Image as ImageIcon, 
  Zap,
  Loader2,
  Rocket,
  Plus,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  compressedFile?: File;
  compressedPreview?: string;
  originalSize: number;
  compressedSize?: number;
  status: 'idle' | 'compressing' | 'done' | 'error';
  progress: number;
}

export default function ImageCompressor() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [outputFormat, setOutputFormat] = useState('original');
  const [fileNamePrefix, setFileNamePrefix] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [debouncedQuality, setDebouncedQuality] = useState(0.8);
  const [debouncedMaxWidth, setDebouncedMaxWidth] = useState(1920);
  const [debouncedFormat, setDebouncedFormat] = useState('original');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuality(quality);
      setDebouncedMaxWidth(maxWidth);
      setDebouncedFormat(outputFormat);
    }, 400);
    return () => clearTimeout(timer);
  }, [quality, maxWidth, outputFormat]);

  useEffect(() => {
    setImages(prev => prev.map(img => ({ ...img, status: 'idle', progress: 0 })));
  }, [debouncedQuality, debouncedMaxWidth, debouncedFormat]);

  useEffect(() => {
    const idleImages = images.filter(img => img.status === 'idle');
    if (idleImages.length > 0) {
      idleImages.forEach(img => {
        compressImage(img, debouncedQuality, debouncedMaxWidth, debouncedFormat);
      });
    }
  }, [images, debouncedQuality, debouncedMaxWidth, debouncedFormat]);

  const onDrop = useCallback((e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = 'dataTransfer' in e ? e.dataTransfer.files : (e.target as HTMLInputElement).files;
    if (!files) return;

    const newImages: ImageFile[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        originalSize: file.size,
        status: 'idle',
        progress: 0
      }));

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const target = prev.find(img => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.preview);
        if (target.compressedPreview) URL.revokeObjectURL(target.compressedPreview);
      }
      return filtered;
    });
  };

  const compressImage = async (image: ImageFile, q: number, maxW: number, format: string) => {
    const targetMB = q >= 0.95 ? 20 : Math.max(0.01, q * q * 1.5);

    const options: any = {
      maxSizeMB: targetMB,
      maxWidthOrHeight: maxW,
      useWebWorker: true,
      initialQuality: q,
    };
    if (format !== 'original') {
      options.fileType = format;
    }

    setImages(prev => prev.map(img => 
      img.id === image.id ? { ...img, status: 'compressing', progress: 50 } : img
    ));

    try {
      let compressedBlob = await imageCompression(image.file, options);
      
      const fileType = format === 'original' ? image.file.type : format;
      const newExt = fileType === 'image/jpeg' ? '.jpg' : fileType === 'image/png' ? '.png' : fileType === 'image/webp' ? '.webp' : '';
      let baseName = image.file.name;
      if (newExt) {
          baseName = baseName.replace(/\.[^/.]+$/, "") + newExt;
      }

      let compressedFile = new File([compressedBlob], baseName, { type: fileType });
      
      if (format === 'original' && compressedFile.size >= image.file.size) {
        compressedBlob = image.file;
        compressedFile = image.file;
      }
      
      setImages(prev => prev.map(img => 
        img.id === image.id ? { 
          ...img, 
          compressedFile, 
          compressedPreview: URL.createObjectURL(compressedBlob),
          compressedSize: compressedFile.size,
          status: 'done',
          progress: 100 
        } : img
      ));
      await fetch('/api/stats', { method: 'POST', body: JSON.stringify({ field: 'pdfsCreated' }), headers: { 'Content-Type': 'application/json' } }).catch(() => {});
    } catch (error) {
      console.error(error);
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, status: 'error', progress: 0 } : img
      ));
    }
  };

  const compressAll = async () => {
    setIsProcessing(true);
    for (const img of images) {
      await compressImage(img, debouncedQuality, debouncedMaxWidth, debouncedFormat);
    }
    setIsProcessing(false);
  };

  const getFinalFileName = (originalName: string, index: number) => {
    if (!fileNamePrefix) return originalName;
    return `${fileNamePrefix}${originalName}`;
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    images.forEach((img, index) => {
      if (img.compressedFile) {
        zip.file(getFinalFileName(img.compressedFile.name, index), img.compressedFile);
      }
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'compressed_images.zip';
    link.click();
  };

  const downloadAllIndividually = () => {
    images.forEach((img, index) => {
      if (img.status === 'done' && img.compressedPreview && img.compressedFile) {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = img.compressedPreview!;
          link.download = getFinalFileName(img.compressedFile.name, index);
          link.click();
        }, index * 150);
      }
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="animate-in bg-transparent text-slate-900 min-h-[600px] pb-20">
      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* Internal Header */}
        <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
           <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase">이미지 압축 및 최적화</h1>
           <p className="text-lg font-bold text-slate-400">화질 저하 없이 용량만 90% 이상 줄여보세요.</p>
        </div>

        <main className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Controls Area - Left Column in XL, Full in mobile */}
          <div className="xl:col-span-4 space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
               {/* Accent decoration */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />

               <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Settings2 className="w-5 h-5" />
                 </div>
                 <h2 className="font-black text-xl tracking-tight">압축 설정</h2>
               </div>
              
              <div className="space-y-10">
                {/* Labeled Slider - Quality */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-full h-[2px] bg-slate-100 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">압축 품질 (Quality)</div>
                    </div>
                  </div>

                  <div className="relative pt-2">
                    <input 
                      type="range" 
                      min="0.01" max="1" step="0.01" 
                      value={quality} 
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-6 px-1">
                      <div className="text-center group cursor-pointer" onClick={() => setQuality(0.3)}>
                        <p className={cn("text-[11px] font-black mb-1 transition-colors", quality < 0.5 ? "text-blue-600" : "text-slate-400")}>용량 절약형</p>
                        <p className="text-[10px] font-bold text-slate-300">최대 압축</p>
                      </div>
                      <div className="text-center group cursor-pointer" onClick={() => setQuality(0.7)}>
                        <p className={cn("text-[11px] font-black mb-1 transition-colors", quality >= 0.5 && quality < 0.85 ? "text-blue-600" : "text-slate-400")}>표준 압축</p>
                        <p className="text-[10px] font-bold text-slate-300">균형 잡힘</p>
                      </div>
                      <div className="text-center group cursor-pointer" onClick={() => setQuality(0.95)}>
                        <p className={cn("text-[11px] font-black mb-1 transition-colors", quality >= 0.85 ? "text-blue-600" : "text-slate-400")}>고화질 유지</p>
                        <p className="text-[10px] font-bold text-slate-300">최상의 품질</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-[1000] text-slate-400 uppercase tracking-widest">최대 너비 (px)</label>
                  <select 
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer text-slate-700"
                  >
                    <option value={1080}>1080px (소셜 미디어용)</option>
                    <option value={1920}>1920px (표준 FHD)</option>
                    <option value={2560}>2560px (QHD)</option>
                    <option value={3840}>3840px (원본 품질)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-[1000] text-slate-400 uppercase tracking-widest">출력 포맷</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'original', label: '기존 유지' },
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/png', label: 'PNG' },
                      { id: 'image/webp', label: 'WebP' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setOutputFormat(f.id)}
                        className={cn(
                          "py-3 rounded-xl text-xs font-black transition-all border",
                          outputFormat === f.id 
                            ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]" 
                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-10 mt-10 border-t border-slate-50">
                <button 
                  onClick={compressAll}
                  disabled={images.length === 0 || isProcessing}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-white transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  <span className="group-hover:translate-x-1 transition-transform">강제 재압축 시작</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={downloadAllIndividually}
                    disabled={!images.some(img => img.status === 'done')}
                    className="w-full py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 rounded-2xl font-black transition-all flex flex-col items-center justify-center text-xs gap-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>개별 저장</span>
                  </button>
                  <button 
                    onClick={downloadAll}
                    disabled={!images.some(img => img.status === 'done')}
                    className="w-full py-4 bg-slate-900 border border-slate-900 text-white hover:bg-black disabled:opacity-30 rounded-2xl font-black transition-all flex flex-col items-center justify-center text-xs gap-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>ZIP 압축</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Target List Area - Right Column */}
          <div className="xl:col-span-8 space-y-8">
            {/* Redesigned Dropzone matching Boss Reference */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="relative group bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100 hover:border-blue-400 transition-all p-12 shadow-2xl overflow-hidden"
            >
              <input type="file" multiple accept="image/*" onChange={onDrop} className="absolute inset-0 opacity-0 cursor-pointer z-50" />
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                 {/* Rocket Icon from reference */}
                 <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center relative transition-transform group-hover:scale-110 group-hover:-translate-y-2 duration-500">
                    <Rocket className="w-12 h-12 text-rose-500 drop-shadow-lg" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-white">
                       <Plus size={16} strokeWidth={3} />
                    </div>
                 </div>
                 <div className="space-y-3">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">이미지를 업로드하거나 여기에 드래그하세요</h3>
                   <p className="text-slate-400 font-bold text-sm">PNG, JPG, WebP, GIF (최대 20MB)</p>
                   <div className="flex items-center justify-center gap-2 pt-2">
                      <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 border border-slate-100 uppercase">속도 최적화</span>
                      <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 border border-slate-100 uppercase">스튜디오 급 고품질</span>
                   </div>
                 </div>
              </div>
            </div>

            {/* Selected Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {images.map((img, index) => (
                <div key={img.id} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl transition-all hover:shadow-2xl group/card">
                  <div className="aspect-[16/10] relative bg-slate-50">
                    {img.compressedFile && (
                      <img src={img.compressedPreview || img.preview} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" alt="preview" />
                    )}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    <button onClick={() => removeImage(img.id)} className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-rose-500 hover:text-white text-slate-400 rounded-xl transition-all shadow-lg backdrop-blur-sm z-10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {img.status === 'compressing' && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Processing...</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{img.file.name}</p>
                          <p className="text-[11px] text-slate-400 font-black mt-0.5 uppercase tracking-tighter">Original: {formatSize(img.file.size)}</p>
                       </div>
                       {img.status === 'done' && (
                         <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                            <Zap size={18} fill="currentColor" />
                         </div>
                       )}
                    </div>

                    {img.status === 'done' && img.compressedSize && (
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="text-left">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Savings</p>
                          <p className="text-lg font-black text-blue-600">
                            {img.compressedSize >= img.originalSize ? "0%" : `-${Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100)}%`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Final Size</p>
                          <p className="text-lg font-[1000] text-slate-900">{formatSize(img.compressedSize)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {images.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-slate-200">
                <div className="relative">
                   <ImageIcon className="w-32 h-32 mb-4 opacity-5" />
                   <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-slate-100 opacity-20" />
                </div>
                <p className="font-black opacity-10 text-xl tracking-tighter">선택된 파일이 없습니다</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
