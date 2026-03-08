const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: '52.209.89.87',
    database: process.env.DB_NAME || 'easypharma',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    ssl: {
        rejectUnauthorized: false
    }
});

async function seedSupabase() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const client = await pool.connect();
    try {
        console.log("Connecté à Supabase!");

        // 1. Check or create pharmacy
        let pharmacyId;
        const pharmCheck = await client.query("SELECT id FROM pharmacies WHERE name = 'EasyPharma Centrale'");
        if (pharmCheck.rows.length > 0) {
            pharmacyId = pharmCheck.rows[0].id;
            console.log("Pharmacie déjà existante, ID:", pharmacyId);
        } else {
            const pharmInsert = await client.query(
                "INSERT INTO pharmacies (name) VALUES ('EasyPharma Centrale') RETURNING id"
            );
            pharmacyId = pharmInsert.rows[0].id;
            console.log("Nouvelle pharmacie créée, ID:", pharmacyId);
        }

        // 2. Check if admin exists
        const email = 'admin@easypharma.com';
        const userCheck = await client.query("SELECT id FROM users WHERE email = $1", [email]);

        if (userCheck.rows.length > 0) {
            console.log("L'utilisateur", email, "existe déjà.");
        } else {
            const hash = "$2b$10$/hSeGamD8wYYe8T9Yvx2j.Q4uZHy7yBycNobgvLiGLJt1aCnig7jO";
            await client.query(
                `INSERT INTO users (pharmacy_id, first_name, last_name, email, password_hash, role)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [pharmacyId, 'Admin', 'Système', email, hash, 'SYSTEM_ADMIN']
            );
            console.log("Administrateur créé avec succès ! email:", email, "password: password");
        }
    } catch (err) {
        console.error("Erreur SQL:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedSupabase();
