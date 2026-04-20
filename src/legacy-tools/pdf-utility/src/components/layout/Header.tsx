import Link from 'next/link';
import { FileStack } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-14 items-center px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <div className="bg-red-500 text-white p-1.5 rounded-lg">
                        <FileStack size={20} />
                    </div>
                    <span>PDF 유틸리티</span>
                </Link>
                <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
                    <a href="/" className="transition-colors hover:text-red-500 font-bold flex items-center gap-1">
                        🏠 허브 홈
                    </a>
                    <Link href="/" className="transition-colors hover:text-red-500">
                        모든 도구
                    </Link>
                    <Link href="/privacy" className="transition-colors hover:text-red-500">
                        개인정보처리방침
                    </Link>
                </nav>
            </div>
        </header>
    );
}
