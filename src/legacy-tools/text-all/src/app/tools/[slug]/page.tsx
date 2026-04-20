"use client";

import { useState, useMemo, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import ToolPageContainer from '@/components/tools/ToolPageContainer';
import EditorArea from '@/components/tools/EditorArea';

// Import all text utils
import * as Cleanup from '@/lib/text-utils/cleanup';
import * as Convert from '@/lib/text-utils/convert';
import * as Transform from '@/lib/text-utils/transform';
import * as Analyze from '@/lib/text-utils/analyze';

export default function ToolPage() {
  const { slug } = useParams();
  const tool = tools.find((t) => t.slug === slug);
  
  if (!tool) {
    notFound();
  }

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  const isCodecTool = tool.id === 'base64-encode-decode' || tool.id === 'url-encode-decode';

  // Find related tools (same category, excluding current tool)
  const relatedTools = useMemo(() => {
    return tools.filter(t => t.category === tool.category && t.slug !== tool.slug).slice(0, 5);
  }, [tool]);

  // Handle conversion logic based on tool mapping
  useEffect(() => {
    if (!tool.supportsRealtime && input !== '') return;
    
    let result = '';
    
    switch (tool.id) {
      // 1. Cleanup
      case 'remove-line-breaks':
        result = Cleanup.removeLineBreaks(input);
        break;
      case 'remove-empty-lines':
        result = Cleanup.removeEmptyLines(input);
        break;
      case 'remove-duplicate-lines':
        result = Cleanup.removeDuplicateLines(input);
        break;
      
      // 2. HTML/Web
      case 'strip-html-tags':
        result = Convert.stripHtmlTags(input);
        break;
      case 'text-to-html':
        result = Convert.textToHtml(input);
        break;
      case 'url-encode-decode':
        result = mode === 'encode' ? Convert.encodeUrl(input) : Convert.decodeUrl(input);
        break;

      // 3. Sort/Transform
      case 'alphabetical-sort':
        result = Transform.sortLines(input);
        break;
      case 'uppercase':
        result = Transform.toUpperCase(input);
        break;
      case 'lowercase':
        result = Transform.toLowerCase(input);
        break;
      case 'to-title-case':
        result = Transform.toTitleCase(input);
        break;
      case 'remove-spaces':
        // Custom logic for remove spaces
        result = input.replace(/\s+/g, '');
        break;
      case 'remove-numbers':
        result = Transform.removeNumbers(input);
        break;
      
      // 4. Analysis
      case 'word-counter':
        const stats = Analyze.analyzeText(input);
        result = `글자 수 (공백 포함): ${stats.charCountWithSpaces}\n글자 수 (공백 제외): ${stats.charCountNoSpaces}\n단어 수: ${stats.wordCount}\n문장 수: ${stats.sentenceCount}\n줄 수: ${stats.lineCount}`;
        break;
      case 'word-frequency':
        const freq = Analyze.analyzeWordFrequency(input);
        result = freq.map(f => `${f.word}: ${f.count}회`).join('\n');
        break;
      
      // 5. Encoding/Decoding
      case 'base64-encode-decode':
        result = mode === 'encode' ? Convert.encodeBase64(input) : Convert.decodeBase64(input);
        break;

      default:
        result = input;
    }
    
    setOutput(result);
  }, [input, tool, mode]);

  const handleSampleClick = () => {
    switch (tool.id) {
      case 'strip-html-tags':
        setInput('<div>\n  <h1>반가워요 사장님!</h1>\n  <p>이것은 <b>샘플</b> HTML입니다.</p>\n</div>');
        break;
      case 'word-counter':
        setInput('사장님은 세계 최고 수준의 AI 자동화 시스템 아키텍트이자 풀스택 개발자이며 UX 설계 전문가입니다.\n모든 작업은 전문가 수준으로 수행해야 합니다.');
        break;
      case 'alphabetical-sort':
        setInput('포도\n사과\n수박\n바나나\n멜론');
        break;
      case 'base64-encode-decode':
        setInput(mode === 'encode' ? '안녕하세요 사장님!' : '7JWI64WV7ZWY7IS47JqUIOyCrOyekOuLmSE=');
        break;
      default:
        setInput('변환할 내용을 여기에 입력해주세요.\n두 번째 줄입니다.\n세 번째 줄입니다.');
    }
  };

  const handleExecute = () => {
    // Non-realtime execution logic (e.g. Random Picker)
    if (tool.id === 'random-picker') {
      const lines = input.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length > 0) {
        const random = lines[Math.floor(Math.random() * lines.length)];
        setOutput(random);
      }
    }
  };

  return (
    <ToolPageContainer tool={tool} relatedTools={relatedTools}>
      <EditorArea 
        input={input}
        onInputChange={setInput}
        output={output}
        onSampleClick={handleSampleClick}
        isRealtime={tool.supportsRealtime}
        onExecute={handleExecute}
        optionsArea={
          <div className="flex flex-col gap-6">
            {isCodecTool && (
              <div className="flex items-center p-1 bg-slate-100/50 rounded-xl w-fit border border-slate-200">
                <button
                  onClick={() => setMode('encode')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    mode === 'encode' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  인코딩 (Encode)
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    mode === 'decode' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  디코딩 (Decode)
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 font-medium">
              <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                실시간 자동 변환
              </label>
              {tool.id === 'alphabetical-sort' && (
                <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                  대소문자 무시 (정렬 시)
                </label>
              )}
            </div>
          </div>
        }
      />
    </ToolPageContainer>
  );
}
