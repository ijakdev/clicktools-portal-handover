const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function fixTipBlock() {
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

    // Replace the old bulky block with a sleek, compact one with forced colors
    const oldBlockRegex = /<div class="bg-slate-900 text-white p-8 rounded-3xl my-12 border border-slate-700 shadow-2xl relative overflow-hidden group">[\s\S]*?<\/div>/;
    
    const compactBlock = `
<div style="background-color: #0f172a; padding: 24px; border-radius: 16px; margin: 32px 0; border: 1px solid #1e293b; position: relative; overflow: hidden;">
   <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
     <div style="width: 4px; height: 20px; background-color: #3b82f6; border-radius: 99px;"></div>
     <h3 style="color: #ffffff !important; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 !important;">💡 전문가의 실무 팁: 공유의 완성</h3>
   </div>
   <p style="color: #cbd5e1 !important; font-size: 14px; line-height: 1.6; margin: 0 !important;">
     정밀한 데이터를 동료에게 공유할 때는 <a href="/tools/url-shortener" style="color: #60a5fa !important; font-weight: 700; text-decoration: underline;">숏URL 생성기</a>를 사용해 보세요. 긴 링크를 깔끔하게 다듬는 것만으로도 공유받는 사람의 신뢰도를 획기적으로 향상시킬 수 있습니다.
   </p>
</div>`;

    if (oldBlockRegex.test(content)) {
        content = content.replace(oldBlockRegex, compactBlock);
        console.log('Old block found and replaced.');
    } else {
        console.log('Old block not found as expected, attempting insertion before Conclusion.');
        // Fallback in case the exact string match fails
        if (content.includes('<h2>결론:')) {
            content = content.replace('<h2>결론:', compactBlock + '\n\n<h2>결론:');
        }
    }

    await db.run('UPDATE blog_posts SET content = ? WHERE id = 22', [content]);
    console.log('Tip block successfully refined for post ID 22.');
    await db.close();
}

fixTipBlock().catch(console.error);
