import Link from "next/link";
import { TOOLS } from "@/lib/constants";
import {
  FileImage,
  FileText,
  Globe,
  FileSpreadsheet,
  Presentation,
  ScanText,
  LucideIcon,
  ArrowRight
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  FileImage, FileText, Globe, FileSpreadsheet, Presentation, ScanText
};

export default function Home() {
  return (
    <div className="container py-12 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 mb-6 py-2">
          모든 PDF 도구를 한곳에서
        </h1>
        <p className="text-lg text-slate-600">
          이미지 변환, PDF 편집, 최적화까지. <br className="hidden md:inline" />
          서버 업로드 없이 브라우저에서 안전하게 처리하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {TOOLS.map((tool) => {
          const Icon = iconMap[tool.icon] || FileText;

          return (
            <Link
              key={tool.id}
              href={tool.path}
              className="group relative bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all hover:border-red-200 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-red-500 w-5 h-5 -translate-x-2 group-hover:translate-x-0 transition-transform" />
              </div>

              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-700 transition-colors">
                {tool.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                {tool.description}
              </p>

              {tool.comingSoon && (
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full">
                  SOON
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
