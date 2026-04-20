"use client";

import React, { useState, useRef } from 'react';
import { 
    QrCode, Download, Settings2, FileSpreadsheet, 
    Upload, Trash2, CheckCircle2, RefreshCw,
    Palette, Type, Layers, ArrowRight, Sparkles,
    ExternalLink, Share2, Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
// @ts-ignore
import QRCode from 'qrcode';
import { toast } from 'sonner';

export default function QrGenerator() {
    const [url, setUrl] = useState('');
    const [qrOptions, setQrOptions] = useState({
        errorCorrectionLevel: 'M',
        resolution: '300',
        colorDark: '#000000',
        colorLight: '#ffffff'
    });
    const [singleQr, setSingleQr] = useState<string | null>(null);

    const generateSingle = async () => {
        if (!url) return;
        try {
            const dataUrl = await QRCode.toDataURL(url, {
                errorCorrectionLevel: qrOptions.errorCorrectionLevel as any,
                width: parseInt(qrOptions.resolution),
                color: {
                    dark: qrOptions.colorDark,
                    light: qrOptions.colorLight
                }
            });
            setSingleQr(dataUrl);
            toast.success('QR 코드가 생성되었습니다!');
            await fetch('/api/stats', { 
                method: 'POST', 
                body: JSON.stringify({ field: 'onlineTools' }), 
                headers: { 'Content-Type': 'application/json' } 
            }).catch(() => {});
        } catch (err) {
            toast.error('QR 코드 생성 오류');
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-4 space-y-12 animate-in font-sans">
            {/* Internal Header */}
            <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
               <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter uppercase">무료 QR코드 생성기</h1>
               <p className="text-lg font-bold text-slate-400">나만의 고해상도 QR코드를 1초 만에 만드세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-red-900/5">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                            <QrCode size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">QR 설정하기</h3>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[12px] font-black text-slate-300 uppercase tracking-widest pl-1">URL 입력</p>
                        <div className="relative">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-red-500 focus:bg-white outline-none font-bold transition-all"
                            />
                            <button 
                                onClick={generateSingle}
                                className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 hover:bg-slate-900 text-white rounded-xl font-black text-sm shadow-xl shadow-red-900/10 transition-all flex items-center gap-2"
                            >
                                생성 <Sparkles size={14} />
                            </button>
                        </div>
                    </div>

                    {/* 2. Color & Design Section (Ported from Legacy) */}
                    <div className="space-y-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
                                <Palette size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800">디자인 및 색상</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-bold text-slate-500">색상 프리셋 (추천)</p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { color: '#000000', label: 'Black' },
                                    { color: '#2563eb', label: 'Blue' },
                                    { color: '#8b5cf6', label: 'Purple' },
                                    { color: '#ec4899', label: 'Pink' },
                                    { color: '#f59e0b', label: 'Orange' },
                                    { color: '#10b981', label: 'Green' }
                                ].map((preset) => (
                                    <button
                                        key={preset.color}
                                        onClick={() => setQrOptions({ ...qrOptions, colorDark: preset.color, colorLight: '#ffffff' })}
                                        className={cn(
                                            "w-12 h-12 rounded-full border-4 transition-all hover:scale-110",
                                            qrOptions.colorDark === preset.color && qrOptions.colorLight === '#ffffff'
                                                ? "border-blue-500 shadow-lg"
                                                : "border-white shadow-sm"
                                        )}
                                        style={{ backgroundColor: preset.color }}
                                        title={preset.label}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 tracking-tight pl-1">QR 코드 색상 (HEX)</label>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 focus-within:border-blue-400 transition-all shadow-sm">
                                    <input 
                                        type="color" 
                                        value={qrOptions.colorDark} 
                                        onChange={(e) => setQrOptions({...qrOptions, colorDark: e.target.value})}
                                        className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                                    />
                                    <input 
                                        type="text" 
                                        value={qrOptions.colorDark} 
                                        onChange={(e) => setQrOptions({...qrOptions, colorDark: e.target.value})}
                                        className="w-full bg-transparent border-none outline-none font-black text-slate-600 uppercase"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 tracking-tight pl-1">배경 색상 (HEX)</label>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 focus-within:border-blue-400 transition-all shadow-sm">
                                    <input 
                                        type="color" 
                                        value={qrOptions.colorLight} 
                                        onChange={(e) => setQrOptions({...qrOptions, colorLight: e.target.value})}
                                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-100 bg-white"
                                    />
                                    <input 
                                        type="text" 
                                        value={qrOptions.colorLight} 
                                        onChange={(e) => setQrOptions({...qrOptions, colorLight: e.target.value})}
                                        className="w-full bg-transparent border-none outline-none font-black text-slate-600 uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest pl-1">MATRIX SUCCESS V2.5</p>
                            <select 
                                value={qrOptions.errorCorrectionLevel} 
                                onChange={(e) => setQrOptions({...qrOptions, errorCorrectionLevel: e.target.value})}
                                className="w-full p-4 bg-slate-100 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-emerald-200 transition-all"
                            >
                                <option value="L">낮음 (7%)</option>
                                <option value="M">중간 (15%)</option>
                                <option value="Q">높음 (25%)</option>
                                <option value="H">최상 (30%)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-8 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-200 p-20 min-h-[500px]">
                    {singleQr ? (
                        <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-red-900/10 border border-slate-200 scale-100 hover:scale-105 transition-transform duration-500">
                                <img src={singleQr} alt="QR Preview" className="w-[300px] h-[300px] object-contain" />
                            </div>
                            <div className="flex gap-4 mt-12">
                                <button 
                                    onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = singleQr;
                                        a.download = `qr_${Date.now()}.png`;
                                        a.click();
                                    }}
                                    className="px-10 py-5 bg-red-600 hover:bg-slate-900 text-white rounded-3xl font-black shadow-xl shadow-red-900/20 flex items-center gap-2 transition-all active:scale-95"
                                >
                                    <Download size={20} /> 이미지 다운로드
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-30 select-none">
                            <div className="w-32 h-32 bg-slate-200 rounded-[3rem] mx-auto mb-8 flex items-center justify-center text-slate-400">
                                <QrCode size={64} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-400">설명 후 생성 버튼을 눌러주세요</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
