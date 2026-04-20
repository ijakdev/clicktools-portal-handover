const { initDb } = require('../config/db');

async function createUrl(shortCode, originalUrl, expiresAt = null) {
    const db = await initDb();
    const result = await db.run(
        'INSERT INTO urls (short_code, original_url, expires_at) VALUES (?, ?, ?)',
        [shortCode, originalUrl, expiresAt]
    );
    return result;
}

async function getUrlByShortCode(shortCode) {
    const db = await initDb();
    const row = await db.get(
        'SELECT * FROM urls WHERE short_code = ?',
        [shortCode]
    );
    return row;
}

async function incrementClickCount(shortCode) {
    const db = await initDb();
    await db.run(
        'UPDATE urls SET click_count = click_count + 1 WHERE short_code = ?',
        [shortCode]
    );
}

async function logClick(shortCode, ip, device) {
    const db = await initDb();
    await db.run(
        'INSERT INTO click_logs (short_code, ip, device) VALUES (?, ?, ?)',
        [shortCode, ip, device]
    );
}

async function getStats() {
    const db = await initDb();
    const totalUrls = await db.get('SELECT COUNT(*) as count FROM urls');
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayUrls = await db.get('SELECT COUNT(*) as count FROM urls WHERE date(created_at) = date(?)', [todayStr]);
    const totalClicks = await db.get('SELECT SUM(click_count) as sum FROM urls');

    return {
        totalUrls: totalUrls.count || 0,
        todayUrls: todayUrls.count || 0,
        totalClicks: totalClicks.sum || 0
    };
}

async function getUrlsByUserId(userId) {
    const db = await initDb();
    const rows = await db.all(
        'SELECT * FROM urls WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return rows;
}

async function getClickLogsByShortCode(shortCode) {
    const db = await initDb();
    // SQLite query to group clicks by date
    const rows = await db.all(
        `SELECT date(created_at) as date, COUNT(*) as count 
         FROM click_logs 
         WHERE short_code = ? 
         GROUP BY date(created_at) 
         ORDER BY date ASC`,
        [shortCode]
    );
    return rows;
}

async function getUrlsByFilter(filter) {
    const db = await initDb();
    if (filter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        return await db.all('SELECT * FROM urls WHERE date(created_at) = date(?) ORDER BY created_at DESC', [todayStr]);
    } else if (filter === 'clicks') {
        return await db.all('SELECT * FROM urls WHERE click_count > 0 ORDER BY click_count DESC');
    } else { // active or total
        return await db.all('SELECT * FROM urls ORDER BY created_at DESC');
    }
}

module.exports = {
    createUrl,
    getUrlByShortCode,
    incrementClickCount,
    logClick,
    getStats,
    getUrlsByUserId,
    getClickLogsByShortCode,
    getUrlsByFilter
};
