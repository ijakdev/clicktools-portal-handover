import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '면책조항 | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스',
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-white min-h-screen py-24 font-outfit">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="mb-16 border-b pb-12 border-slate-100">
          <h1 className="text-3xl font-[1000] text-slate-900 mb-6 tracking-tighter">
            ⚠️ 면책조항 (Disclaimer)
          </h1>
          <p className="text-xl font-bold text-slate-800 tracking-tight">
            면책조항 | ClickTools (클릭툴스)
          </p>
        </div>
        
        {/* Content */}
        <div className="space-y-12 text-slate-700 leading-relaxed font-bold">
          <div className="space-y-4">
            <p>
              ClickTools는 다양한 온라인 유틸리티 기능을 제공하는 플랫폼입니다.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">1. 서비스 이용 책임</h2>
            <p>모든 서비스 이용에 대한 책임은 이용자 본인에게 있습니다.</p>
            <p className="text-slate-900">
              업로드한 파일 및 변환 결과에 대한 책임은<br />
              사용자에게 있으며, ClickTools는 이에 대한 책임을 지지 않습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">2. 서비스 정확성</h2>
            <p>
              ClickTools는 정확한 결과를 제공하기 위해 노력하지만<br />
              일부 결과에 오류가 발생할 수 있습니다.
            </p>
            <p className="pt-2 text-rose-500 italic">중요한 작업은 반드시 별도 확인을 권장합니다.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">3. 외부 링크</h2>
            <p>
              사이트 내 외부 링크는<br />
              제3자의 서비스로 연결될 수 있으며,
            </p>
            <p className="text-slate-900">
              해당 서비스에 대한 책임은 ClickTools에 없습니다.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">5. 문의</h2>
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
