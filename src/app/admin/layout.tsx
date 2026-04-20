"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, FileText, MessageSquare, LogOut, 
    Settings, Globe, MousePointer2, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // 로그인 페이지는 레이아웃 제외
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        // Simple logout by clearing cookie (actually better to do via API but we can just redirect if needed)
        document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        toast.info('로그아웃 되었습니다.');
        router.push('/admin/login');
    };

    const navItems = [
        { label: '대시보드', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: '블로그 관리', icon: FileText, href: '/admin/blog' },
        { label: '문의 게시판', icon: MessageSquare, href: '/admin/inquiries' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col fixed inset-y-0 z-50">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-black flex items-center justify-center rounded-lg border border-slate-700 shadow-xl overflow-hidden">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="admin-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FDE047" />
                                    <stop offset="50%" stopColor="#CA8A04" />
                                    <stop offset="100%" stopColor="#854D0E" />
                                </linearGradient>
                            </defs>
                            <g stroke="url(#admin-gold)" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M4 1V0" /><path d="M7 1L8 0" /><path d="M8 4H9" /><path d="M7 7L8 8" />
                                <path d="M4 8V9" /><path d="M1 7L0 8" /><path d="M0 4H1" /><path d="M1 1L0 0" />
                            </g>
                            <path d="M4 4l7.07 16.97 2.51-7.39 7.39-2.51L4 4z" fill="url(#admin-gold)" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-white font-black tracking-tighter leading-none">클릭툴스</h1>
                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 mt-1">관리 전용 시스템</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-grow space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-bold transition-all group border border-transparent",
                                    isActive 
                                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm" 
                                        : "hover:bg-slate-800 hover:text-white"
                                )}
                                onClick={(e) => {
                                    // If we are in a sub-route or already on the page, 
                                    // we want to ensure we go back to the BASE and reset state.
                                    if (pathname.startsWith(item.href)) {
                                        // If already on the EXACT base path, force a refresh for the user
                                        if (pathname === item.href) {
                                            window.location.href = item.href;
                                        }
                                        // Otherwise, the Link component will take us back to the base
                                    }
                                }}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="pt-6 border-t border-slate-800 space-y-2">
                    <Link 
                        href="/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <Globe className="w-4 h-4" />
                        사이트 바로가기
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 p-8">
                <header className="flex justify-between items-center mb-12 bg-white p-6 border border-slate-200">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight underline decoration-indigo-500/20 underline-offset-8">
                            {navItems.find(n => n.href === pathname)?.label || '시스템'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-black text-slate-900">클릭툴스 관리자 님</span>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">최고 관리자 권한</span>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                             <User className="w-6 h-6 text-slate-900" />
                        </div>
                    </div>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
}
