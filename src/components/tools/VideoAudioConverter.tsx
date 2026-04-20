"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
    Download, RefreshCw, X, CheckCircle2, 
    Settings2, Loader2, List, Music
} from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FileState {
    id: string;
    file: File;
    status: 'waiting' | 'processing' | 'completed' | 'error';
    progress: number;
    resultUrl?: string;
    downloadName?: string;
    duration?: string;
}

export default function VideoAudioConverter() {
    const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
    const [initialLoading, setInitialLoading] = useState(false);
    const [files, setFiles] = useState<FileState[]>([]);
    const [selectedFormat, setSelectedFormat] = useState('mp3');
    const [bitrate, setBitrate] = useState('128k');
    const [qualityIndex, setQualityIndex] = useState(1);
    
    const formats = [
        { id: 'mp3', label: 'mp3' },
        { id: 'wav', label: 'wav' },
        { id: 'm4r', label: 'iphone ringtone' },
        { id: 'm4a', label: 'm4a' },
        { id: 'flac', label: 'flac' },
        { id: 'ogg', label: 'ogg' }
    ];

    const bitrateMap = ['64k', '128k', '192k'];
    const qualityNames = ['절약형', '표준형', '고음질 (우수)'];
    const kbpsLabels = ['64 kbps', '128 kbps', '192 kbps'];

    const loadFfmpeg = async () => {
        if (ffmpeg) return;
        setInitialLoading(true);
        try {
            const ffmpegInstance = new FFmpeg();
            // jsDelivr is often more stable with CORS headers than unpkg
            const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';
            
            ffmpegInstance.on('log', ({ message }) => {
                console.log(`[FFmpeg] ${message}`);
            });

            await ffmpegInstance.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setFfmpeg(ffmpegInstance);
            toast.success('변환 엔진 준비 완료!');
        } catch (err) {
            console.error('FFmpeg Load Error:', err);
            toast.error('엔진 로드 실패. 브라우저 캐시를 삭제하거나 보안 설정을 확인해주세요.');
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        loadFfmpeg();
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getMetadataDuration = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            try {
                const url = URL.createObjectURL(file);
                const el = document.createElement('video');
                el.src = url;
                el.preload = 'metadata';
                el.onloadedmetadata = () => {
                    URL.revokeObjectURL(url);
                    const seconds = el.duration;
                    if (!seconds || isNaN(seconds)) resolve('--:--');
                    const m = Math.floor(seconds / 60);
                    const s = Math.floor(seconds % 60);
                    resolve(`${m}:${s.toString().padStart(2, '0')}`);
                };
                el.onerror = () => {
                    URL.revokeObjectURL(url);
                    // Browsers like Firefox can't handle FLV/MKV metadata, but FFmpeg can still convert it
                    resolve('--:--');
                };
            } catch (e) {
                resolve('--:--');
            }
        });
    };

    const handleFileSelection = async (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let selectedFiles: File[] = [];
        if ('files' in e.target && e.target.files) selectedFiles = Array.from(e.target.files);
        else if ('dataTransfer' in e && e.dataTransfer.files) selectedFiles = Array.from(e.dataTransfer.files);
        
        if (selectedFiles.length > 0) {
            // Include common video formats that might not have standard mime types in some browsers
            const validFiles = selectedFiles.filter(f => 
                f.type.startsWith('video/') || 
                f.type.startsWith('audio/') || 
                f.name.match(/\.(mp4|mov|avi|wmv|flv|asf|mkv|webm|ts|m3u8|mp3|wav|m4a|flac|ogg|m4r|aac)$/i)
            );
            
            const newFiles: FileState[] = await Promise.all(validFiles.map(async (f) => ({
                id: Math.random().toString(36).substr(2, 9),
                file: f,
                status: 'waiting',
                progress: 0,
                duration: await getMetadataDuration(f)
            })));

            if (newFiles.length === 0) {
                toast.error('지원되는 영상 또는 오디오 파일을 선택해주세요.');
                return;
            }

            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const processQueue = useCallback(async () => {
        if (!ffmpeg) return;
        
        const nextFile = files.find(f => f.status === 'waiting');
        if (!nextFile) return;

        setFiles(prev => prev.map(f => f.id === nextFile.id ? { ...f, status: 'processing', progress: 0 } : f));

        try {
            ffmpeg.on('progress', ({ progress }) => {
                setFiles(prev => prev.map(f => f.id === nextFile.id ? { ...f, progress: Math.max(1, Math.round(progress * 100)) } : f));
            });

            const fileName = nextFile.file.name;
            const inputExt = fileName.split('.').pop() || 'tmp';
            const inputName = `input_${nextFile.id}.${inputExt}`;
            const outputName = `output_${nextFile.id}.${selectedFormat}`;

            // Reset progress for new file
            setFiles(prev => prev.map(f => f.id === nextFile.id ? { ...f, progress: 1 } : f));

            await ffmpeg.writeFile(inputName, await fetchFile(nextFile.file));
            
            // Core Command: Extract Audio with selected bitrate
            // Added -strict experimental and better codec selection
            const execArgs = [
                '-i', inputName, 
                '-vn'
            ];

            // Specific handling for output formats
            if (selectedFormat === 'mp3') {
                execArgs.push('-b:a', bitrate, '-ar', '44100', '-acodec', 'libmp3lame');
            } else if (selectedFormat === 'wav') {
                execArgs.push('-acodec', 'pcm_s16le', '-ar', '44100');
            } else if (selectedFormat === 'm4r' || selectedFormat === 'm4a') {
                // Use -f ipod for M4R/M4A to ensure Apple compatibility
                execArgs.push('-acodec', 'aac', '-b:a', bitrate, '-f', 'ipod', '-strict', 'experimental');
            } else {
                execArgs.push('-b:a', bitrate);
            }

            execArgs.push('-y', outputName);

            await ffmpeg.exec(execArgs);

            const data = await ffmpeg.readFile(outputName);
            let mimeType = `audio/${selectedFormat}`;
            if (selectedFormat === 'm4r' || selectedFormat === 'm4a') mimeType = 'audio/mp4';
            
            const blob = new Blob([(data as any)], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            setFiles(prev => prev.map(f => f.id === nextFile.id ? { 
                ...f, 
                status: 'completed', 
                progress: 100, 
                resultUrl: url,
                downloadName: `${fileName.substring(0, fileName.lastIndexOf('.')) || fileName}.${selectedFormat}`
            } : f));

            toast.success(`${fileName} 변환 완료!`);
            await fetch('/api/stats', { 
                method: 'POST', 
                body: JSON.stringify({ field: 'filesConverted' }), 
                headers: { 'Content-Type': 'application/json' } 
            }).catch(() => {});
        } catch (err) {
            console.error('Conversion error for:', nextFile.file.name, err);
            setFiles(prev => prev.map(f => f.id === nextFile.id ? { ...f, status: 'error' } : f));
            toast.error(`${nextFile.file.name} 변환 중 오류가 발생했습니다.`);
        }
    }, [ffmpeg, files, selectedFormat, bitrate]);

    useEffect(() => {
        if (files.some(f => f.status === 'waiting') && !files.some(f => f.status === 'processing')) {
            processQueue();
        }
    }, [files, processQueue]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-12 animate-in font-sans">
            {/* Internal Header */}
            <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
               <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase">영상 오디오 변환기</h1>
               <p className="text-lg font-bold text-slate-400">모든 동영상에서 오디오만 고화질로 추출하세요.</p>
            </div>

            {/* Control Panel (Legacy Design) */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-10">
                {/* Format Tabs */}
                <div className="flex justify-center">
                    <div className="flex border border-[#d1d5db] rounded-lg overflow-hidden">
                        {formats.map((fmt) => (
                            <button
                                key={fmt.id}
                                onClick={() => setSelectedFormat(fmt.id)}
                                className={cn(
                                    "px-6 py-2.5 font-bold text-[15px] border-r border-[#d1d5db] last:border-r-0 transition-all",
                                    selectedFormat === fmt.id 
                                        ? "bg-[#374151] text-white" 
                                        : "bg-[#f3f4f6] text-[#4b5563] hover:bg-slate-200"
                                )}
                            >
                                {fmt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quality Slider Section */}
                <div className="space-y-6">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#e5e7eb]"></div>
                        </div>
                        <span className="relative bg-white px-4 text-sm text-[#4b5563]">추출 음질 (Quality)</span>
                    </div>

                    <div className="max-w-xl mx-auto px-10">
                        <div className="relative pt-1">
                            <input 
                                type="range" 
                                min="0" max="2" step="1" 
                                value={qualityIndex}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setQualityIndex(val);
                                    setBitrate(bitrateMap[val]);
                                }}
                                className="legacy-slider w-full"
                            />
                            <div className="flex justify-between mt-4">
                                {qualityNames.map((name, i) => (
                                    <div key={name} className="text-center">
                                        <div className="text-[14px] font-semibold text-[#4b5563]">{name}</div>
                                        <div className="text-[13px] text-[#6b7280]">{kbpsLabels[i]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dropzone (Legacy Rocket Design) */}
            <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileSelection}
                onClick={() => document.getElementById('legacy-upload')?.click()}
                className="bg-white border-[3px] border-dashed border-[#EDF2F4] rounded-2xl p-16 text-center cursor-pointer hover:border-[#4361EE] hover:bg-[#F8F9FD] transition-all group shadow-sm flex flex-col items-center gap-4"
            >
                <input id="legacy-upload" type="file" accept="video/*,audio/*" multiple hidden onChange={handleFileSelection} />
                <div className="text-5xl mb-2">🚀</div>
                <div className="space-y-3">
                    <p className="text-[18px] font-bold text-[#2B2D42]">변환할 파일을 드래그하거나 클릭하세요</p>
                    <p className="text-[14px] text-[#ADB5BD]">
                        현재 설정: {selectedFormat.toUpperCase()} ({qualityNames[qualityIndex]} {bitrateMap[qualityIndex]}bps)
                    </p>
                    <p className="text-[14px] text-[#ADB5BD]">
                        (MP4, MOV, AVI, WMV, FLV, M4R, ASF 등 모든 영상 지원)
                    </p>
                </div>
            </div>

            {/* Result Panel (Legacy Table) */}
            {files.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-end gap-3 mb-6">
                        <button onClick={() => setFiles([])} className="px-4 py-2 bg-[#f1f3f5] text-[#2B2D42] rounded-lg text-sm font-semibold hover:bg-[#e9ecef] transition-all">
                            🧹 목록 초기화
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-[#EDF2F4]">
                                    <th className="px-4 py-4 text-sm font-semibold text-[#8D99AE]">파일명</th>
                                    <th className="px-4 py-4 text-sm font-semibold text-[#8D99AE]">확장자</th>
                                    <th className="px-4 py-4 text-sm font-semibold text-[#8D99AE]">크기</th>
                                    <th className="px-4 py-4 text-sm font-semibold text-[#8D99AE]">재생시간</th>
                                    <th className="px-4 py-4 text-sm font-semibold text-[#8D99AE]">변환 상태</th>
                                    <th className="px-4 py-4 text-sm font-semibold text-[#8D99AE]">다운로드</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EDF2F4]">
                                {files.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-5 font-semibold text-[#2B2D42] max-w-[200px] truncate">{item.file.name}</td>
                                        <td className="px-4 py-5 text-sm font-bold text-[#2B2D42]">{item.file.name.split('.').pop()?.toUpperCase()}</td>
                                        <td className="px-4 py-5 text-sm text-[#2B2D42]">{formatSize(item.file.size)}</td>
                                        <td className="px-4 py-5 text-sm text-[#2B2D42]">{item.duration}</td>
                                        <td className="px-4 py-5">
                                            {item.status === 'processing' ? (
                                                <div className="w-[150px]">
                                                    <div className="h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden mb-1.5">
                                                        <div className="h-full bg-[#4361EE] transition-all duration-300" style={{ width: `${item.progress}%` }} />
                                                    </div>
                                                    <span className="text-[12px] font-semibold text-[#8D99AE]">추출 중... {item.progress}%</span>
                                                </div>
                                            ) : item.status === 'completed' ? (
                                                <span className="text-[12px] font-bold text-[#2ECC71]">변환 완료!</span>
                                            ) : item.status === 'error' ? (
                                                <span className="text-[12px] font-bold text-[#E74C3C]">변환 실패</span>
                                            ) : (
                                                <span className="text-[12px] font-semibold text-[#8D99AE]">대기 중</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-5">
                                            {item.resultUrl ? (
                                                <a 
                                                    href={item.resultUrl} 
                                                    download={item.downloadName}
                                                    className="inline-block px-4 py-2 bg-[#4361EE] hover:bg-[#3A56D4] text-white rounded-lg text-xs font-bold transition-all"
                                                >
                                                    다운로드 📥
                                                </a>
                                            ) : (
                                                <span className="text-[#ADB5BD]">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {/* Loading Overlay */}
            {initialLoading && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Music className="w-10 h-10 text-[#4361EE] animate-pulse" />
                        <p className="font-bold text-[#2B2D42]">최상의 변환 환경을 준비하고 있습니다...</p>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .legacy-slider {
                    -webkit-appearance: none;
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 3px;
                    outline: none;
                }
                .legacy-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 24px;
                    height: 32px;
                    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32"><rect x="0" y="0" width="24" height="32" fill="white" stroke="%23d1d5db" rx="4"/><line x1="6" y1="8" x2="6" y2="24" stroke="%23d1d5db" stroke-width="1"/><line x1="12" y1="8" x2="12" y2="24" stroke="%23d1d5db" stroke-width="1"/><line x1="18" y1="8" x2="18" y2="24" stroke="%23d1d5db" stroke-width="1"/></svg>') no-repeat center;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
}
