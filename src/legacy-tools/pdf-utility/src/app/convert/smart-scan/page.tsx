
'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/components/tools/UploadDropzone';
import { ProcessingProgress } from '@/components/tools/ProcessingProgress';
import { processSmartScan, SmartScanResult } from '@/lib/converters/smartScan';
import { toast } from 'sonner';
import { ProcessingState } from '@/types/tools';
import { Button } from '@/components/ui/button';
import { FileText, Download, RefreshCw, Copy } from 'lucide-react';

export default function SmartScanPage() {
    const [file, setFile] = useState<File | null>(null);
    const [processingState, setProcessingState] = useState<ProcessingState>({
        status: 'idle',
        progress: 0,
        message: ''
    });
    const [result, setResult] = useState<SmartScanResult | null>(null);

    const handleFileSelected = async (files: File[]) => {
        if (files.length === 0) return;
        const selectedFile = files[0];
        setFile(selectedFile);

        setProcessingState({
            status: 'processing',
            progress: 0,
            message: '이미지 분석 시작...'
        });

        try {
            const scanResult = await processSmartScan(selectedFile, (progress, message) => {
                setProcessingState(prev => ({
                    ...prev,
                    progress,
                    message
                }));
            });

            setProcessingState({
                status: 'completed',
                progress: 100,
                message: '분석 완료!'
            });
            setResult(scanResult);
            toast.success('텍스트 추출 완료! 내용을 확인하세요.');

        } catch (error) {
            console.error(error);
            setProcessingState({
                status: 'error',
                progress: 0,
                message: '처리 중 오류가 발생했습니다.',
                error: String(error)
            });
            toast.error('처리 중 오류가 발생했습니다.');
        }
    };

    const handleDownloadPdf = () => {
        if (!result) return;
        const url = URL.createObjectURL(result.pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `smart_scan_${file?.name.replace(/\.[^/.]+$/, "")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCopyText = () => {
        if (result?.text) {
            navigator.clipboard.writeText(result.text);
            toast.success('텍스트가 클립보드에 복사되었습니다.');
        }
    };

    const handleReset = () => {
        setFile(null);
        setResult(null);
        setProcessingState({ status: 'idle', progress: 0, message: '' });
    };

    return (
        <div className="container max-w-6xl py-12 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Smart Scan (이미지 to PDF)</h1>
                <p className="text-slate-600">이미지에서 텍스트를 추출하고, 내용을 확인한 뒤 PDF로 변환합니다.</p>
            </div>

            {!result && processingState.status === 'idle' && (
                <div className="max-w-2xl mx-auto">
                    <UploadDropzone
                        onDrop={handleFileSelected}
                        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.bmp'] }}
                        label="이미지 파일 (JPG, PNG) 선택"
                    />
                </div>
            )}

            {processingState.status === 'error' && (
                <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <h3 className="text-red-800 font-semibold mb-2">오류가 발생했습니다</h3>
                    <p className="text-red-600 mb-4">{processingState.message}</p>
                    {processingState.error && (
                        <div className="bg-white p-3 rounded border border-red-100 text-left overflow-auto text-xs text-red-500 font-mono">
                            {processingState.error}
                        </div>
                    )}
                    <Button variant="outline" onClick={handleReset} className="mt-4">
                        다시 시도
                    </Button>
                </div>
            )}

            {processingState.status === 'processing' && (
                <div className="max-w-2xl mx-auto">
                    <ProcessingProgress state={processingState} />
                </div>
            )}

            {result && (
                <div className="grid md:grid-cols-2 gap-8 h-[600px]">
                    {/* Left: Image Preview */}
                    <div className="bg-slate-100 rounded-xl p-4 overflow-auto border border-slate-200">
                        <h3 className="font-semibold mb-2 text-slate-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> 원본 이미지
                        </h3>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={result.imagePreview} alt="Original" className="w-full h-auto rounded shadow-sm" />
                    </div>

                    {/* Right: Text Editor & Actions */}
                    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-700">추출된 텍스트 확인</h3>
                            <Button variant="ghost" size="sm" onClick={handleCopyText} title="텍스트 복사">
                                <Copy className="w-4 h-4 mr-1" /> 복사
                            </Button>
                        </div>

                        <textarea
                            className="flex-1 p-4 resize-none focus:outline-none focus:bg-slate-50 transition-colors font-mono text-sm leading-relaxed"
                            value={result.text}
                            readOnly // Editable implementation would require recreating PDF which is complex for MVP
                            placeholder="텍스트가 여기에 표시됩니다..."
                        />

                        <div className="p-4 border-t bg-slate-50 flex gap-3">
                            <Button
                                onClick={handleDownloadPdf}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                <Download className="w-4 h-4 mr-2" /> PDF 다운로드
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="px-4"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
