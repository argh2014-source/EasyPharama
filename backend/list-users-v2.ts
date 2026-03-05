import { query } from './src/db';

async function listUsers() {
    try {
        console.log('Querying users...');
        const res = await query('SELECT email, role FROM users');
        console.log('Users found:');
        console.table(res.rows);
    } catch (err) {
        console.error('Error querying users:', err);
    }
}

listUsers();
