import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "텍스트 변환의 모든것 - 쉽고 빠른 온라인 텍스트 유틸리티",
  description: "줄바꿈 제거, HTML 정리, 중복 제거, 정렬, 대소문자 변환, 카운트, 랜덤 선택까지 한 곳에서 해결하는 최고의 텍스트 유틸리티 서비스.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#F8FAFC] text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
