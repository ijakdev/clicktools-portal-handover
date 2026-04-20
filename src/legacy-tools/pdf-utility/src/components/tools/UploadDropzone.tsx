'use client';

import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { UploadCloud, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';

interface UploadDropzoneProps {
    onDrop: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    className?: string;
    label?: string;
}

export function UploadDropzone({
    onDrop,
    accept,
    maxFiles,
    className,
    label = "파일을 여기에 드래그하거나 클릭하여 선택하세요"
}: UploadDropzoneProps) {

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            onDrop(acceptedFiles);
        }
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept,
        maxFiles,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors flex flex-col items-center justify-center gap-4 text-center",
                isDragActive
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 hover:border-red-400 hover:bg-slate-50",
                className
            )}
        >
            <input {...getInputProps()} />
            <div className={cn(
                "p-4 rounded-full transition-transform duration-300",
                isDragActive ? "bg-red-100 scale-110" : "bg-red-50"
            )}>
                <UploadCloud className="w-10 h-10 text-red-600" />
            </div>
            <div>
                <p className="font-semibold text-lg text-slate-700">
                    {isDragActive ? "파일을 놓으세요!" : "파일 선택"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                    {label}
                </p>
            </div>
        </div>
    );
}
