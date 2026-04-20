import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import { TOOLS } from '@/data/tools';
import VideoAudioClientWrapper from '@/components/tools/VideoAudioClientWrapper';

const tool = TOOLS.find(t => t.id === 'video-to-audio')!;

export const metadata: Metadata = {
  title: `${tool.name} | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: `영상 오디오 추출, 동영상 MP3 변환, 비디오 음원 추출, 무료 영상 변환기, ${tool.features.join(', ')}`,
};

export default function VideoAudioPage() {
  return (
    <ToolLayout tool={tool} hideHeader={true}>
      <VideoAudioClientWrapper />
    </ToolLayout>
  );
}
