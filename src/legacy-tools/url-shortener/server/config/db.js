const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function initDb() {
    if (dbInstance) return dbInstance;

    try {
        dbInstance = await open({
            filename: path.join(__dirname, '../../database/database.sqlite'),
            driver: sqlite3.Database
        });

        console.log('✅ SQLite 연결 성공');

        // 테이블 초기화 후 새로운 스키마 적용 (개발 테스트용)
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                provider TEXT NOT NULL DEFAULT 'local',
                provider_id TEXT UNIQUE,
                password TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS urls(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            short_code TEXT NOT NULL UNIQUE,
            original_url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            click_count INTEGER DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
        );

            CREATE TABLE IF NOT EXISTS click_logs(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            short_code TEXT NOT NULL,
            ip TEXT NOT NULL,
            device TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(short_code) REFERENCES urls(short_code) ON DELETE CASCADE
        );
        `);

        try { await dbInstance.exec(`ALTER TABLE urls ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL; `); } catch (e) { }
        try { await dbInstance.exec(`ALTER TABLE users ADD COLUMN provider TEXT NOT NULL DEFAULT 'local';`); } catch (e) { }
        try { await dbInstance.exec(`ALTER TABLE users ADD COLUMN provider_id TEXT;`); } catch (e) { }
        try { await dbInstance.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider_id);`); } catch (e) { }

        // 기존 테이블에 expires_at 컬럼이 없을 경우 추가 시도 (초기화 대신 안전하게 유지시)
        try {
            await dbInstance.exec(`ALTER TABLE urls ADD COLUMN expires_at DATETIME; `);
        } catch (e) {
            // 이미 존재하면 무시
        }

        return dbInstance;
    } catch (error) {
        console.error('❌ SQLite 연결 오류:', error);
        throw error;
    }
}

module.exports = { initDb };
