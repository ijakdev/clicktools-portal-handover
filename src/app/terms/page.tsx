import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스',
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
};

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-24 font-outfit">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="mb-16 border-b pb-12 border-slate-100">
          <h1 className="text-3xl font-[1000] text-slate-900 mb-6 tracking-tighter">
            📄 이용약관 (Terms of Service)
          </h1>
          <p className="text-xl font-bold text-slate-800 tracking-tight">
            이용약관 | ClickTools (클릭툴스)
          </p>
        </div>
        
        {/* Content */}
        <div className="space-y-12 text-slate-700 leading-relaxed font-bold">
          <div className="space-y-4">
            <p>
              본 약관은 ClickTools에서 제공하는 모든 서비스 이용과 관련하여<br />
              이용자와 운영자 간의 권리 및 책임을 규정합니다.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">1. 서비스 제공</h2>
            <p>ClickTools는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-6 space-y-2 text-indigo-600">
              <li><Link href="/tools/smart-calc-box" className="hover:underline">스마트 계산기</Link></li>
              <li><Link href="/tools/image-resizer" className="hover:underline">이미지 리사이징</Link></li>
              <li><Link href="/tools/pdf-utility" className="hover:underline">PDF 유틸리티</Link></li>
              <li><Link href="/tools/url-shortener" className="hover:underline">숏 URL 생성기</Link></li>
              <li><Link href="/tools/qr-generator" className="hover:underline">QR코드 생성기</Link></li>
              <li><Link href="/tools/text-all" className="hover:underline">텍스트 올인원 (텍스트 및 파일 변환 유틸리티)</Link></li>
              <li><Link href="/tools/image-compress" className="hover:underline">이미지 압축</Link></li>
              <li><Link href="/tools/video-to-audio" className="hover:underline">영상 오디오 변환기</Link></li>
            </ul>
            <p className="pt-4 text-slate-900 font-black">
              서비스는 별도의 회원가입 없이 무료로 제공됩니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">2. 이용자의 책임</h2>
            <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>불법 콘텐츠 업로드</li>
              <li>타인의 권리 침해</li>
              <li>서비스 시스템 악용</li>
            </ul>
            <p className="pt-4 italic text-rose-500">문제가 발생할 경우 서비스 이용이 제한될 수 있습니다.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">3. 서비스 변경 및 중단</h2>
            <p>
              ClickTools는 서비스 품질 개선을 위해<br />
              일부 기능을 변경하거나 중단할 수 있습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">4. 책임의 제한</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
              <p>ClickTools는 무료 도구 제공 서비스로,</p>
              <p>사용 결과에 대한 직접적인 책임을 지지 않습니다.</p>
            </div>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">6. 문의</h2>
            <div className="text-lg">
              <p>이메일: <a href="mailto:clicktoolsijak@gmail.com" className="text-indigo-600 underline">clicktoolsijak@gmail.com</a></p>
              <p>담당: ClickTools 운영팀</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
