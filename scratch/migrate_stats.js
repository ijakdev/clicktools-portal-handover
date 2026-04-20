const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

async function migrateStats() {
    const db = await open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });

    const jsonPath = path.join(__dirname, '../src/data/stats.json');
    if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        const mappings = {
            'activeUsers': 'stats_active_users',
            'filesConverted': 'stats_files_converted',
            'onlineTools': 'stats_online_tools',
            'pdfsCreated': 'stats_pdfs_created'
        };

        for (const [jsonKey, dbKey] of Object.entries(mappings)) {
            const value = data[jsonKey] || 0;
            await db.run(
                'INSERT INTO global_stats (name, value) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET value = ?',
                [dbKey, value, value]
            );
            console.log(`Migrated ${jsonKey}: ${value} -> ${dbKey}`);
        }
    } else {
        console.log('No stats.json found. Skipping migration.');
    }

    await db.close();
}

migrateStats().catch(console.error);
