import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import UrlShortener from '@/components/tools/UrlShortener';
import { TOOLS } from '@/data/tools';

const tool = TOOLS.find(t => t.id === 'url-shortener')!;

export const metadata: Metadata = {
  title: `${tool.name} | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: `URL 단축, 링크 줄이기, 단축 링크 생성, 무료 URL 단축기, ${tool.features.join(', ')}`,
};

export default function UrlShortenerPage() {
  return (
    <ToolLayout tool={tool} hideHeader={true} transparentBackground={true}>
      <UrlShortener />
    </ToolLayout>
  );
}
