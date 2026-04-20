import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import ImageCompressor from '@/components/tools/ImageCompressor';
import { TOOLS } from '@/data/tools';

const tool = TOOLS.find(t => t.id === 'image-compress')!;

export const metadata: Metadata = {
  title: `${tool.name} - 이미지 리사이즈, PDF 변환, 계산까지 해결`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: `${tool.name}, 이미지 용량 줄이기, 사진 압축, 웹 최적화, ${tool.features.join(', ')}`,
};

export default function ImageCompressPage() {
  return (
    <ToolLayout tool={tool} hideHeader={true}>
      <ImageCompressor />
    </ToolLayout>
  );
}
