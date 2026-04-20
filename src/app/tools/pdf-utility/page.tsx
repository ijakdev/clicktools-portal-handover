import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import PdfHub from '@/components/tools/PdfHub';
import { TOOLS } from '@/data/tools';

const tool = TOOLS.find(t => t.id === 'pdf-utility')!;

export const metadata: Metadata = {
  title: `${tool.name} | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: `PDF 변환기, JPG PDF 변환, PDF 용량 줄이기, PDF 병합, ${tool.features.join(', ')}`,
};

export default function PdfUtilityPage() {
  return (
    <ToolLayout tool={tool} hideHeader={true}>
      <PdfHub />
    </ToolLayout>
  );
}
