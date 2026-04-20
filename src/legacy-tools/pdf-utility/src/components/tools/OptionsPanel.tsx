import { cn } from "@/lib/utils";

interface OptionsPanelProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function OptionsPanel({ title, children, className }: OptionsPanelProps) {
    return (
        <div className={cn("bg-white rounded-xl border p-6 shadow-sm", className)}>
            {title && (
                <h3 className="font-semibold text-lg mb-4 text-slate-800 border-b pb-2">
                    {title}
                </h3>
            )}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
