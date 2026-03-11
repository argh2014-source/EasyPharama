import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_easypharma_2026';

export const register = async (req: Request, res: Response) => {
    const { pharmacy_name, first_name, last_name, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
        }

        // 2. Create the Pharmacy tenant
        const newPharmacy = await query(
            'INSERT INTO pharmacies (name) VALUES ($1) RETURNING id',
            [pharmacy_name]
        );
        const pharmacyId = newPharmacy.rows[0].id;

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Create the System Admin user for this pharmacy
        const newUser = await query(
            `INSERT INTO users (pharmacy_id, first_name, last_name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, role`,
            [pharmacyId, first_name, last_name, email, passwordHash, 'SYSTEM_ADMIN']
        );

        res.status(201).json({
            message: 'Pharmacie et utilisateur créés avec succès.',
            user: {
                id: newUser.rows[0].id,
                full_name: `${newUser.rows[0].first_name} ${newUser.rows[0].last_name}`,
                email: newUser.rows[0].email,
                role: newUser.rows[0].role
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Identifiants incorrects.' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Identifiants incorrects.' });
        }

        // Generate JWT
        const payload = {
            id: user.id,
            pharmacy_id: user.pharmacy_id,
            email: user.email,
            role: user.role,
            custom_permissions: user.custom_permissions || {}
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                pharmacy_id: user.pharmacy_id,
                full_name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role,
                custom_permissions: user.custom_permissions || {}
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
};
