import { ProcessingState } from '@/types/tools';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ProcessingProgressProps {
    state: ProcessingState;
    onCancel?: () => void;
    className?: string;
}

export function ProcessingProgress({
    state,
    onCancel,
    className
}: ProcessingProgressProps) {
    if (state.status === 'idle' || state.status === 'uploading') return null;

    return (
        <div className={cn("w-full bg-white rounded-xl border p-6 shadow-sm", className)}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {state.status === 'processing' && (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {state.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {state.status === 'error' && (
                        <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-semibold text-slate-900">
                        {state.status === 'processing' && '변환 중...'}
                        {state.status === 'completed' && '완료!'}
                        {state.status === 'error' && '오류 발생'}
                    </span>
                </div>
                <span className="text-sm text-slate-500 font-medium">
                    {Math.round(state.progress)}%
                </span>
            </div>

            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all duration-300 rounded-full",
                        state.status === 'completed' ? "bg-green-500" :
                            state.status === 'error' ? "bg-red-500" : "bg-blue-500"
                    )}
                    style={{ width: `${state.progress}%` }}
                />
            </div>

            <p className="mt-2 text-sm text-slate-500">
                {state.message}
            </p>

            {state.status === 'error' && state.error && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                    {state.error}
                </p>
            )}
        </div>
    );
}
