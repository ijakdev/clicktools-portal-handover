import { ConversionResult } from '@/types/tools';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface ResultPanelProps {
    result: ConversionResult | null;
    onReset: () => void;
}

export function ResultPanel({ result, onReset }: ResultPanelProps) {
    if (!result) return null;

    const handleDownload = () => {
        const url = URL.createObjectURL(result.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <Download size={32} />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
                변환 완료!
            </h3>
            <p className="text-green-700 mb-6">
                파일이 준비되었습니다. 아래 버튼을 눌러 다운로드하세요.
            </p>

            <div className="flex justify-center gap-4">
                <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
                >
                    <Download className="mr-2 h-5 w-5" />
                    다운로드 {result.filename}
                </Button>

                <Button
                    variant="outline"
                    onClick={onReset}
                    className="border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    다시 하기
                </Button>
            </div>
        </div>
    );
}
