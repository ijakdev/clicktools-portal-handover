const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function listPosts() {
    const db = await open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });

    const posts = await db.all('SELECT id, slug, title, created_at, published_at, category FROM blog_posts ORDER BY created_at DESC');
    console.log(JSON.stringify(posts, null, 2));
    await db.close();
}

listPosts().catch(console.error);
