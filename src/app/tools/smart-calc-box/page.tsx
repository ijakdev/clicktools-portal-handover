import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import SmartCalculator from '@/components/tools/SmartCalculator';
import { TOOLS } from '@/data/tools';

const tool = TOOLS.find(t => t.id === 'smart-calc-box')!;

export const metadata: Metadata = {
  title: `${tool.name} | 이미지, PDF, 계산 한 번에 해결 - 클릭툴스`,
  description: "이미지 리사이즈, PDF 변환, 텍스트 비교, QR코드 생성까지 무료로 바로 사용하는 웹 기반 유틸리티 서비스",
  keywords: `계산기, 단위변환, BMI 계산, 환율 계산, 부가세 계산, ${tool.features.join(', ')}`,
};

import SmartCalculatorDashboard from '@/components/tools/SmartCalculatorDashboard';
import MasterGuidePortal from '@/components/tools/MasterGuidePortal';

export default function SmartCalcPage() {
  return (
    <ToolLayout tool={tool} hideHeader={true}>
      <SmartCalculatorDashboard />
    </ToolLayout>
  );
}
