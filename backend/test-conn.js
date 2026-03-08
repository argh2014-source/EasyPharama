const { Pool } = require('pg');
require('dotenv').config();
const dns = require('dns');

// FORCER LA RESOLUTION DNS EN IPV4 POUR CONTOURNER LE BUG WINDOWS "ENOTFOUND"
dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '6543', 10),
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("CONNEXION REUSSIE A SUPABASE DEPUIS LE BACKEND!");
        const res = await client.query('SELECT NOW()');
        console.log("Heure serveur:", res.rows[0]);
        client.release();
    } catch (err) {
        console.error("ERREUR DE CONNEXION:", err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
