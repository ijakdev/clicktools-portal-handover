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
  Loader2
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

export default function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [outputFormat, setOutputFormat] = useState('original');
  const [fileNamePrefix, setFileNamePrefix] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [debouncedQuality, setDebouncedQuality] = useState(0.8);
  const [debouncedMaxWidth, setDebouncedMaxWidth] = useState(1920);
  const [debouncedFormat, setDebouncedFormat] = useState('original');

  // 설정값 디바운스 (슬라이더를 막 움직일 때 렉 걸리는 현상 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuality(quality);
      setDebouncedMaxWidth(maxWidth);
      setDebouncedFormat(outputFormat);
    }, 400);
    return () => clearTimeout(timer);
  }, [quality, maxWidth, outputFormat]);

  // 설정값이 최종적으로 바뀌면 모든 이미지를 다시 압축 대기(idle) 상태로 변경
  useEffect(() => {
    setImages(prev => prev.map(img => ({ ...img, status: 'idle', progress: 0 })));
  }, [debouncedQuality, debouncedMaxWidth, debouncedFormat]);

  // idle 상태의 이미지가 보이면 즉시 압축 시작
  useEffect(() => {
    const idleImages = images.filter(img => img.status === 'idle');
    if (idleImages.length > 0) {
      idleImages.forEach(img => {
        compressImage(img, debouncedQuality, debouncedMaxWidth, debouncedFormat);
      });
    }
  }, [images, debouncedQuality, debouncedMaxWidth, debouncedFormat]);

  // 파일 추가 핸들러
  const onDrop = useCallback((e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = 'dataTransfer' in e ? e.dataTransfer.files : e.target.files;
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

  // 이미지 삭제
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

  // 이미지 압축 엔진
  const compressImage = async (image: ImageFile, q: number, maxW: number, format: string) => {
    // 극단적인 압축을 위해 목표 용량 계산을 더욱 날카롭게 조정 (0.01 = 10KB 수준까지)
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
      
      // 확장자 교체 구하기
      const fileType = format === 'original' ? image.file.type : format;
      const newExt = fileType === 'image/jpeg' ? '.jpg' : fileType === 'image/png' ? '.png' : fileType === 'image/webp' ? '.webp' : '';
      let baseName = image.file.name;
      if (newExt) {
          baseName = baseName.replace(/\.[^/.]+$/, "") + newExt;
      }

      let compressedFile = new File([compressedBlob], baseName, { type: fileType });
      
      // 만약 압축 후 용량이 원본보다 오히려 커졌다면(이미 최적화된 작은 이미지인 경우), 원본을 그대로 유지
      // 단, 사용자가 명시적으로 포맷 변환(예: webp->jpg)을 요청했다면 용량 증가를 감수하고 변환본을 반환
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
    } catch (error) {
      console.error(error);
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, status: 'error', progress: 0 } : img
      ));
    }
  };

  // 일괄 강제 재압축 (필요시)
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

  // 전체 다운로드 (ZIP)
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

  // 전체 개별 다운로드
  const downloadAllIndividually = () => {
    images.forEach((img, index) => {
      if (img.status === 'done' && img.compressedPreview && img.compressedFile) {
        // 브라우저 랙을 방지하기 위해 아주 약간의 시간차를 두고 다운로드 시작
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
    <div className="min-h-screen p-6 md:p-12 animate-in">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-6 h-6 fill-primary" />
              <span className="font-bold tracking-tight uppercase text-sm">ImageCompress Pro</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">
              고성능 이미지 압축
            </h1>
            <p className="text-slate-400 font-medium">
              품질 저하 없이 용량을 마법처럼 줄여보세요. 인스타그램, 블로그 업로드용 최적화.
            </p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls & Upload Area */}
          <div className={cn("lg:col-span-4 space-y-6")}>
            <section className={cn("glass-card p-6 rounded-2xl space-y-6")}>
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Settings2 className="w-5 h-5 text-secondary" />
                <h2 className="font-bold text-lg">설정</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <label className="text-slate-300">압축 품질</label>
                    <span className="text-primary">{Math.round(quality * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.01" max="1" step="0.01" 
                    value={quality} 
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">최대 너비 (px)</label>
                  <select 
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                    className="w-full p-3 bg-slate-800/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value={1080}>1080px (소셜 미디어용)</option>
                    <option value={1920}>1920px (표준 FHD)</option>
                    <option value={2560}>2560px (QHD)</option>
                    <option value={3840}>3840px (원본 품질)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">확장자 변경 (포맷 강제 교체)</label>
                  <select 
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full p-3 bg-slate-800/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="original">압축만 수행 (기존 확장자 유지)</option>
                    <option value="image/jpeg">모두 JPG (.jpg) 로 변환</option>
                    <option value="image/png">모두 PNG (.png) 로 변환</option>
                    <option value="image/webp">모두 WEBP (.webp) 로 변환</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">다운로드 파일 이름 앞에 자동 글자표기 (옵션)</label>
                  <input 
                    type="text" 
                    placeholder="예: 최적화완료_" 
                    value={fileNamePrefix}
                    onChange={(e) => setFileNamePrefix(e.target.value)}
                    className="w-full p-3 bg-slate-800/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={compressAll}
                  disabled={images.length === 0 || isProcessing}
                  className="w-full py-4 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  전체 강제 재압축
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={downloadAllIndividually}
                    disabled={!images.some(img => img.status === 'done')}
                    className="w-full py-4 bg-slate-200 text-slate-900 hover:bg-white disabled:opacity-30 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 leading-tight"
                  >
                    <Download className="w-5 h-5" />
                    <span>전체 개별로 저장</span>
                    <span className="text-[10px] font-medium opacity-60">(압축 안함)</span>
                  </button>
                  <button 
                    onClick={downloadAll}
                    disabled={!images.some(img => img.status === 'done')}
                    className="w-full py-4 bg-slate-800 border-2 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-30 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 leading-tight"
                  >
                    <Download className="w-5 h-5" />
                    <span>ZIP으로 묶기</span>
                    <span className="text-[10px] font-medium opacity-60">(폴더로 하나만)</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* List Area */}
          <div className="lg:col-span-8 space-y-4">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="relative group h-48 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-700/50 hover:border-primary/50 bg-slate-800/10 rounded-2xl transition-all overflow-hidden"
            >
              <input type="file" multiple accept="image/*" onChange={onDrop} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="p-4 rounded-full bg-slate-800 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">이미지를 여기에 드래그하세요</p>
                <p className="text-sm text-slate-500">또는 클릭하여 파일 선택</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="glass-card rounded-2xl overflow-hidden group animate-in">
                  <div className="aspect-video relative overflow-hidden bg-slate-900">
                    <img 
                      src={img.compressedPreview || img.preview} 
                      className="w-full h-full object-cover" 
                      alt="preview" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <button 
                        onClick={() => removeImage(img.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {img.status === 'compressing' && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                       <div className="flex-1 min-w-0">
                         <p className="font-bold text-sm truncate">{img.file.name}</p>
                         <p className="text-xs text-slate-500">{formatSize(img.originalSize)}</p>
                       </div>
                       {img.status === 'done' && (
                         <div className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded uppercase">
                           Done
                         </div>
                       )}
                    </div>

                    {img.status === 'done' && img.compressedSize && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">용량 절감</p>
                          <p className={cn("text-sm font-black", img.compressedSize >= img.originalSize ? "text-slate-400" : "text-green-400")}>
                            {img.compressedSize >= img.originalSize 
                              ? "최적화 완료 (원본 유지)" 
                              : `${Math.round(((img.originalSize - img.compressedSize) / img.originalSize) * 100)}% 감소`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">최종 용량</p>
                          <p className="text-sm font-black">{formatSize(img.compressedSize)}</p>
                        </div>
                      </div>
                    )}

                    {img.status === 'done' && img.compressedFile && (
                      <a 
                        href={img.compressedPreview} 
                        download={getFinalFileName(img.compressedFile.name, index)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-bold transition-all text-white group"
                      >
                        <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        단독 저장
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 grayscale opacity-30">
                <ImageIcon className="w-16 h-16 mb-4" />
                <p className="font-bold">리스트가 비어있습니다</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
