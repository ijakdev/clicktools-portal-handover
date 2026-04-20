const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.run('UPDATE blog_posts SET slug = ? WHERE id = 7', ['tools/pdf-utility'], (err) => {
    if (err) console.error(err.message);
    else console.log('Updated to tools/pdf-utility');
    db.close();
});
