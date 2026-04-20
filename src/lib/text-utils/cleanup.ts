/**
 * 줄 바꿈 제거: 모든 줄 바꿈을 공백 하나로 대체하거나 아예 제거
 */
export const removeLineBreaks = (text: string): string => {
  return text.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * 빈 줄 제거: 내용이 없는 라인을 모두 삭제
 */
export const removeEmptyLines = (text: string): string => {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .join('\n');
};

/**
 * 중복 줄 제거: 중복되는 라인을 하나만 남김
 */
export const removeDuplicateLines = (text: string): string => {
  const lines = text.split(/\r?\n/);
  return Array.from(new Set(lines)).join('\n');
};

/**
 * 앞뒤 공백 제거: 각 줄의 시작과 끝 공백 제거
 */
export const trimLines = (text: string): string => {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .join('\n');
};
