"use client";

import { useState, useCallback } from 'react';

/**
 * 도구 상세 페이지에서 공통적으로 사용하는 입력/출력 에디터 영역
 */
interface EditorAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  onSampleClick: () => void;
  optionsArea?: React.ReactNode;
  isRealtime?: boolean;
  onExecute?: () => void;
}

export default function EditorArea({
  input,
  onInputChange,
  output,
  onSampleClick,
  optionsArea,
  isRealtime = true,
  onExecute
}: EditorAreaProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!output) return;

    // 1. Modern API (requires Secure Context - HTTPS/Localhost)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(output).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Clipboard API failed, falling back...', err);
        fallbackCopy(output);
      });
    } else {
      // 2. Fallback for non-secure context (HTTP via IP)
      fallbackCopy(output);
    }
  }, [output]);

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Ensure the textarea is not visible
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback copy failed', err);
      alert('복사에 실패했습니다. 직접 선택하여 복사해 주세요.');
    }
  };

  const handleClear = () => onInputChange('');

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([output], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "result.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="space-y-8">
      {/* Options Panel */}
      {optionsArea && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">변환 옵션</h4>
          {optionsArea}
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left: Input */}
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm font-bold text-slate-700">입력 텍스트</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={onSampleClick}
                className="px-3 py-1.5 text-[12px] font-semibold text-blue-600 bg-white border border-blue-100 rounded-lg hover:bg-blue-50 transition-all active:scale-95"
              >
                샘플 입력
              </button>
              <button 
                onClick={handleClear}
                className="px-3 py-1.5 text-[12px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                초기화
              </button>
            </div>
          </div>
          <textarea 
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="여기에 변환할 텍스트를 입력하거나 파일을 붙여넣으세요..."
            className="flex-grow min-h-[400px] p-6 text-slate-700 focus:outline-none resize-none font-mono text-sm leading-relaxed"
          />
          <div className="px-6 py-3 bg-slate-50/30 text-[11px] text-slate-400 border-t border-slate-100 flex justify-between">
            <span>{input.length} 자</span>
            {!isRealtime && (
              <button 
                onClick={onExecute}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                변환 실행하기
              </button>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm font-bold text-slate-700">변환 결과</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownload}
                className="px-3 py-1.5 text-[12px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                다운로드 (.txt)
              </button>
              <button 
                onClick={handleCopy}
                className={`px-3 py-1.5 text-[12px] font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1.5 ${
                  copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    복사됨
                  </>
                ) : '결과 복사'}
              </button>
            </div>
          </div>
          <textarea 
            readOnly
            value={output}
            placeholder="변환 결과가 여기에 표시됩니다..."
            className="flex-grow min-h-[400px] p-6 text-slate-700 focus:outline-none resize-none font-mono text-sm bg-slate-50/20 leading-relaxed"
          />
          <div className="px-6 py-3 bg-slate-50/30 text-[11px] text-slate-400 border-t border-slate-100 flex justify-between items-center">
            <span>{output.length} 자</span>
            <button 
              onClick={() => onInputChange(output)}
              className="text-blue-600 font-bold hover:underline"
            >
              결과를 입력창으로 보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
