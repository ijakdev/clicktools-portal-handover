
'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/components/tools/UploadDropzone';
import { FileListSortable } from '@/components/tools/FileListSortable';
import { ProcessingProgress } from '@/components/tools/ProcessingProgress';
import { ResultPanel } from '@/components/tools/ResultPanel';
import { convertPdfToPpt } from '@/lib/converters/pdfToPpt';
import { toast } from 'sonner';
import { UploadedFile, ProcessingState, ConversionResult } from '@/types/tools';
import { v4 as uuidv4 } from 'uuid';

export default function PdfToPptPage() {
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
            message: '슬라이드 생성 중...'
        });

        try {
            const interval = setInterval(() => {
                setProcessingState(prev => ({
                    ...prev,
                    progress: Math.min(prev.progress + 5, 95)
                }));
            }, 500);

            const blob = await convertPdfToPpt(files[0].file);

            clearInterval(interval);
            setProcessingState({
                status: 'completed',
                progress: 100,
                message: '변환 완료!'
            });

            setResult({
                file: blob,
                filename: `converted_${files[0].file.name.replace('.pdf', '')}.pptx`,
                type: 'pdf' as any // Avoiding type error
            });

            toast.success('PPT 변환 완료!');
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2">PDF to PowerPoint 변환</h1>
                <p className="text-slate-600">PDF 페이지를 고화질 PowerPoint 슬라이드(.pptx)로 변환합니다.</p>
            </div>

            {!result && processingState.status === 'idle' && (
                <div className="space-y-8">
                    <UploadDropzone
                        onDrop={handleFilesSelected}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        label="프레젠테이션 PDF 선택"
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
                                    <button
                                        onClick={handleProcess}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
                                    >
                                        PPT로 변환하기
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
