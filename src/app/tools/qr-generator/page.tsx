import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import QrGenerator from '@/components/tools/QrGenerator';
import { TOOLS } from '@/data/tools';

const tool = TOOLS.find(t => t.id === 'qr-generator')!;

export const metadata: Metadata = {
  title: `${tool.name} | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: `QR 코드 생성기, 대량 QR 생성, 엑셀 QR 변환, 무료 QR 디자인, ${tool.features.join(', ')}`,
};

export default function QrGeneratorPage() {
  return (
    <ToolLayout tool={tool} hideHeader={true}>
      <QrGenerator />
    </ToolLayout>
  );
}
