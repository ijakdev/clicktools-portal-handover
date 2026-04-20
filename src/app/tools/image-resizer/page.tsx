import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import ImageResizer from '@/components/tools/ImageResizer';
import { TOOLS } from '@/data/tools';

const tool = TOOLS.find(t => t.id === 'image-resizer')!;

export const metadata: Metadata = {
  title: `${tool.name} | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: `이미지 리사이징, 사진 크기 조정, 유튜브 썸네일 크기, 인스타그램 사이즈, ${tool.features.join(', ')}`,
};

import MasterGuidePortal from '@/components/tools/MasterGuidePortal';

export default function ImageResizerPage() {
  return (
    <ToolLayout tool={tool} hideHeader={true}>
      <ImageResizer />
    </ToolLayout>
  );
}
