import Link from 'next/link';
import { Tool } from '@/data/tools';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group block bg-white border border-slate-200/60 rounded-2xl p-6 card-hover group">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
            <ToolIcon type={tool.icon} />
          </div>
          {tool.isPopular && (
            <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-100">
              Popular
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
          {tool.shortDescription}
        </p>
        
        <div className="flex items-center text-sm font-semibold text-blue-600">
          바로 사용하기
          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function ToolIcon({ type }: { type: string }) {
  // Simple SVG Icons corresponding to tool icons
  return (
    <svg className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}
