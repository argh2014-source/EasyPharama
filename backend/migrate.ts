import pool from './src/db';

async function runMigration() {
    try {
        console.log("Connecté à Supabase pour la migration des rôles!");

        console.log("Ajout de la colonne custom_permissions...");
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS custom_permissions JSONB DEFAULT '{}';
        `);
        console.log("Colonne ajoutée avec succès !");

    } catch (err) {
        console.error("Erreur SQL:", err);
    } finally {
        await pool.end();
    }
}

runMigration();
