import bcrypt from 'bcryptjs';
import pool from './src/db';

async function seedRoleUsers() {
    console.log('--- Création des accès pour chaque rôle ---');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let pharmacyId = 1;
        const pharmacyResult = await client.query('SELECT id FROM pharmacies LIMIT 1');
        if (pharmacyResult.rows.length > 0) {
            pharmacyId = pharmacyResult.rows[0].id;
        } else {
            console.log("Aucune pharmacie trouvée. Création d'une pharmacie par défaut...");
            const newPharm = await client.query(`
                INSERT INTO pharmacies (name, email, phone) 
                VALUES ('Pharmacie Principale', 'contact@pharmacie.com', '0102030405') 
                RETURNING id
            `);
            pharmacyId = newPharm.rows[0].id;
        }

        const usersToCreate = [
            { email: 'admin@easypharma.com', password: 'password123', role: 'SYSTEM_ADMIN', firstName: 'Super', lastName: 'Admin' },
            { email: 'pharmacien@easypharma.com', password: 'password123', role: 'PHARMACIST', firstName: 'Jean', lastName: 'Pharmacien' },
            { email: 'caissier@easypharma.com', password: 'password123', role: 'CASHIER', firstName: 'Marie', lastName: 'Caissière' },
            { email: 'stock@easypharma.com', password: 'password123', role: 'STOCK_MANAGER', firstName: 'Paul', lastName: 'Stock' },
            { email: 'comptable@easypharma.com', password: 'password123', role: 'ACCOUNTANT', firstName: 'Sophie', lastName: 'Comptable' },
        ];

        for (const user of usersToCreate) {
            const existing = await client.query('SELECT id FROM users WHERE email = $1', [user.email]);
            if (existing.rows.length === 0) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await client.query(`
                    INSERT INTO users (first_name, last_name, email, password_hash, role, pharmacy_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [user.firstName, user.lastName, user.email, hashedPassword, user.role, pharmacyId]);
                console.log(`✅ Utilisateur Créé : ${user.role}`);
                console.log(`    Email : ${user.email}`);
                console.log(`    Mot de passe : ${user.password}`);
            } else {
                console.log(`ℹ️ L'utilisateur ${user.email} existe déjà.`);
            }
        }

        await client.query('COMMIT');
        console.log('--- Terminé. Les Identifiants sont désormais dans Supabase ---');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erreur lors de la création :', error);
    } finally {
        client.release();
        await pool.end();
    }
}

seedRoleUsers();
