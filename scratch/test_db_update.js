const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const dummyUrl = 'https://picsum.photos/800/400';
const slug = 'how-to-optimize-images';

db.run(
    `UPDATE blog_posts 
     SET image1 = ?, image1_alt = '테스트 이미지', image1_caption = '렌더링 검증용 캡션',
         content = '본문 시작\n\n{{IMAGE_1}}\n\n본문 끝'
     WHERE slug = ?`,
    [dummyUrl, slug],
    function(err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Updated ${this.changes} row(s)`);
        }
        db.close();
    }
);
