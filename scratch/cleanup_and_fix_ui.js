const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function cleanAndFixUI() {
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

    // Remove any legacy Tip blocks (dark or light) and accidental leftovers
    // We'll search for the segment between the last FAQ and the Conclusion header
    const faqEndPart = '동일한 품질을 보장합니다.\n\n';
    const conclusionStart = '\n\n<h2>결론:';
    
    const startIndex = content.indexOf(faqEndPart);
    const endIndex = content.indexOf(conclusionStart);

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const prefix = content.substring(0, startIndex + faqEndPart.length);
        const suffix = content.substring(endIndex);
        
        const finalCompactBlock = `
<div style="background-color: #f0f9ff; padding: 18px 24px; border-radius: 12px; margin: 20px 0; border: 1px solid #bae6fd; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
   <div style="font-size: 22px; line-height: 1;">💡</div>
   <div style="flex: 1;">
     <span style="color: #0369a1 !important; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">전문가의 실무 팁: 공유의 완성</span>
     <span style="color: #0c4a6e !important; font-size: 14px; line-height: 1.5; display: block;">
       정밀 데이터를 공유할 때는 <a href="/tools/url-shortener" style="color: #0284c7 !important; font-weight: 700; text-decoration: underline;">숏URL 생성기</a>를 사용해 보세요. 전문성이 획기적으로 향상됩니다.
     </span>
   </div>
</div>`;
        
        content = prefix + finalCompactBlock + suffix;
        console.log('Content cleaned and final compact block inserted.');
    } else {
        console.log('Could not find anchor points for cleaning. Current content state might be different.');
    }

    await db.run('UPDATE blog_posts SET content = ? WHERE id = 22', [content]);
    console.log('Final UI cleanup and refinement complete.');
    await db.close();
}

cleanAndFixUI().catch(console.error);
