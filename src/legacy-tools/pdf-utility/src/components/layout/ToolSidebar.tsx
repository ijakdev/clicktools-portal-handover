'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOLS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
    FileImage,
    FileText,
    Globe,
    FileSpreadsheet,
    Presentation,
    ScanText,
    LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    FileImage, FileText, Globe, FileSpreadsheet, Presentation, ScanText
};

export function ToolSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-slate-50/50 hidden md:block h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
            <div className="p-4 py-6">
                <h2 className="mb-4 px-2 text-xs font-semibold uppercase text-slate-500">
                    모든 도구
                </h2>
                <div className="space-y-1">
                    {TOOLS.map((tool) => {
                        const Icon = iconMap[tool.icon] || FileText;
                        const isActive = pathname === tool.path;

                        return (
                            <Link
                                key={tool.id}
                                href={tool.path}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-red-50 text-red-600"
                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <Icon size={18} />
                                {tool.title}
                                {tool.comingSoon && (
                                    <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-full">
                                        SOON
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
