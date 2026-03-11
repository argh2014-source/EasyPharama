import pool from './src/db';

async function checkUsers() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT id, email, role, is_active FROM users');
        console.table(result.rows);
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        await pool.end();
    }
}

checkUsers();
