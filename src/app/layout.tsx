import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "이미지, PDF, 계산까지 한 번에 해결 한국형 올인원 무료 유틸 플랫폼, 클릭툴스",
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: "유틸리티, 이미지 압축, PDF 변환, QR 생성, 숏 URL, 텍스트 비교, 클릭툴스, 한국형 유틸리티",
  openGraph: {
    title: "이미지, PDF, 계산까지 한 번에 해결 한국형 올인원 무료 유틸 플랫폼, 클릭툴스",
    description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
    url: "https://www.clicktools.co.kr",
    type: "website",
    locale: "ko_KR",
  },
  verification: {
    google: "tX3a-H31R90V0205YdyW186kvY6dxOqqI_9d-A7F9-o",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

import DynamicLayoutWrapper from "@/components/layout/DynamicLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
    <head>
      <title>이미지, PDF, 계산까지 한 번에 해결 한국형 올인원 무료 유틸 플랫폼, 클릭툴스</title>

      <meta name="description" content="이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스" />
      <meta name="keywords" content="유틸리티, 이미지 압축, PDF 변환, QR 생성, 숏 URL, 텍스트 비교, 클릭툴스, 한국형 유틸리티" />

      {/*Open Graph*/}
      <meta property="og:title" content="이미지, PDF, 계산까지 한 번에 해결 한국형 올인원 무료 유틸 플랫폼, 클릭툴스" />
      <meta property="og:description" content="이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스" />
      <meta property="og:url" content="https://www.clicktools.co.kr" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ko_KR" />

      {/* Google Verification */}
      <meta name="google-site-verification" content="tX3a-H31R90V0205YdyW186kvY6dxOqqI_9d-A7F9-o" />

      {/* Icons*/}
      <link rel="icon" href="/icon.png" />
      <link rel="apple-touch-icon" href="/icon.png" />

      {/*에드센스 링크*/}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2350957189788653"
              crossOrigin="anonymous"></script>
    </head>
    <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans bg-slate-50 text-slate-900 min-h-screen`}
    >

    <DynamicLayoutWrapper>
          {children}
        </DynamicLayoutWrapper>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
