const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const tipBlock = `
<div style="background-color: #f0f9ff; padding: 18px 24px; border-radius: 12px; margin: 20px 0; border: 1px solid #bae6fd; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
   <div style="font-size: 22px; line-height: 1;">💡</div>
   <div style="flex: 1;">
     <span style="color: #0369a1 !important; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">전문가의 실무 팁: 도구 활용의 정석</span>
     <span style="color: #0c4a6e !important; font-size: 14px; line-height: 1.5; display: block;">
       더 전문적인 결과물을 원하신다면 클릭툴스의 <a href="/tools/url-shortener" style="color: #0284c7 !important; font-weight: 700; text-decoration: underline;">숏URL 생성기</a>를 함께 사용해 보세요. 데이터 전달의 품격이 달라집니다.
     </span>
   </div>
</div>`;

async function insertPosts() {
    const db = await open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });

    const posts = [
        {
            slug: "perfect-image-resizing-aspect-ratio-guide",
            title: "이미지 비율 틀리면 망합니다… 깨짐 없이 리사이징하는 방법",
            excerpt: "무조건 크기만 줄인다고 해결될까요? 이미지 리사이징의 핵심인 '비율(Aspect Ratio)' 유지와 화질 손실 없는 정밀 압축 기술을 대공개합니다. 디자인 퀄리티를 지키는 프로의 비법을 확인하세요.",
            category: "디자인 팁",
            thumbnail: "/uploads/image_resizing_thumb.png",
            image_alt: "이미지 비율과 리사이징을 형상화한 프리미엄 3D 일러스트",
            image_caption: "올바른 리사이징은 이미지의 완성도를 결정짓는 최후의 디테일입니다.",
            content: `웹사이트에 올릴 이미지를 준비하다 보면, 크기를 줄였을 뿐인데 글자가 깨지거나 인물의 비율이 어색해지는 현상을 자주 겪게 됩니다. 2026년 현재, 고해상도 디스플레이가 보편화되면서 이미지의 '깨짐 없는 리사이징'은 디자이너뿐만 아니라 모든 마케터와 운영자에게 필수 역량이 되었습니다.

<h2>1. 이미지 리사이징에서 '비율(Aspect Ratio)'이 생명인 이유</h2>
이미지의 가로세로 비율을 무시하고 강제로 크기를 조정하면 '종횡비 왜곡'이 발생합니다. 이는 브랜드의 전문성을 심각하게 훼손하며, 사용자에게는 아마추어적인 인상을 줍니다.

- **표준 비율 준수:** 16:9, 4:3, 1:1 등 목적에 맞는 표준 비율을 미리 설정하고 리사이징하세요.
- **화질 손실 방지:** 단순한 픽셀 제거가 아니라, 픽셀 사이의 데이터를 지능적으로 재배치하는 알고리즘 활용이 중요합니다.

<h2>2. 프로들이 사용하는 리사이징 핵심 알고리즘</h2>
리사이징 툴을 선택할 때 가장 중요하게 봐야 할 것은 바로 '보간법(Interpolation)'입니다. 픽셀을 늘리거나 줄일 때 생기는 빈 공간을 어떻게 채우느냐가 화질의 명암을 가릅니다.

- **Bicubic:** 주변 픽셀을 분석하여 부드러운 화질을 유지하는 대중적인 방식입니다.
- **Lanczos:** 훨씬 더 복잡한 연산을 통해 선명도를 극한으로 끌어올리는 기술로, 클릭툴스의 리사이징 엔진이 채택하고 있는 방식입니다.

${tipBlock.replace('/tools/url-shortener', '/tools/image-resizer').replace('숏URL 생성기', '이미지 리사이징')}

<h2>3. 클릭툴스(ClickTools)만의 익스트림 리사이징 기술</h2>
클릭툴스는 이미지 크기를 줄이면서도 디테일은 살리는 독자적인 기술력을 보유하고 있습니다.

- **스마트 종횡비 고정:** 클릭 한 번으로 가로세로 비율을 완벽히 유지하며 안전하게 리사이징합니다.
- **브라우저 기반 무손실 연산:** 이미지 데이터를 서버로 보내지 않고 사장님의 브라우저 내에서 즉각 처리하여 원본 화질을 그대로 지켜냅니다.

<h2>결론: 속도와 품질, 두 토끼를 잡으세요</h2>
이미지 최적화의 첫 걸음은 올바른 리사이징입니다. 사장님의 비즈니스가 더 선명하게 빛나도록 클릭툴스가 전문적인 가이드를 제공하겠습니다.`,
            created_at: "2026-04-18 09:00:00",
            published_at: "2026-04-18 09:00:00"
        },
        {
            slug: "why-convert-jpg-to-pdf-benefits",
            title: "JPG를 PDF로 안 바꾸면 손해 보는 이유 (모르는 사람 많음)",
            excerpt: "왜 전문적인 비즈니스 문서는 항상 PDF일까요? 이미지 파일을 PDF로 변환했을 때 얻을 수 있는 놀라운 이점들과 업무 생산성 혁신 방법을 알려드립니다. 아직도 JPG로만 문서를 보내고 있다면 이 글을 필독하세요.",
            category: "업무 팁",
            thumbnail: "/uploads/jpg_to_pdf_thumb.png",
            image_alt: "이미지 파일이 PDF 문서로 변환되는 과정을 보여주는 3D 일러스트",
            image_caption: "PDF 변환은 단순한 포맷 변경이 아니라 비즈니스 에티켓의 시작입니다.",
            content: `중요한 계약서나 포트폴리오 이미지를 상대방에게 보낼 때, 여전히 여러 장의 JPG 파일을 낱개로 전송하고 계신가요? 이는 수신자의 가독성을 떨어뜨릴 뿐만 아니라, 비즈니스 신뢰도에도 영향을 줄 수 있습니다. 전문적인 업무 환경에서 왜 'PDF 변환'이 필수인지 그 핵심적인 이유를 분석해 드립니다.

<h2>1. 문서의 무결성과 보안성 확보</h2>
JPG 파일은 열람 기기에 따라 크기가 제각각으로 보일 수 있고, 누구나 내용을 쉽게 수정할 수 있는 취약점이 있습니다. 반면 PDF는 어떤 장치에서 열어도 동일한 레이아웃을 보장합니다.

- **레이아웃 고정:** 폰트가 깨지거나 이미지가 밀리는 현상을 원천 차단합니다.
- **보안 기능 강화:** 암호 설정이나 편집 방지 기능을 통해 중요한 사내 문서를 보호할 수 있습니다.

<h2>2. 다중 이미지의 단일화: 업무 가독성의 혁명</h2>
10장의 사진을 각각 보내는 것과, 논리적인 순서대로 정리된 하나의 PDF 파일로 보내는 것 중 어떤 것이 더 전문적으로 보일까요?

- **파일 관리 효율:** 한 번의 다운로드로 모든 내용을 확인할 수 있어 수신자의 수고를 덜어줍니다.
- **용량 최적화:** 클릭툴스의 PDF 변환 기술은 이미지 화질은 유지하면서 전체 파일 용량을 효율적으로 압축하여 전송 속도를 높입니다.

${tipBlock.replace('/tools/url-shortener', '/tools/pdf-utility?tool=jpg-to-pdf').replace('숏URL 생성기', 'JPG to PDF 변환기')}

<h2>3. 검색 가능한 문서(OCR)로의 확장성</h2>
PDF 포맷은 단순한 이미지를 넘어 '데이터'로서의 가치를 가집니다. 추후 OCR(광학 문자 인식) 기능을 통해 이미지 내 텍스트를 검색하거나 복사할 수 있는 기반이 됩니다.

<h2>결론: 비즈니스의 격은 디테일에서 결정됩니다</h2>
이미지 파일을 PDF로 변환하는 작은 습관 하나가 사장님의 프로페셔널한 이미지를 완성합니다. 지금 바로 클릭툴스의 강력한 PDF 마스터 도구를 활용해 보세요.`,
            created_at: "2026-04-18 10:00:00",
            published_at: "2026-04-18 10:00:00"
        }
    ];

    for (const post of posts) {
        const result = await db.run(
            `INSERT INTO blog_posts (
                slug, title, excerpt, category, thumbnail, image_alt, image_caption,
                content, created_at, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                post.slug, post.title, post.excerpt, post.category, post.thumbnail, post.image_alt, post.image_caption,
                post.content, post.created_at, post.published_at
            ]
        );
        console.log(`Post inserted: ${post.title} with ID: ${result.lastID}`);
    }

    await db.close();
}

insertPosts().catch(console.error);
