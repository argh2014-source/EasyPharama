const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'easypharma',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

async function resetAdminPassword() {
    try {
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const email = 'admin@easypharma.com';

        const res = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id',
            [passwordHash, email]
        );

        if (res.rowCount > 0) {
            console.log(`Le mot de passe de ${email} a été réinitialisé à '${password}' avec succès.`);
        } else {
            console.log(`Utilisateur ${email} non trouvé.`);
        }

    } catch (err) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', err);
    } finally {
        await pool.end();
    }
}

resetAdminPassword();
