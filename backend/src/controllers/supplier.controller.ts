import { Request, Response } from 'express';
import pool from '../db';

export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        const { rows } = await pool.query(
            'SELECT * FROM suppliers WHERE pharmacy_id = $1 ORDER BY name ASC',
            [pharmacyId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Erreur getSuppliers:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des fournisseurs' });
    }
};

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        const { name, contact_person, phone, email, address } = req.body;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        const newSupplier = await pool.query(
            `INSERT INTO suppliers (pharmacy_id, name, contact_person, phone, email, address) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [pharmacyId, name, contact_person, phone, email, address]
        );

        res.status(201).json(newSupplier.rows[0]);
    } catch (error) {
        console.error('Erreur createSupplier:', error);
        res.status(500).json({ error: 'Erreur lors de la création du fournisseur' });
    }
};
