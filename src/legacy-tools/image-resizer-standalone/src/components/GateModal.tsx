import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Play, Crown, X, AlertCircle } from 'lucide-react';

interface GateModalProps {
    onClose: () => void;
    onWatchAd: () => void;
}

const GateModal: React.FC<GateModalProps> = ({ onClose, onWatchAd }) => {
    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
                <div className="relative p-10 md:p-14 text-center">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-10 right-10 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Icon Header */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
                        <Lock size={40} className="text-blue-600" />
                    </div>

                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">이용권이 필요합니다</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-sm mx-auto font-medium">
                        본 도구는 프리미엄 전용 기능입니다. 광고를 시청하고 5분간 무료로 이용하시거나 멤버십을 구독하세요.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option 1: Ad */}
                        <button
                            onClick={onWatchAd}
                            className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-8 rounded-3xl text-left hover:border-blue-600 transition-all group"
                        >
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 w-fit mb-4 group-hover:scale-110 transition-transform">
                                <Play size={20} fill="currentColor" />
                            </div>
                            <span className="block font-black text-gray-900 dark:text-white mb-1">무료 이용권</span>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">AD SPONSORED</p>
                        </button>

                        {/* Option 2: Premium */}
                        <Link
                            to="/pricing"
                            onClick={onClose}
                            className="bg-blue-600 p-8 rounded-3xl text-left hover:bg-blue-700 transition-all group"
                        >
                            <div className="bg-white/20 p-3 rounded-2xl text-white w-fit mb-4 group-hover:rotate-12 transition-transform">
                                <Crown size={20} />
                            </div>
                            <span className="block font-black text-white mb-1">Premium 구독</span>
                            <p className="text-[11px] text-white/60 font-bold uppercase tracking-widest">ACCESS ALL TOOLS</p>
                        </Link>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 text-[10px] text-amber-600 font-bold tracking-tighter">
                        <AlertCircle size={14} />
                        <span>본 화면은 구조 시연을 위한 데모입니다. 실제 결제나 광고 비용이 발생하지 않습니다.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GateModal;
