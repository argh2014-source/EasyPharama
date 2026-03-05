const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'easypharma',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

async function listUsers() {
    try {
        const res = await pool.query('SELECT email, role FROM users');
        console.log('Users found:');
        console.table(res.rows);
    } catch (err) {
        console.error('Error querying users:', err);
    } finally {
        await pool.end();
    }
}

listUsers();
