const fs = require('fs');
const path = require('path');
const pool = require('./db');

const initDb = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        await pool.query(sql);
        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database', error);
        process.exit(1);
    }
};

initDb();
