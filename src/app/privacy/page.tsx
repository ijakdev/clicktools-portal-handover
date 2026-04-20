import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스',
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-24 font-outfit">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="mb-16 border-b pb-12 border-slate-100">
          <h1 className="text-3xl font-[1000] text-slate-900 mb-6 tracking-tighter">
            🔒 개인정보처리방침 (Privacy Policy)
          </h1>
          <p className="text-xl font-bold text-slate-800 tracking-tight">
            개인정보처리방침 | ClickTools (클릭툴스)
          </p>
        </div>
        
        {/* Content */}
        <div className="space-y-12 text-slate-700 leading-relaxed font-bold">
          <div className="space-y-4">
            <p>
              ClickTools는 사용자의 개인정보 보호를 최우선으로 하며,<br />
              안전하고 신뢰할 수 있는 온라인 유틸리티 서비스를 제공합니다.
            </p>
            <p>
              본 정책은 이미지 변환, PDF 처리, 텍스트 도구 등<br />
              ClickTools의 모든 서비스에 적용됩니다.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">1. 수집하는 정보</h2>
            <p>ClickTools는 회원가입 없이 이용 가능한 서비스입니다.</p>
            <p>다만, 서비스 이용 과정에서 아래 정보가 자동 수집될 수 있습니다.</p>
            <ul className="list-disc pl-6 space-y-2 text-indigo-600">
              <li>IP 주소</li>
              <li>쿠키 (Cookie)</li>
              <li>방문 기록 및 접속 로그</li>
            </ul>
            <p className="pt-4 text-slate-900">
              사용자가 업로드한 파일 및 입력 데이터는<br />
              서비스 처리 목적 외 별도로 저장되지 않습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">2. 개인정보 이용 목적</h2>
            <p>수집된 정보는 다음 목적에만 사용됩니다.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>서비스 안정성 유지</li>
              <li>오류 개선 및 기능 최적화</li>
              <li>이용 통계 분석</li>
            </ul>
            <p className="pt-4 italic">수집된 정보는 광고 또는 마케팅 목적으로 사용되지 않습니다.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">3. 보유 및 파기</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
              <p>업로드 파일: 처리 완료 후 즉시 삭제</p>
              <p>최대 보관 기간: 24시간 이내 자동 삭제</p>
            </div>
            <p>ClickTools는 불필요한 개인정보를 저장하지 않습니다.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">4. 이용자의 권리</h2>
            <p>
              사용자는 언제든지 쿠키 저장을 거부할 수 있으며<br />
              브라우저 설정을 통해 개인정보 수집을 제한할 수 있습니다.
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
