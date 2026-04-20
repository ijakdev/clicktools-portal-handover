/**
 * 알파벳/가나다순 정렬
 */
export const sortLines = (text: string, reverse: boolean = false): string => {
  const lines = text.split(/\r?\n/);
  lines.sort((a, b) => a.localeCompare(b, 'ko'));
  if (reverse) lines.reverse();
  return lines.join('\n');
};

/**
 * 대문자 변환
 */
export const toUpperCase = (text: string): string => {
  return text.toUpperCase();
};

/**
 * 소문자 변환
 */
export const toLowerCase = (text: string): string => {
  return text.toLowerCase();
};

/**
 * 각 단어 첫 글자 대문자
 */
export const toTitleCase = (text: string): string => {
  return text.replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * 숫자 제거
 */
export const removeNumbers = (text: string): string => {
  return text.replace(/[0-9]/g, '');
};
