# PDF Utility Program

Next.js, TypeScript, TailwindCSS로 제작된 클라이언트 사이드 PDF 유틸리티 웹 애플리케이션입니다.
서버 업로드 없이 브라우저에서 안전하게 PDF 변환 작업을 수행할 수 있습니다.

## 주요 기능

### 1. JPG to PDF
- **이미지 병합**: 여러 이미지를 하나의 PDF로 병합
- **개별 변환**: 이미지를 각각의 PDF로 변환 (ZIP 다운로드)
- **옵션**: 페이지 크기(Fit, A4, Letter), 여백, 방향 설정
- **지원 포맷**: JPG, PNG, WebP (캔버스 렌더링 지원)

### 2. PDF to JPG
- **페이지 추출**: PDF의 모든 페이지를 고화질 JPG로 변환
- **ZIP 다운로드**: 다수의 이미지 파일을 하나의 ZIP으로 압축하여 다운로드
- **품질 설정**: 일반(1.5x) / 고화질(2.0x) 지원

### 3. HTML to PDF
- **인터페이스**: URL 입력 및 검증 UI 제공
- **서버 연동 준비**: 추후 서버 사이드 렌더링(Puppeteer 등) 연동을 위한 구조 마련

## 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS, Lucide React
- **PDF Processing**: `pdf-lib` (생성), `pdfjs-dist` (렌더링)
- **Util**: `jszip` (압축), `react-dropzone` (업로드), `sonner` (알림)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# 또는 포트 지정
npm run dev -- -p 3001
```

## 프라이버시
이 프로그램은 **로컬 우선(Local-First)** 원칙을 따릅니다. 사용자의 파일은 서버로 전송되지 않으며, 모든 변환 과정은 사용자의 브라우저 내에서 이루어집니다.
