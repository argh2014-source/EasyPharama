import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const pharmacyId = req.user?.pharmacy_id;
        const result = await query(
            'SELECT id, first_name, last_name, email, role, is_active, custom_permissions, created_at FROM users WHERE pharmacy_id = $1 ORDER BY created_at DESC',
            [pharmacyId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('getUsers error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
};

export const createUser = async (req: AuthRequest, res: Response) => {
    const { first_name, last_name, email, password, role } = req.body;
    const pharmacyId = req.user?.pharmacy_id;

    try {
        const userExists = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await query(
            `INSERT INTO users (pharmacy_id, first_name, last_name, email, password_hash, role) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, role, is_active`,
            [pharmacyId, first_name, last_name, email, passwordHash, role]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error('createUser error:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const pharmacyId = req.user?.pharmacy_id;

    try {
        // Prevent changing own role or super admin role unless handled specifically
        if (parseInt(id as string, 10) === req.user?.id) {
            return res.status(400).json({ error: 'Vous ne pouvez pas modifier votre propre rôle ici.' });
        }

        const result = await query(
            'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND pharmacy_id = $3 RETURNING id, role',
            [role, id, pharmacyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.json({ message: 'Rôle mis à jour avec succès.', user: result.rows[0] });
    } catch (error) {
        console.error('updateUserRole error:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle.' });
    }
};

export const updateUserPermissions = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { custom_permissions } = req.body;
    const pharmacyId = req.user?.pharmacy_id;

    try {
        const result = await query(
            'UPDATE users SET custom_permissions = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND pharmacy_id = $3 RETURNING id, custom_permissions',
            [custom_permissions, id, pharmacyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.json({ message: 'Permissions personnalisées mises à jour.', user: result.rows[0] });
    } catch (error) {
        console.error('updateUserPermissions error:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour des permissions.' });
    }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const pharmacyId = req.user?.pharmacy_id;

    try {
        if (parseInt(id as string, 10) === req.user?.id) {
            return res.status(400).json({ error: 'Vous ne pouvez pas désactiver votre propre compte.' });
        }

        // Toggle the is_active Boolean
        const result = await query(
            'UPDATE users SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND pharmacy_id = $2 RETURNING id, is_active',
            [id, pharmacyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.json({ message: 'Statut mis à jour.', user: result.rows[0] });
    } catch (error) {
        console.error('toggleUserStatus error:', error);
        res.status(500).json({ error: 'Erreur lors de la modification du statut.' });
    }
};
