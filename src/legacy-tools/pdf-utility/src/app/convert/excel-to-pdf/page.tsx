'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/components/tools/UploadDropzone';
import { FileListSortable } from '@/components/tools/FileListSortable';
import { ProcessingProgress } from '@/components/tools/ProcessingProgress';
import { ResultPanel } from '@/components/tools/ResultPanel';
import { convertExcelToPdf } from '@/lib/converters/excelToPdf';
import { toast } from 'sonner';
import { UploadedFile, ProcessingState, ConversionResult } from '@/types/tools';
import { v4 as uuidv4 } from 'uuid';

export default function ExcelToPdfPage() {
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
            message: 'Excel 시트를 분석 중...'
        });

        try {
            const interval = setInterval(() => {
                setProcessingState(prev => ({
                    ...prev,
                    progress: Math.min(prev.progress + 15, 90)
                }));
            }, 300);

            const file = files[0].file;
            const blob = await convertExcelToPdf(file);

            clearInterval(interval);
            setProcessingState({
                status: 'completed',
                progress: 100,
                message: '변환 완료!'
            });

            setResult({
                file: blob,
                filename: `converted_${file.name.replace(/\.[^/.]+$/, '')}.pdf`,
                type: 'pdf' as any
            });

            toast.success('시트 데이터가 PDF 로 출력되었습니다!');
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Excel to PDF</h1>
                <p className="text-slate-600">Excel 시트 데이터(.xlsx, .csv)를 PDF 리포트로 자동 생성합니다.</p>
            </div>

            {!result && processingState.status === 'idle' && (
                <div className="space-y-8">
                    <UploadDropzone
                        onDrop={handleFilesSelected}
                        accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'], 'text/csv': ['.csv'] }}
                        label="Excel 파일 드래그 앤 드롭"
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
                                    <p className="text-sm text-slate-500 mb-4">전체 시트 데이터가 텍스트 리포트로 변환됩니다.</p>

                                    <button
                                        onClick={handleProcess}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        PDF로 생성하기
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
