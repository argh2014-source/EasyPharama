const { Pool } = require('pg');
require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("CONNEXION REUSSIE VIA DATABASE_URL!");
        client.release();
    } catch (err) {
        console.error("ERREUR:", err.message);
    } finally {
        await pool.end();
    }
}
testConnection();
