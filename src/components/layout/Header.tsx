"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Calculator, Maximize, FileText, Link2, QrCode, Type, FileImage, Music } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: '최근 블로그', href: '/blog' },
    { name: '개인정보처리방침', href: '/privacy' },
    { name: '이용약관', href: '/terms' },
    { name: '면책조항', href: '/disclaimer' },
    { name: '문의', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/50 shadow-lg">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 no-underline">
          <div className="relative w-11 h-11 bg-gradient-to-br from-slate-800 to-black flex items-center justify-center rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="50%" stopColor="#CA8A04" />
                  <stop offset="100%" stopColor="#854D0E" />
                </linearGradient>
              </defs>
              {/* Sparkles radiating from 4,4 */}
              <g stroke="url(#logo-gold)" strokeWidth="1.5" strokeLinecap="round" className="opacity-80">
                <path d="M4 1V0" />
                <path d="M7 1L8 0" />
                <path d="M8 4H9" />
                <path d="M7 7L8 8" />
                <path d="M4 8V9" />
                <path d="M1 7L0 8" />
                <path d="M0 4H1" />
                <path d="M1 1L0 0" />
              </g>
              {/* Main Arrow */}
              <path 
                d="M4 4l7.07 16.97 2.51-7.39 7.39-2.51L4 4z" 
                fill="url(#logo-gold)" 
                stroke="#1e293b" 
                strokeWidth="0.5"
                className="drop-shadow-sm"
              />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
          </div>
          <div className="flex items-baseline leading-none">
            <span className="text-[22px] font-[900] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-300 to-slate-400">
              Click
            </span>
            <span className="text-[22px] font-[900] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-600">
              Tools
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="text-xs font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest"
            >
              {item.name}
            </Link>
          ))}
          <Link 
            href="/#tools"
            className="px-6 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest border border-indigo-500 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40"
          >
            지금 시작하기
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute top-20 left-0 w-full bg-[#0f172a] border-b border-slate-800 p-6 transition-all duration-300 md:hidden overflow-hidden",
        isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 invisible"
      )}>
        <div className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="text-base font-black text-slate-300 py-3 border-b border-slate-800 last:border-0 uppercase tracking-widest"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
