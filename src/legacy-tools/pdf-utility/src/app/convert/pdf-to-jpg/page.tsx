'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import {
    PdfToJpgOptions,
    ProcessingState,
    UploadedFile,
    ConversionResult
} from '@/types/tools';
import { convertPdfToJpg } from '@/lib/converters/pdfToJpg';
import { createZip } from '@/lib/zip';
import { getFileMeta } from '@/lib/fileMeta';
import { UploadDropzone } from '@/components/tools/UploadDropzone';
import { OptionsPanel } from '@/components/tools/OptionsPanel';
import { ProcessingProgress } from '@/components/tools/ProcessingProgress';
import { ResultPanel } from '@/components/tools/ResultPanel';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, X } from 'lucide-react';

export default function PdfToJpgPage() {
    const [file, setFile] = useState<UploadedFile | null>(null);
    const [options, setOptions] = useState<PdfToJpgOptions>({
        quality: 'normal',
        extractImages: false,
    });
    const [processing, setProcessing] = useState<ProcessingState>({
        status: 'idle',
        progress: 0,
        message: '',
    });
    const [result, setResult] = useState<ConversionResult | null>(null);

    const handleDrop = async (newFiles: File[]) => {
        if (newFiles.length > 1) {
            toast.error("한 번에 하나의 PDF만 변환할 수 있습니다.");
            return;
        }
        const uploaded = {
            id: uuidv4(),
            file: newFiles[0],
            ...(await getFileMeta(newFiles[0])),
            status: 'ready' as const
        };
        setFile(uploaded);
    };

    const handleConvert = async () => {
        if (!file) return;

        setProcessing({ status: 'processing', progress: 0, message: 'PDF 읽는 중...' });
        setResult(null);

        try {
            const jpgBlobs = await convertPdfToJpg(file.file, options);

            setProcessing({ status: 'processing', progress: 50, message: '압축/저장 중...' });

            if (jpgBlobs.length === 1) {
                setResult({
                    file: jpgBlobs[0],
                    filename: `${file.file.name.replace('.pdf', '')}.jpg`,
                    type: 'jpg'
                });
            } else {
                const zipFiles = jpgBlobs.map((blob, idx) => ({
                    name: `${file.file.name.replace('.pdf', '')}_page-${String(idx + 1).padStart(3, '0')}.jpg`,
                    content: blob
                }));
                const zipBlob = await createZip(zipFiles);

                setResult({
                    file: zipBlob,
                    filename: `converted_pages.zip`,
                    type: 'zip'
                });
            }

            setProcessing({ status: 'completed', progress: 100, message: '완료!' });
        } catch (e) {
            console.error(e);
            setProcessing({ status: 'error', progress: 0, message: '오류가 발생했습니다.', error: String(e) });
            toast.error("변환 중 오류가 발생했습니다.");
        }
    };

    if (result) {
        return <ResultPanel result={result} onReset={() => {
            setResult(null);
            setFile(null);
            setProcessing({ status: 'idle', progress: 0, message: '' });
        }} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">PDF to JPG</h1>
                <p className="text-slate-500">
                    PDF의 각 페이지를 고품질 JPG 이미지로 변환합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {!file ? (
                        <UploadDropzone
                            onDrop={handleDrop}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            maxFiles={1}
                            label="PDF 파일을 여기에 드래그하세요"
                        />
                    ) : (
                        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-50 p-3 rounded-lg text-red-600">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-900">{file.file.name}</p>
                                    <p className="text-sm text-slate-500">
                                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                        {file.pageCount ? ` • ${file.pageCount} 페이지` : ''}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <OptionsPanel title="설정">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">품질 (해상도)</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setOptions({ ...options, quality: 'normal' })}
                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${options.quality === 'normal'
                                                ? 'bg-red-50 border-red-200 text-red-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        일반 (150dpi)
                                    </button>
                                    <button
                                        onClick={() => setOptions({ ...options, quality: 'high' })}
                                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${options.quality === 'high'
                                                ? 'bg-red-50 border-red-200 text-red-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        고화질 (300dpi)
                                    </button>
                                </div>
                                {options.quality === 'high' && (
                                    <p className="text-xs text-amber-600 mt-2">
                                        * 고화질 변환은 메모리를 많이 사용하며 더 오래 걸릴 수 있습니다.
                                    </p>
                                )}
                            </div>
                        </div>
                    </OptionsPanel>

                    <Button
                        size="lg"
                        className="w-full bg-red-600 hover:bg-red-700 text-lg py-6 shadow-lg shadow-red-200"
                        disabled={!file || processing.status === 'processing'}
                        onClick={handleConvert}
                    >
                        {processing.status === 'processing' ? '변환 중...' : 'JPG로 변환하기'}
                        {!processing.status && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>

                    <ProcessingProgress state={processing} />
                </div>
            </div>
        </div>
    );
}
