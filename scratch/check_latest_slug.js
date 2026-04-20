const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.get('SELECT id, slug, title FROM blog_posts ORDER BY id DESC LIMIT 1', (err, row) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(JSON.stringify(row));
    }
    db.close();
});
