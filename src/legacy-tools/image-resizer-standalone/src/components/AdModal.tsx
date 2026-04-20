import React, { useState, useEffect } from 'react';
import { Play, Volume2, SkipForward, Info } from 'lucide-react';

interface AdModalProps {
    onComplete: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanSkip(true);
        }
    }, [timeLeft]);

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in p-4">
            <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center border border-white/10 group">
                {/* Header Actions */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Sponsored AD</span>
                    </div>
                    <button className="p-3 rounded-full bg-black/40 text-white border border-white/10 hover:bg-white/10">
                        <Volume2 size={20} />
                    </button>
                </div>

                {/* Ad Content (Placeholders) */}
                <div className="text-center p-12 space-y-8 max-w-2xl">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                        <Play size={40} className="text-white ml-1" fill="currentColor" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                            당신의 시간을 아껴주는<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 font-black">UtilityPro Premium</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-medium">광고 없이 무제한으로 사용하세요. 연간 구독 시 20% 할인 혜택까지 제공됩니다.</p>
                    </div>
                </div>

                {/* Bottom Bar Controls */}
                <div className="absolute bottom-8 right-8 z-10">
                    {canSkip ? (
                        <button
                            onClick={onComplete}
                            className="bg-white text-black font-black px-10 py-5 rounded-2xl flex items-center gap-3 shadow-2xl hover:bg-blue-600 hover:text-white transition-all hover:scale-105 active:scale-95"
                        >
                            광고 건너뛰기
                            <SkipForward size={24} fill="currentColor" />
                        </button>
                    ) : (
                        <div className="bg-black/80 backdrop-blur-md text-white font-black px-8 py-5 rounded-2xl border border-white/10 flex items-center gap-4">
                            <RefreshCw className="animate-spin text-blue-500" size={20} />
                            광고 종료까지 {timeLeft}초
                        </div>
                    )}
                </div>

                {/* Info Text */}
                <div className="absolute bottom-8 left-8 flex items-center gap-2 text-white/30 text-[10px] font-bold tracking-tight">
                    <Info size={14} />
                    <span>실제 시연용 데모 광고 화면입니다.</span>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-2 bg-blue-600 transition-all duration-1000 shadow-[0_0_20px_rgba(37,99,235,0.5)]" style={{ width: `${((15 - timeLeft) / 15) * 100}%` }} />
            </div>
        </div>
    );
};

// Internal icon for AdModal
const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
    </svg>
);

export default AdModal;
