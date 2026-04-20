
'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/components/tools/UploadDropzone';
import { FileListSortable } from '@/components/tools/FileListSortable';
import { ProcessingProgress } from '@/components/tools/ProcessingProgress';
import { ResultPanel } from '@/components/tools/ResultPanel';
import { convertOcrPdf } from '@/lib/converters/ocrPdf';
import { toast } from 'sonner';
import { UploadedFile, ProcessingState, ConversionResult } from '@/types/tools';
import { v4 as uuidv4 } from 'uuid';

export default function OcrPdfPage() {
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
            message: 'OCR 엔진 초기화 중...'
        });

        try {
            const blob = await convertOcrPdf(files[0].file, (progress) => {
                setProcessingState(prev => ({
                    ...prev,
                    progress: progress,
                    message: `텍스트 인식 중... ${progress}%`
                }));
            });

            setProcessingState({
                status: 'completed',
                progress: 100,
                message: '변환 완료!'
            });

            setResult({
                file: blob,
                filename: `ocr_${files[0].file.name}`,
                type: 'pdf' as any
            });

            toast.success('OCR 변환 완료!');
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2">OCR PDF 변환</h1>
                <p className="text-slate-600">이미지나 스캔된 PDF를 검색 가능한 텍스트가 포함된 PDF로 변환합니다.</p>
                <p className="text-xs text-slate-400 mt-2">주의: 처리 시간이 다소 걸릴 수 있습니다.</p>
            </div>

            {!result && processingState.status === 'idle' && (
                <div className="space-y-8">
                    <UploadDropzone
                        onDrop={handleFilesSelected}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        label="스캔된 PDF 파일 선택"
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
                                    <p className="text-sm text-slate-500 mb-4">
                                        기본 언어: 영어 + 한국어
                                    </p>
                                    <button
                                        onClick={handleProcess}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                                    >
                                        OCR 시작하기
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
