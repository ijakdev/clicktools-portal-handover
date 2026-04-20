'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import {
    ImageToPdfOptions,
    ProcessingState,
    UploadedFile,
    ConversionResult
} from '@/types/tools';
import { convertImagesToPdf } from '@/lib/converters/imageToPdf';
import { createZip } from '@/lib/zip';
import { getFileMeta } from '@/lib/fileMeta';
import { UploadDropzone } from '@/components/tools/UploadDropzone';
import { FileListSortable } from '@/components/tools/FileListSortable';
import { OptionsPanel } from '@/components/tools/OptionsPanel';
import { ProcessingProgress } from '@/components/tools/ProcessingProgress';
import { ResultPanel } from '@/components/tools/ResultPanel';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings2 } from 'lucide-react';

export default function JpgToPdfPage() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [options, setOptions] = useState<ImageToPdfOptions>({
        pageSize: 'Fit',
        margin: 'None',
        orientation: 'Auto',
        mergeImages: true,
    });
    const [processing, setProcessing] = useState<ProcessingState>({
        status: 'idle',
        progress: 0,
        message: '',
    });
    const [result, setResult] = useState<ConversionResult | null>(null);

    const handleDrop = async (newFiles: File[]) => {
        const uploaded = await Promise.all(newFiles.map(async (file) => ({
            id: uuidv4(),
            file,
            ...(await getFileMeta(file)),
            status: 'ready' as const
        })));
        setFiles((prev) => [...prev, ...uploaded]);
    };

    const handleRemove = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setProcessing({ status: 'processing', progress: 0, message: '준비 중...' });
        setResult(null);

        try {
            // 1. Merge all into one PDF
            if (options.mergeImages) {
                setProcessing({ status: 'processing', progress: 30, message: 'PDF 생성 중...' });
                const blob = await convertImagesToPdf(files.map(f => f.file), options);

                setProcessing({ status: 'completed', progress: 100, message: '완료!' });
                setResult({
                    file: blob,
                    filename: `converted_${Date.now()}.pdf`,
                    type: 'pdf'
                });
            } else {
                // 2. Separate PDFs (zipped)
                setProcessing({ status: 'processing', progress: 10, message: '개별 PDF 생성 중...' });
                const pdfFiles = [];
                let completed = 0;

                for (const file of files) {
                    const blob = await convertImagesToPdf([file.file], options);
                    pdfFiles.push({
                        name: `${file.file.name.replace(/\.[^/.]+$/, "")}.pdf`,
                        content: blob
                    });
                    completed++;
                    setProcessing(prev => ({
                        ...prev,
                        progress: 10 + (completed / files.length) * 60,
                        message: `${completed}/${files.length} 처리 중...`
                    }));
                }

                setProcessing({ status: 'processing', progress: 80, message: 'ZIP 압축 중...' });
                const zipBlob = await createZip(pdfFiles);

                setProcessing({ status: 'completed', progress: 100, message: '완료!' });
                setResult({
                    file: zipBlob,
                    filename: `converted_pdfs.zip`,
                    type: 'zip'
                });
            }
        } catch (e) {
            console.error(e);
            setProcessing({ status: 'error', progress: 0, message: '오류가 발생했습니다.', error: String(e) });
            toast.error("변환 중 오류가 발생했습니다.");
        }
    };

    if (result) {
        return <ResultPanel result={result} onReset={() => {
            setResult(null);
            setFiles([]);
            setProcessing({ status: 'idle', progress: 0, message: '' });
        }} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">JPG to PDF</h1>
                <p className="text-slate-500">
                    여러 이미지를 하나의 PDF로 병합하거나 개별 PDF로 변환합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <UploadDropzone
                        onDrop={handleDrop}
                        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'] }}
                    />

                    <FileListSortable
                        files={files}
                        setFiles={setFiles}
                        onRemove={handleRemove}
                    />
                </div>

                <div className="space-y-6">
                    <OptionsPanel title="설정">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">페이지 크기</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    value={options.pageSize}
                                    onChange={(e) => setOptions({ ...options, pageSize: e.target.value as any })}
                                >
                                    <option value="Fit">원본 크기 (Fit)</option>
                                    <option value="A4">A4</option>
                                    <option value="Letter">Letter</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">여백</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 p-2 text-sm"
                                    value={options.margin}
                                    onChange={(e) => setOptions({ ...options, margin: e.target.value as any })}
                                    disabled={options.pageSize === 'Fit'}
                                >
                                    <option value="None">없음</option>
                                    <option value="Small">좁게</option>
                                    <option value="Big">넓게</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">방향</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 p-2 text-sm"
                                    value={options.orientation}
                                    onChange={(e) => setOptions({ ...options, orientation: e.target.value as any })}
                                    disabled={options.pageSize === 'Fit'}
                                >
                                    <option value="Auto">자동</option>
                                    <option value="Portrait">세로</option>
                                    <option value="Landscape">가로</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="merge"
                                    checked={options.mergeImages}
                                    onChange={(e) => setOptions({ ...options, mergeImages: e.target.checked })}
                                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                                />
                                <label htmlFor="merge" className="text-sm text-slate-700 select-none">
                                    하나의 PDF로 병합
                                </label>
                            </div>
                        </div>
                    </OptionsPanel>

                    <Button
                        size="lg"
                        className="w-full bg-red-600 hover:bg-red-700 text-lg py-6 shadow-lg shadow-red-200"
                        disabled={files.length === 0 || processing.status === 'processing'}
                        onClick={handleConvert}
                    >
                        {processing.status === 'processing' ? '변환 중...' : 'PDF로 변환하기'}
                        {!processing.status && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>

                    <ProcessingProgress state={processing} />
                </div>
            </div>
        </div>
    );
}
