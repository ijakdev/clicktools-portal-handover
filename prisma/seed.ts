import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const BLOG_POSTS = [
    {
        slug: 'how-to-optimize-images',
        title: '이미지 최적화로 웹사이트 로딩 속도 2배 빨라지게 하는 법',
        excerpt: '고화질 이미지를 유지하면서도 용량을 90%까지 줄이는 비결을 공개합니다.',
        category: '가이드',
        thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&auto=format&fit=crop',
        content: `모든 웹사이트와 소셜 미디어 운영자들에게 가장 큰 고민 중 하나는 바로 '이미지 용량'입니다. 고화질의 아름다운 이미지를 보여주고 싶지만, 너무 큰 파일은 페이지 로딩 속도를 늦추고 사용자 경험(UX)을 저해하기 때문입니다.

<h2>1. 이미지 최적화란 무엇인가요?</h2>
이미지 최적화는 이미지의 시각적 품질을 최대한 유지하면서 파일의 데이터 크기를 최소화하는 과정입니다. 이는 압축 알고리즘을 사용하거나, 더 효율적인 파일 포맷(예: WebP)으로 변환함으로써 달성할 수 있습니다.

<h2>2. 왜 클릭툴스를 사용해야 하죠?</h2>
시중에는 많은 유틸리티가 있지만, 클릭툴스는 별도의 회원가입이나 소프트웨어 설치 없이 브라우저에서 즉각적인 처리를 지원합니다. 특히 클라이언트 사이드 기술을 사용하여 업로드된 이미지가 외부 서버로 전송되지 않고도 압축될 수 있어 보안 면에서도 매우 우수합니다.

<div class="bg-slate-900 text-white p-8 rounded-3xl my-12">
   <h3 class="text-xl font-bold mb-4">💡 전문가의 팁</h3>
   <p class="text-slate-300 text-sm">
     블로그에 이미지를 업로드할 때는 가로 폭을 1200px 이하로 맞추고 WebP 포맷을 사용해 보세요. 기존 JPG 대비 용량을 절반 이상 줄이면서도 선명한 화질을 유지할 수 있습니다.
   </p>
</div>`,
    },
    {
        slug: 'pdf-merge-guide',
        title: '번거로운 PDF 합치기, 프로그램 설치 없이 10초 만에 끝내기',
        excerpt: '여러 개의 PDF 문서를 하나로 병합하는 가장 안전하고 빠른 방법을 소개합니다.',
        category: '업무 팁',
        thumbnail: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=400&auto=format&fit=crop',
        content: `업무를 하다 보면 여러 개의 PDF 파일을 하나로 합쳐야 할 때가 많습니다. 하지만 유료 소프트웨어를 설치하거나 복잡한 설정을 하는 것은 번거롭고 시간이 오래 걸립니다.

<h2>온라인에서 10초 만에 PDF 합치기</h2>
클릭툴스 PDF 유틸리티를 사용하면 드래그 앤 드롭만으로 여러 문서를 즉시 결합할 수 있습니다.

<h3>주요 특징:</h3>
<ul>
  <li>파일 순서 자유 조절</li>
  <li>압축 최적화 지원</li>
  <li>완전 무료 및 브라우저 처리</li>
</ul>`,
    },
    {
        slug: 'qr-marketing-strategy',
        title: '오프라인 매장 매출 올리는 QR 코드 마케팅 활용 사례 5가지',
        excerpt: '메뉴판부터 이벤트 참여까지, QR 코드를 활용한 스마트한 고객 유치 전략을 알아보세요.',
        category: '마케팅',
        thumbnail: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=400&auto=format&fit=crop',
        content: `QR 코드는 이제 단순한 정보 전달을 넘어 강력한 마케팅 도구가 되었습니다.

<h2>오프라인 매장의 디지털 전환</h2>
매장에서 고객의 스마트폰을 활용해 더 깊은 상호작용을 유도할 수 있습니다.

<h3>활용 사례:</h3>
1. 디지털 메뉴판 연결
2. 네이버/구글 리뷰 작성 유도
3. 카카오톡 플러스친구 추가
4. 할인 쿠폰 즉시 발송
5. 와이파이 간편 연결`,
    },
];

async function main() {
    // 1. 관리자 계정
    const adminExists = await prisma.adminUser.findUnique({ where: { username: 'admin' } });
    if (!adminExists) {
        const passwordHash = await bcrypt.hash('clicktools2026!', 10);
        await prisma.adminUser.create({
            data: { username: 'admin', passwordHash },
        });
        console.log('✅ Admin account seeded: admin / clicktools2026!');
    }

    // 2. 블로그 포스트
    const postCount = await prisma.blogPost.count();
    if (postCount === 0) {
        await prisma.blogPost.createMany({ data: BLOG_POSTS });
        console.log(`✅ ${BLOG_POSTS.length} blog posts seeded.`);
    }

    // 3. URL Shortener 상시 누적 카운터
    const creationStat = await prisma.globalStat.findUnique({
        where: { name: 'url_shortener_total_creations' },
    });
    if (!creationStat) {
        const urlCount = await prisma.url.count();
        await prisma.globalStat.create({
            data: { name: 'url_shortener_total_creations', value: urlCount },
        });
        console.log('✅ URL Shortener total creations counter initialized.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
