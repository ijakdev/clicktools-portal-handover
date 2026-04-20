const { initDb } = require('../config/db');
const bcrypt = require('bcryptjs');

async function createOAuthUser(provider, providerId, email) {
    const db = await initDb();
    const result = await db.run(
        'INSERT INTO users (provider, provider_id, email, password) VALUES (?, ?, ?, ?)',
        [provider, providerId, email, '']
    );
    return { id: result.lastID, provider, providerId, email };
}

async function getUserByProviderId(provider, providerId) {
    const db = await initDb();
    return await db.get('SELECT * FROM users WHERE provider = ? AND provider_id = ?', [provider, providerId]);
}

async function createUser(email, password) {
    const db = await initDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
    );
    return { id: result.lastID, email };
}

async function getUserByEmail(email) {
    const db = await initDb();
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
}

async function getUserById(id) {
    const db = await initDb();
    return await db.get('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
}

module.exports = {
    createUser,
    createOAuthUser,
    getUserByEmail,
    getUserByProviderId,
    getUserById
};
