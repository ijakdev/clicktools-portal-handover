const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function updateLinks() {
    const db = await open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });

    const post = await db.get('SELECT content FROM blog_posts WHERE id = 22');
    if (!post) {
        console.error('Post not found');
        return;
    }

    let content = post.content;

    // Link 1: 단위 변환기
    content = content.replace(
        "'단위 변환기'와 같은 도구",
        "'<a href=\"/tools/smart-calc-box\" class=\"text-blue-600 font-bold hover:underline\">단위 변환기</a>'와 같은 도구"
    );

    // Link 2: 스마트 계산기
    content = content.replace(
        "클릭툴스의 스마트 계산기",
        "<a href=\"/tools/smart-calc-box\" class=\"text-blue-600 font-bold hover:underline\">클릭툴스의 스마트 계산기</a>"
    );

    // Link 3: 숏URL 생성기 (전문가의 추천 블록)
    const recommendationBlock = `
<div class="bg-slate-900 text-white p-8 rounded-3xl my-12 border border-slate-700 shadow-2xl relative overflow-hidden group">
   <div class="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
   <h3 class="text-xl font-black mb-4 flex items-center gap-2 relative z-10">
     <span class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs">TIP</span>
     전문가의 필무 팁: 공유의 완성
   </h3>
   <p class="text-slate-300 text-sm leading-relaxed relative z-10">
     변환된 정밀한 수치나 설계 데이터를 동료에게 공유할 때, <a href="/tools/url-shortener" class="text-blue-400 font-black hover:text-blue-300 transition-colors border-b border-blue-400/30 pb-0.5">숏URL 생성기</a>를 사용해 보세요. 긴 링크를 깔끔하게 다듬는 것만으로도 공유받는 사람의 신뢰도와 전문성이 획기적으로 향상됩니다.
   </p>
</div>`;

    if (!content.includes('전문가의 필무 팁')) {
        content = content.replace('<h2>결론:', recommendationBlock + '\n\n<h2>결론:');
    }

    await db.run('UPDATE blog_posts SET content = ? WHERE id = 22', [content]);
    console.log('Internal links successfully added to post ID 22.');
    await db.close();
}

updateLinks().catch(console.error);
