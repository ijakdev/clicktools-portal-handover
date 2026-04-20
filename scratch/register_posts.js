const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const posts = [
    {
        slug: "perfect-length-conversion-guide",
        title: "길이 단위 변환 아직도 헷갈리나요? 3초 만에 끝내는 계산법",
        excerpt: "mm, cm, m, km부터 inch, feet까지! 헷갈리는 길이 단위 변환을 한 번에 정리하고 편리한 변환기 활용법을 소개합니다.",
        category: "가이드",
        thumbnail: "/uploads/blog/length_conversion_thumb.png",
        image_alt: "길이 단위 변환기 일러스트",
        image_caption: "다양한 길이 단위를 한눈에 볼 수 있는 측정 도구 이미지",
        published_at: "2026-04-17 11:30:00",
        content: `
<h2>길이 단위 변환, 더 이상 고민하지 마세요</h2>
<p>일상생활이나 업무 중에 mm를 inch로, 혹은 m를 feet로 바꿔야 하는 순간이 자주 발생합니다. 특히 해외 직구를 하거나 인테리어 치수를 잴 때 단위가 다르면 당황스럽기 마련이죠.</p>

<h3>1. 주요 길이 단위 한눈에 보기</h3>
<ul>
    <li><b>1 cm</b> = 10 mm</li>
    <li><b>1 m</b> = 100 cm</li>
    <li><b>1 inch</b> = 2.54 cm</li>
    <li><b>1 feet</b> = 30.48 cm (12 inch)</li>
</ul>

<h3>2. 3초 만에 변환하는 꿀팁</h3>
<p>가장 빠른 방법은 복잡한 수식을 외우는 대신 <b>클릭툴스 길이 변환기</b>를 사용하는 것입니다. 수치만 입력하면 미터법과 영미 단위를 동시에 계산해 주어 실수를 방지할 수 있습니다.</p>

<div class="bg-blue-50 p-6 rounded-xl my-8 border-l-4 border-blue-500">
    <p class="font-bold text-blue-800">💡 전문가의 조언</p>
    <p class="text-blue-700">도면 작업이나 정밀한 설계가 필요할 때는 소수점 2자리까지 정확하게 계산되는 툴을 사용하는 것이 필수적입니다.</p>
</div>
        `
    },
    {
        slug: "image-resizing-and-aspect-ratio",
        title: "이미지 비율 틀리면 망합니다… 깨짐 없이 리사이징하는 방법",
        excerpt: "웹사이트나 SNS에 올릴 때 이미지가 깨지거나 늘어나 보인다면? 원본 비율을 유지하며 완벽하게 리사이징하는 꿀팁을 공개합니다.",
        category: "디자인 팁",
        thumbnail: "/uploads/blog/aspect_ratio_thumb.png",
        image_alt: "이미지 리사이징 인터페이스",
        image_caption: "비율 유지 기능을 강조한 이미지 편집 화면",
        published_at: "2026-04-17 15:00:00",
        content: `
<h2>비율이 깨진 이미지는 신뢰도를 떨어뜨립니다</h2>
<p>공들여 찍은 사진을 웹사이트에 올렸는데, 좌우로 늘어나 보이거나 화질이 심하게 저하된 적이 있나요? 이는 원본 이미지의 종횡비(Aspect Ratio)를 고려하지 않고 크기만 조절했기 때문입니다.</p>

<h3>1. 종횡비(Aspect Ratio)란?</h3>
<p>이미지의 가로와 세로 길의 비율을 말합니다. 대부분의 스마트폰 사진은 4:3, DSLR은 3:2, 영상용은 16:9 비율을 사용합니다. 리사이징 시 이 비율을 고정(Lock)하는 것이 가장 중요합니다.</p>

<h3>2. 깨짐 없는 리사이징 단계</h3>
<ol>
    <li>원본 이미지의 해상도를 확인합니다.</li>
    <li>필요한 가로 폭(Width)을 먼저 결정합니다.</li>
    <li>비율 고정 기능을 켜고 세로 높이가 자동으로 계산되게 합니다.</li>
    <li>저장 시 웹용(WebP 또는 JPG 최적화)으로 출력합니다.</li>
</ol>

<p>클릭툴스의 <b>이미지 리사이저</b>는 원본 비율을 완벽하게 보존하면서도 단 몇 초 만에 원하는 크기로 변경해 줍니다.</p>
        `
    },
    {
        slug: "why-you-should-convert-jpg-to-pdf",
        title: "JPG를 PDF로 안 바꾸면 손해 보는 이유 (모르는 사람 많음)",
        excerpt: "여러 장의 사진을 하나의 문서로 정리하고 보안까지 챙기는 방법! JPG를 PDF로 변환했을 때 얻는 3가지 이점을 알아보세요.",
        category: "업무 팁",
        thumbnail: "/uploads/blog/jpg_to_pdf_thumb.png",
        image_alt: "JPG에서 PDF로 변환되는 과정",
        image_caption: "여러 이미지 파일이 하나의 PDF 문서로 합쳐지는 시각적 표현",
        published_at: "2026-04-18 10:00:00",
        content: `
<h2>단순한 이미지 파일, 왜 PDF로 보내야 할까요?</h2>
<p>업무용 보고서나 증빙 서류를 보낼 때 사진 파일을 그대로 전송하는 경우가 많습니다. 하지만 전문가들은 반드시 JPG를 PDF로 변환해서 보낼 것을 권장합니다.</p>

<h3>1. 가독성과 전문성 향상</h3>
<p>여러 개의 JPG 파일은 받는 사람이 하나하나 열어봐야 하는 번거로움이 있습니다. 이를 하나의 PDF로 묶으면 마치 한 권의 책처럼 정돈된 느낌을 주며 가독성이 극대화됩니다.</p>

<h3>2. 파일 크기 최적화 및 보안</h3>
<p>PDF는 텍스트와 이미지를 효율적으로 압축하여 파일 용량을 줄여줍니다. 또한 암호 설정이나 편집 방지 기능을 더할 수 있어 중요한 개인정보가 담긴 서류일수록 PDF 변환이 필수적입니다.</p>

<h3>3. 기기 호환성</h3>
<p>PDF는 어떤 기기, 어떤 운영체제에서 열어도 레이아웃이 무너지지 않습니다. 폰트 깨짐이나 형식 틀어짐 걱정 없이 원본 그대로를 전달할 수 있습니다.</p>
        `
    },
    {
        slug: "shorten-url-increase-click-rate",
        title: "긴 URL 그대로 쓰고 있나요? 클릭률 2배 올리는 방법",
        excerpt: "길고 복잡한 주소는 신뢰도를 떨어뜨립니다. 깔끔한 단축 URL 하나로 마케팅 성과를 극대화하는 비결을 확인해 보세요.",
        category: "마케팅",
        thumbnail: "/uploads/blog/url_shortener_thumb.png",
        image_alt: "단축 URL 클릭률 상승 그래프",
        image_caption: "지저분한 링크와 깔끔한 단축 링크의 비교",
        published_at: "2026-04-18 14:00:00",
        content: `
<h2>지저분한 링크, 고객은 클릭하지 않습니다</h2>
<p>한글이 포함된 링크를 복사하면 <code>%EC%9E%90%EB%8F%99%ED%99%94</code> 같이 엄청나게 길고 복잡한 주소로 변하는 것을 보셨을 겁니다. 이런 링크는 스팸처럼 보일 뿐만 아니라 가독성도 아주 나쁩니다.</p>

<h3>1. 단축 URL을 써야 하는 이유</h3>
<ul>
    <li>서술형 주소를 한 줄로 요약하여 시각적 신뢰를 줍니다.</li>
    <li>SNS 게시물이나 카카오톡 메시지의 글자 수를 절약합니다.</li>
    <li>(클릭툴스 유료 버전 활용 시) 클릭 수와 유입 경로를 추적할 수 있습니다.</li>
</ul>

<h3>2. 마케팅 성과를 올리는 링크 전략</h3>
<p>단순히 줄이는 것에 그치지 말고, 링크 뒤에 마케팅 태그를 붙여도 단축 URL을 통하면 간결함을 유지할 수 있습니다. <b>클릭툴스 URL 단축기</b>를 통해 지금 바로 깔끔한 링크를 만들어 보세요.</p>
        `
    },
    {
        slug: "clean-text-line-breaks-instantly",
        title: "줄 바꿈 그대로 복붙하면 망합니다… 한 번에 정리하는 방법",
        excerpt: "메모장이나 카톡 내용을 복사했을 때 지저분한 줄 바꿈 때문에 고생하셨나요? 클릭 한 번으로 텍스트를 깔끔하게 정렬하는 방법을 소개합니다.",
        category: "업무 팁",
        thumbnail: "/uploads/blog/text_cleaner_thumb.png",
        image_alt: "텍스트 줄 바꿈 정리 도구",
        image_caption: "불필요한 공백과 줄 바꿈이 제거되는 과정",
        published_at: "2026-04-19 10:00:00",
        content: `
<h2>복붙의 고통, 지저분한 줄 바꿈 해결법</h2>
<p>웹사이트의 글을 긁어오거나 메신저 대화 내용을 정리할 때, 중간중간 들어있는 강제 줄 바꿈 때문에 레이아웃이 깨지는 경우가 비일비재합니다. 하나하나 백스페이스로 지우고 계신가요?</p>

<h3>1. 불필요한 공백과 줄 바꿈의 문제점</h3>
<p>워드나 블로그 에디터에 붙여넣었을 때 문맥이 끊기고, 검색 엔진 최적화(SEO)에도 나쁜 영향을 줄 수 있습니다. 깔끔한 텍스트 데이터는 웹 가독성의 기본입니다.</p>

<h3>2. 클릭툴스 텍스트 클리너 활용하기</h3>
<p>클릭툴스의 <b>줄 바꿈 정리 도구</b>를 사용하면 다음과 같은 작업이 한 번에 완료됩니다:</p>
<ul>
    <li>모든 줄 바꿈 제거 후 한 문장으로 만들기</li>
    <li>문단 단위로 자동 정렬</li>
    <li>연속된 공백 제거</li>
</ul>
<p>이제 수작업으로 고생하지 말고 1초 만에 텍스트를 정제하세요.</p>
        `
    },
    {
        slug: "compress-images-for-faster-speed",
        title: "이미지 용량 안 줄이면 속도 느려집니다… 해결 방법 공개",
        excerpt: "고화질은 유지하면서 용량만 쏙! 웹사이트 로딩 속도를 높여주는 이미지 압축 최적화 가이드입니다.",
        category: "가이드",
        thumbnail: "/uploads/blog/image_compression_thumb.png",
        image_alt: "이미지 용량 압축 전후 비교",
        image_caption: "화질 저하 없이 파일 용량만 줄어드는 다이내믹한 표현",
        published_at: "2026-04-19 14:00:00",
        content: `
<h2>웹사이트 속도의 핵심은 이미지 압축입니다</h2>
<p>구글은 페이지 로딩 속도를 검색 순위의 중요한 지표로 삼습니다. 로딩 속도를 늦추는 가장 큰 범인은 바로 '압축되지 않은 고용량 이미지'입니다.</p>

<h3>1. 화질은 살리고 용량은 죽이고</h3>
<p>이미지 압축에는 손실 압축과 무손실 압축이 있습니다. 일반적인 웹용 사진은 눈으로 보기에 차이가 없는 수준에서 데이터만 제거하는 손실 압축 방식을 사용해도 충분합니다.</p>

<h3>2. 최고의 이미지 포맷: WebP</h3>
<p>최근에는 JPG나 PNG보다 압축률이 뛰어난 <b>WebP</b> 형식이 대세입니다. 클릭툴스를 사용하면 기존 이미지를 WebP로 변환하면서 동시에 용량을 최대 90%까지 줄일 수 있습니다.</p>

<p>지금 여러분의 블로그 이미지를 체크해 보세요. 파일 하나가 1MB를 넘는다면 즉시 압축이 필요합니다.</p>
        `
    },
    {
        slug: "video-to-mp3-conversion-benefits",
        title: "영상으로 듣고 있나요? MP3 변환하면 생기는 진짜 차이",
        excerpt: "동영상에서 음원만 추출하고 싶을 때! MP3 변환으로 배터리도 아끼고 편리하게 감상하는 실질적인 혜택을 정리해 드립니다.",
        category: "정보",
        thumbnail: "/uploads/blog/video_to_audio_thumb.png",
        image_alt: "비디오에서 오디오로 변환되는 레이어",
        image_caption: "영상 파일에서 소리 파동이 추출되는 모던한 일러스트",
        published_at: "2026-04-20 10:00:00",
        content: `
<h2>유튜브나 영상 파일, 소리만 따로 관리하세요</h2>
<p>강의 영상이나 음악 영상을 화면 없이 소리로만 듣고 싶을 때가 많습니다. 영상을 그대로 재생하면 배터리 소모가 극심하고 데이터 사용량도 많아집니다.</p>

<h3>1. MP3 변환 시 얻는 이점</h3>
<ul>
    <li><b>배터리 절약:</b> 화면 출력이 없으므로 스마트폰 사용 시간이 대폭 늘어납니다.</li>
    <li><b>멀티태스킹:</b> 다른 앱을 사용하면서 백그라운드에서 편하게 감상할 수 있습니다.</li>
    <li><b>저장 공간 확보:</b> 기가바이트(GB) 단위의 영상 파일이 메가바이트(MB) 단위의 MP3로 가벼워집니다.</li>
</ul>

<h3>2. 안전하게 변환하는 법</h3>
<p>검색창에 뜨는 의심스러운 웹사이트 대신, 시스템 리소스를 안정적으로 사용하는 <b>클릭툴스 동영상 오디오 추출기</b>를 이용해 보세요. 별도의 설치 없이 브라우저 내에서 안전하게 변환됩니다.</p>
        `
    },
    {
        slug: "accurate-bmi-calculator-guide",
        title: "BMI 계산 틀리면 운동 헛수고 됩니다… 정확한 계산법",
        excerpt: "나의 건강 지표 BMI, 정확하게 알고 계신가요? 올바른 계산법과 수치별 건강 관리 팁을 알려드립니다.",
        category: "건강/라이프",
        thumbnail: "/uploads/blog/bmi_calculator_thumb.png",
        image_alt: "체질량지수(BMI) 측정 지표",
        image_caption: "정상, 과체중, 비만을 나타내는 직관적인 건강 그래프",
        published_at: "2026-04-20 14:00:00",
        content: `
<h2>운동 시작 전, 당신의 BMI부터 체크하세요</h2>
<p>체질량지수(BMI)는 키와 몸무게를 이용하여 지방의 양을 추정하는 지표입니다. 무작정 굶거나 운동하기보다 자신의 정확한 상태를 파악하는 것이 우선입니다.</p>

<h3>1. BMI 계산 공식</h3>
<p style="text-align: center; font-size: 1.25rem;"><b>BMI = 몸무게(kg) ÷ (키(m) × 키(m))</b></p>

<h3>2. 수치별 판정 기준 (한국 기준)</h3>
<ul>
    <li><b>18.5 미만:</b> 저체중</li>
    <li><b>18.5 ~ 22.9:</b> 정상</li>
    <li><b>23 ~ 24.9:</b> 과체중</li>
    <li><b>25 이상:</b> 비만</li>
</ul>

<p>클릭툴스 <b>BMI 계산기</b>는 성별과 연령에 맞춘 더 정밀한 분석 데이터를 제공합니다. 지금 바로 계산해 보고 건강한 루틴을 계획해 보세요.</p>
        `
    },
    {
        slug: "importance-of-16-9-aspect-ratio",
        title: "16:9 이미지 안 쓰면 노출 떨어집니다… 이유 공개",
        excerpt: "유튜브 썸네일부터 카드뉴스까지, 왜 전문가들은 16:9 비율을 고집할까요? 시각적 안정감과 검색 노출의 비밀을 밝힙니다.",
        category: "디자인 팁",
        thumbnail: "/uploads/blog/aspect_ratio_16_9_thumb.png",
        image_alt: "16:9 와이드 스크린 비율 가이드",
        image_caption: "시네마틱한 느낌을 주는 16:9 비율의 시각적 안정성",
        published_at: "2026-04-21 10:00:00",
        content: `
<h2>왜 전 세계는 16:9 비율을 선택했을까?</h2>
<p>HD 방송부터 유튜브, 영화관 스크린까지 가장 널리 쓰이는 비율은 16:9입니다. 이 비율은 인간의 시야각과 가장 유사하여 안정감을 주고 정보를 효과적으로 전달합니다.</p>

<h3>1. 검색 엔진과 플랫폼 최적화</h3>
<p>네이버 블로그, 유튜브, 구글 검색 결과에서 이미지는 주로 가로로 긴 직사각형 형태로 노출됩니다. 16:9 비율을 사용하면 잘리는 부분 없이 메인 이미지를 온전히 보여줄 수 있어 클릭률(CTR)이 상승합니다.</p>

<h3>2. 모바일 친화적인 디자인</h3>
<p>모바일에서도 가로 모드 시 화면을 꽉 채우는 16:9 비율은 뛰어난 몰입감을 제공합니다. 이제 썸네일을 만들 때는 고민하지 말고 16:9로 설정하세요.</p>
        `
    },
    {
        slug: "reasons-people-prefer-pdf-format",
        title: "PDF로 안 보내면 불편합니다… 사람들이 쓰는 진짜 이유",
        excerpt: "폰트가 깨지거나 형식이 틀어지는 문제 해결! 업무 효율을 높여주는 PDF 파일의 필수 기능들을 정리했습니다.",
        category: "업무 팁",
        thumbnail: "/uploads/blog/pdf_benefits_thumb.png",
        image_alt: "보안이 강화된 PDF 문서",
        image_caption: "디지털 문서 표준으로서의 PDF 파일의 신뢰성",
        published_at: "2026-04-21 14:00:00",
        content: `
<h2>디지털 문서의 끝판왕, PDF</h2>
<p>회사에서 견적서나 계약서를 주고받을 때 다른 포맷보다 PDF가 환영받는 데에는 명확한 이유가 있습니다. 업무 효율을 수직 상승시키는 PDF의 매력을 파헤쳐 봅니다.</p>

<h3>1. 수정을 방지하는 신뢰성</h3>
<p>워드나 엑셀은 받는 사람이 실수로 수치를 고칠 위험이 있지만, PDF는 원본 내용이 쉽게 변경되지 않도록 보호할 수 있습니다. 이는 문서의 '무결성'을 보장합니다.</p>

<h3>2. 모든 환경에서의 동일한 결과물</h3>
<p>내 PC에서는 예뻤던 폰트가 상사 PC에서는 깨져 보인다면? PDF는 폰트와 그래픽을 파일 안에 포함시키므로 어디서든 똑같이 보입니다.</p>

<h3>3. 강력한 협업 기능</h3>
<p>주석 달기, 형광펜 표시, 디지털 서명 등 비대면 업무 환경에서 PDF는 대체 불가능한 도구입니다. <b>클릭툴스 PDF 유틸리티</b>를 통해 여러 PDF를 합치고 나누며 스마트하게 업무를 보세요.</p>
        `
    }
];

async function register() {
    for (const post of posts) {
        db.run(
            `INSERT INTO blog_posts (
                slug, title, content, excerpt, category, thumbnail, image_alt, image_caption,
                published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                post.slug, post.title, post.content.trim(), post.excerpt, post.category, 
                post.thumbnail, post.image_alt, post.image_caption, post.published_at
            ],
            (err) => {
                if (err) {
                    console.error(`Error inserting ${post.slug}:`, err.message);
                } else {
                    console.log(`Successfully registered: ${post.slug}`);
                }
            }
        );
    }
    db.close();
}

register();
