/**
 * HTML 태그 제거: <...> 형태의 모든 태그 삭제
 */
export const stripHtmlTags = (text: string): string => {
  if (!text) return '';
  
  // 1. script, style 태그와 그 내부 콘텐츠를 통째로 제거
  let stripped = text.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  
  // 2. 모든 HTML 태그 제거
  stripped = stripped.replace(/<[^>]*>?/gm, '');
  
  // 3. 주요 HTML 엔티티(Entities) 디코딩
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&#160;': ' '
  };
  
  stripped = stripped.replace(/&[a-z0-9#]+;/gi, (match) => {
    const lowerMatch = match.toLowerCase();
    return entities[lowerMatch] || match;
  });

  // 4. 불필요한 연속 공백 및 빈 줄 정리
  return stripped
    .replace(/[ \t]+/g, ' ')           // 연속된 공백/탭을 하나로
    .replace(/\n\s*\n/g, '\n\n')      // 연속된 빈 줄을 최대 2줄로 제한
    .trim();
};

/**
 * 텍스트를 HTML로 변환: 줄 바꿈을 <br />로, 문단을 <p>로 감싸기
 */
export const textToHtml = (text: string): string => {
  const paragraphs = text.split(/\r?\n\r?\n/);
  return paragraphs
    .map((p) => `<p>${p.replace(/\r?\n/g, '<br />')}</p>`)
    .join('\n');
};

/**
 * URL 인코딩
 */
export const encodeUrl = (text: string): string => {
  try {
    return encodeURIComponent(text);
  } catch (e) {
    return text;
  }
};

/**
 * URL 디코딩
 */
export const decodeUrl = (text: string): string => {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return text;
  }
};

/**
 * Base64 인코딩
 */
export const encodeBase64 = (text: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (e) {
    return 'Error: Invalid text for Base64 encoding';
  }
};

/**
 * Base64 디코딩
 */
export const decodeBase64 = (text: string): string => {
  try {
    return decodeURIComponent(escape(atob(text)));
  } catch (e) {
    return 'Error: Invalid Base64 string';
  }
};
