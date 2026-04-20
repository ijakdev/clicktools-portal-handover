import React from 'react';
import { Metadata } from 'next';
import ToolLayout from '@/components/layout/ToolLayout';
import SmartCalculatorDetail from '@/components/tools/SmartCalculatorDetail';
import MasterGuidePortal from '@/components/tools/MasterGuidePortal';
import { TOOLS } from '@/data/tools';
import { CALCULATOR_DATA } from '@/data/calculator-data';

type Props = {
  params: { id: string };
};

const tool = TOOLS.find(t => t.id === 'smart-calc-box')!;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const calc = CALCULATOR_DATA.find(c => c.id === id);
  const title = calc ? `${calc.title} - ${tool.name}` : tool.name;
  return {
    title: `${title} | ClickTools`,
    description: calc ? `${calc.title}: ${calc.desc}` : tool.longDescription,
  };
}

export default async function SmartCalcDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <ToolLayout tool={tool} subId={id}>
      <SmartCalculatorDetail id={id} />
    </ToolLayout>
  );
}
