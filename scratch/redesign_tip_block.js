const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function redesignTipBlock() {
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

    // Targeted replacement to avoid global style interference
    const oldBlockRegex = /<div style="background-color: #0f172a;[\s\S]*?<\/div>/;
    
    const ultraCompactBlock = `
<div style="background-color: #f0f9ff; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #bae6fd; position: relative; display: flex; align-items: flex-start; gap: 12px;">
   <div style="font-size: 24px; line-height: 1; margin: 0;">💡</div>
   <div style="flex: 1;">
     <div style="color: #0369a1 !important; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; display: block; line-height: 1.2;">전문가의 실무 팁: 공유의 완성</div>
     <div style="color: #0c4a6e !important; font-size: 14px; line-height: 1.6; margin: 0; display: block;">
       정밀 데이터를 공유할 때는 <a href="/tools/url-shortener" style="color: #0284c7 !important; font-weight: 700; text-decoration: underline;">숏URL 생성기</a>를 사용해 보세요. 긴 링크를 깔끔하게 다듬는 것만으로도 전문성이 획기적으로 향상됩니다.
     </div>
   </div>
</div>`;

    if (oldBlockRegex.test(content)) {
        content = content.replace(oldBlockRegex, ultraCompactBlock);
        console.log('Old block replaced with ultra-compact light theme.');
    } else {
        // Fallback
        if (content.includes('<h2>결론:')) {
            content = content.replace('<h2>결론:', ultraCompactBlock + '\n\n<h2>결론:');
        }
    }

    await db.run('UPDATE blog_posts SET content = ? WHERE id = 22', [content]);
    console.log('Tip block successfully redesigned for visibility and size.');
    await db.close();
}

redesignTipBlock().catch(console.error);
