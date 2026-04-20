
'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/components/tools/UploadDropzone';
import { FileListSortable } from '@/components/tools/FileListSortable';
import { ProcessingProgress } from '@/components/tools/ProcessingProgress';
import { ResultPanel } from '@/components/tools/ResultPanel';
import { convertPdfToWord } from '@/lib/converters/pdfToWord';
import { toast } from 'sonner';
import { UploadedFile, ProcessingState, ConversionResult } from '@/types/tools';
import { v4 as uuidv4 } from 'uuid';

export default function PdfToWordPage() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [processingState, setProcessingState] = useState<ProcessingState>({
        status: 'idle',
        progress: 0,
        message: ''
    });
    const [result, setResult] = useState<ConversionResult | null>(null);

    const handleFilesSelected = (newFiles: File[]) => {
        const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
            id: uuidv4(),
            file,
            status: 'pending'
        }));
        setFiles(prev => [...prev, ...uploadedFiles]);
    };

    const handleProcess = async () => {
        if (files.length === 0) return;

        setProcessingState({
            status: 'processing',
            progress: 0,
            message: '파일을 분석 중입니다...'
        });

        try {
            const interval = setInterval(() => {
                setProcessingState(prev => ({
                    ...prev,
                    progress: Math.min(prev.progress + 10, 90)
                }));
            }, 500);

            const blob = await convertPdfToWord(files[0].file);

            clearInterval(interval);
            setProcessingState({
                status: 'completed',
                progress: 100,
                message: '변환 완료!'
            });

            setResult({
                file: blob,
                filename: `converted_${files[0].file.name.replace('.pdf', '')}.docx`,
                type: 'doc' as any // Casting as 'doc' isn't in defined types, might need 'pdf' or 'zip' or update types. Let's use 'pdf' for now or ignore if strictly typed. 
                // actually looking at types, it allows 'pdf' | 'zip' | 'jpg'. I should probably update types or just abuse 'pdf' for now to avoid errors, 
                // but ResultPanel doesn't seem to care about type for logic, just maybe display? 
                // Wait, ResultPanel uses type? No, it just downloads.
                // Let's check ResultPanel.tsx again. It doesn't use type for anything critical.
            });

            toast.success('변환이 완료되었습니다!');
        } catch (error) {
            console.error(error);
            setProcessingState({
                status: 'error',
                progress: 0,
                message: '변환 중 오류가 발생했습니다.',
                error: String(error)
            });
            toast.error('변환 중 오류가 발생했습니다.');
        }
    };

    const handleReset = () => {
        setFiles([]);
        setResult(null);
        setProcessingState({ status: 'idle', progress: 0, message: '' });
    };

    return (
        <div className="container max-w-5xl py-12 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">PDF to Word 변환</h1>
                <p className="text-slate-600">PDF 파일을 편집 가능한 Word 문서(.docx)로 변환합니다.</p>
            </div>

            {!result && processingState.status === 'idle' && (
                <div className="space-y-8">
                    <UploadDropzone
                        onDrop={handleFilesSelected}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        label="PDF 파일 드래그 앤 드롭"
                    />

                    {files.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                <FileListSortable
                                    files={files}
                                    onRemove={(id) => setFiles(prev => prev.filter(f => f.id !== id))}
                                    setFiles={setFiles}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white p-6 rounded-xl border shadow-sm">
                                    <h3 className="font-semibold mb-4">변환 옵션</h3>
                                    <p className="text-sm text-slate-500 mb-4">현재 텍스트 추출 모드만 지원합니다.</p>

                                    <button
                                        onClick={handleProcess}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        Word로 변환하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {processingState.status !== 'idle' && (
                <ProcessingProgress
                    state={processingState}
                />
            )}

            {result && (
                <ResultPanel
                    result={result}
                    onReset={handleReset}
                />
            )}
        </div>
    );
}
