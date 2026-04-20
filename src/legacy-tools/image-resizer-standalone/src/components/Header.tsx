import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Crown, Menu, X, Timer } from 'lucide-react';
import { getAccessState, formatSeconds } from '../utils/subscription';
import { cn } from '../utils/cn';

const Header: React.FC = () => {
    const [access, setAccess] = useState(getAccessState());
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setAccess(getAccessState());
        }, 1000);

        window.addEventListener('storage', () => setAccess(getAccessState()));
        return () => {
            clearInterval(timer);
            window.removeEventListener('storage', () => setAccess(getAccessState()));
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                        <Zap className="text-white" size={20} fill="currentColor" />
                    </div>
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                        UtilityPro
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 dark:text-gray-400">
                    <Link to="/tools" className="hover:text-blue-600 transition-colors">모든 도구</Link>
                    <Link to="/pricing" className="hover:text-blue-600 transition-colors">가격 정책</Link>
                    <button className="hover:text-blue-600 transition-colors">자주 묻는 질문</button>
                </nav>

                {/* Access Info & Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {access.premiumActive ? (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-black text-xs shadow-lg shadow-amber-500/20">
                            <Crown size={14} fill="currentColor" />
                            PREMIUM
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs border-2 transition-all",
                                access.remainingSeconds > 0
                                    ? "bg-blue-50 border-blue-100 text-blue-600 animate-pulse"
                                    : "bg-gray-50 border-gray-100 text-gray-400"
                            )}>
                                <Timer size={14} />
                                {formatSeconds(access.remainingSeconds)}
                            </div>
                            <Link to="/pricing" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-black text-xs transition-all hover:shadow-lg hover:shadow-blue-500/30">
                                무제한 이용
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-6 space-y-4 animate-in">
                    <Link to="/tools" className="block font-bold text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(false)}>모든 도구</Link>
                    <Link to="/pricing" className="block font-bold text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(false)}>가격 정책</Link>
                    <hr className="border-gray-100 dark:border-gray-800" />
                    <div className="flex flex-col gap-3">
                        <Link to="/pricing" className="w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-black">
                            구독 시작하기
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
