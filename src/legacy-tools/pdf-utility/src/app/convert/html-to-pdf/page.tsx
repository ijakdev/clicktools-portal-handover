'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
    HtmlToPdfOptions,
    ProcessingState,
    ConversionResult
} from '@/types/tools';
import { convertHtmlToPdf } from '@/lib/converters/htmlToPdf';
import { OptionsPanel } from '@/components/tools/OptionsPanel';
import { ProcessingProgress } from '@/components/tools/ProcessingProgress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, AlertTriangle } from 'lucide-react';
import { ResultPanel } from '@/components/tools/ResultPanel';

export default function HtmlToPdfPage() {
    const [url, setUrl] = useState('');
    const [options, setOptions] = useState<HtmlToPdfOptions>({
        url: '',
        pageSize: 'A4',
        orientation: 'Portrait',
    });
    const [processing, setProcessing] = useState<ProcessingState>({
        status: 'idle',
        progress: 0,
        message: '',
    });
    const [result, setResult] = useState<ConversionResult | null>(null);

    const handleConvert = async () => {
        if (!url) {
            toast.error("URL을 입력해주세요.");
            return;
        }

        setProcessing({ status: 'processing', progress: 10, message: 'URL 검증 중...' });
        setResult(null);

        try {
            setOptions(prev => ({ ...prev, url }));

            // Simulate/Stub conversion
            const blob = await convertHtmlToPdf({ ...options, url });

            setProcessing({ status: 'completed', progress: 100, message: '완료!' });

            setResult({
                file: blob,
                filename: `converted_webpage.pdf`,
                type: 'pdf'
            });
        } catch (e) {
            console.error(e);
            // Expected error for stub
            setProcessing({
                status: 'error',
                progress: 0,
                message: '변환에 실패했습니다.',
                error: String(e).replace('Error: ', '')
            });
        }
    };

    if (result) {
        return <ResultPanel result={result} onReset={() => {
            setResult(null);
            setProcessing({ status: 'idle', progress: 0, message: '' });
        }} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">HTML to PDF</h1>
                <p className="text-slate-500">
                    웹페이지 URL을 입력하여 그대로 PDF로 저장합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl border shadow-sm space-y-4">
                        <label htmlFor="url-input" className="block text-sm font-medium text-slate-700">
                            변환할 웹페이지 URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Globe className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="url"
                                id="url-input"
                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-start gap-3 text-sm">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p>
                                현재 이 기능은 <strong>서버 사이드 렌더링</strong>이 필요하여, 데모 버전에서는 인터페이스만 제공됩니다.
                                실제 변환을 위해서는 백엔드(Puppeteer/Playwright) 연동이 필요합니다.
                            </p>
                        </div>
                    </div>

                    <ProcessingProgress state={processing} />
                </div>

                <div className="space-y-6">
                    <OptionsPanel title="설정">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">페이지 크기</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 p-2 text-sm"
                                    value={options.pageSize}
                                    onChange={(e) => setOptions({ ...options, pageSize: e.target.value as any })}
                                >
                                    <option value="A4">A4</option>
                                    <option value="Letter">Letter</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">방향</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 p-2 text-sm"
                                    value={options.orientation}
                                    onChange={(e) => setOptions({ ...options, orientation: e.target.value as any })}
                                >
                                    <option value="Portrait">세로</option>
                                    <option value="Landscape">가로</option>
                                </select>
                            </div>
                        </div>
                    </OptionsPanel>

                    <Button
                        size="lg"
                        className="w-full bg-red-600 hover:bg-red-700 text-lg py-6 shadow-lg shadow-red-200"
                        disabled={!url || processing.status === 'processing'}
                        onClick={handleConvert}
                    >
                        {processing.status === 'processing' ? '처리 중...' : 'PDF로 변환하기'}
                        {!processing.status && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
