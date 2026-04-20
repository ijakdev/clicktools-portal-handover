"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, LogIn, Loader2, MousePointer2, Settings, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('로그인에 성공했습니다.');
                router.push('/admin/dashboard');
            } else {
                toast.error(data.error || '로그인에 실패했습니다.');
            }
        } catch (error) {
            toast.error('서버와의 통신에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error('신규 비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                body: JSON.stringify({ username, currentPassword, newPassword }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해 주세요.');
                setIsChangingPassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPassword('');
            } else {
                toast.error(data.error || '비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            toast.error('서버와의 통신에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Industrial Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-800 to-black border border-slate-700 shadow-2xl shadow-indigo-500/10 mb-8 rounded-none overflow-hidden relative">
                        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="login-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FDE047" />
                                    <stop offset="50%" stopColor="#CA8A04" />
                                    <stop offset="100%" stopColor="#854D0E" />
                                </linearGradient>
                            </defs>
                            <g stroke="url(#login-gold)" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M4 1V0" /><path d="M7 1L8 0" /><path d="M8 4H9" /><path d="M7 7L8 8" />
                                <path d="M4 8V9" /><path d="M1 7L0 8" /><path d="M0 4H1" /><path d="M1 1L0 0" />
                            </g>
                            <path d="M4 4l7.07 16.97 2.51-7.39 7.39-2.51L4 4z" fill="url(#login-gold)" stroke="#1e293b" strokeWidth="0.5" />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase">클릭툴스 관리 센터</h1>
                    <div className="h-1 w-12 bg-indigo-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">관리자 보안 시스템 전용</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-10 shadow-3xl relative rounded-none">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500/50" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-500/50" />

                    {!isChangingPassword ? (
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">관리자 계정</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="관리자 계정을 입력하십시오" 
                                        className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-none text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-all text-xs font-bold uppercase tracking-widest"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">비밀번호</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••" 
                                        className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-none text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-all text-xs font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white font-black py-5 rounded-none shadow-xl shadow-indigo-900/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50 border border-indigo-400"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        <span className="uppercase tracking-[0.3em] text-[10px]">시스템 접속</span>
                                    </>
                                )}
                            </button>

                            <div className="pt-4 text-center">
                                <button 
                                    type="button"
                                    onClick={() => setIsChangingPassword(true)}
                                    className="text-[9px] font-black text-slate-600 hover:text-indigo-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                                >
                                    <Settings className="w-3 h-3" />
                                    비밀번호 변경
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">관리자 계정 확인</label>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="관리자 아이디" 
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-none text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-all text-[11px] font-bold uppercase tracking-widest"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">기존 비밀번호</label>
                                <input 
                                    type="password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="현재 비밀번호" 
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-none text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-all text-[11px] font-bold"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">신규 비밀번호</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="새로운 비밀번호" 
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-none text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-all text-[11px] font-bold"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">신규 비밀번호 확인</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="비밀번호 확인" 
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-none text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-all text-[11px] font-bold"
                                    required
                                />
                            </div>

                            <div className="pt-4 space-y-3">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-none hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border border-indigo-400 shadow-lg shadow-indigo-900/20"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            <span className="uppercase tracking-widest text-[9px]">비밀번호 업데이트</span>
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsChangingPassword(false)}
                                    className="w-full bg-transparent text-slate-500 font-black py-4 rounded-none hover:text-white transition-all text-[9px] uppercase tracking-widest border border-slate-800 hover:border-slate-700"
                                >
                                    돌아가기
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="mt-12 text-center text-[8px] font-black text-slate-700 uppercase tracking-[0.6em]">
                    시스템 수동 인증 필요 · V1.0.42
                </div>
            </div>
        </div>
    );
}
