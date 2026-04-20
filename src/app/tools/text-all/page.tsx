import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import TextToolbox from '@/components/tools/TextToolbox';
import { TOOLS } from '@/data/tools';

const tool = TOOLS.find(t => t.id === 'text-all')!;

export const metadata: Metadata = {
  title: `${tool.name} | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: `글자수 세기, 텍스트 변환, 대소문자 변환, 중복 줄 제거, ${tool.features.join(', ')}`,
};

export default function TextAllPage() {
  return (
    <ToolLayout tool={tool} hideHeader={true}>
      <TextToolbox />
    </ToolLayout>
  );
}
