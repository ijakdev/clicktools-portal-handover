export interface TextAnalysis {
  charCountWithSpaces: number;
  charCountNoSpaces: number;
  wordCount: number;
  lineCount: number;
  sentenceCount: number;
}

/**
 * 기본 텍스트 통계 분석
 */
export const analyzeText = (text: string): TextAnalysis => {
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text.trim() === '' ? 0 : text.split(/\r?\n/).length;
  const sentenceCount = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;

  return {
    charCountWithSpaces,
    charCountNoSpaces,
    wordCount,
    lineCount,
    sentenceCount
  };
};

/**
 * 자주 사용된 단어 분석
 */
export interface WordFrequency {
  word: string;
  count: number;
}

export const analyzeWordFrequency = (text: string): WordFrequency[] => {
  if (!text.trim()) return [];
  
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const freqMap: Record<string, number> = {};
  
  words.forEach((word) => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });
  
  return Object.entries(freqMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // 상위 20개
};
