"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

/**
 * 프로젝트의 경로에 따라 고유한 레이아웃 구성을 제어하는 래퍼입니다.
 * 관리자 페이지(/admin) 접근 시 일반 사용자용 상단 바와 하단 바를 숨깁니다.
 */
export default function DynamicLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname.startsWith('/admin');

    return (
        <>
            {!isAdminPath && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {!isAdminPath && <Footer />}
        </>
    );
}
