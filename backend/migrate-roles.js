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

async function migrateDatabase() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const client = await pool.connect();
    try {
        console.log("Connecté à Supabase pour la migration des rôles!");

        // Ajouter la colonne custom_permissions si elle n'existe pas
        console.log("Ajout de la colonne custom_permissions...");
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS custom_permissions JSONB DEFAULT '{}';
        `);
        console.log("Colonne ajoutée avec succès !");

    } catch (err) {
        console.error("Erreur SQL:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrateDatabase();
