import { Request, Response } from 'express';
import pool from '../db';

export const getInventoryHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = req.user?.pharmacyId;
        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        const { rows } = await pool.query(
            `SELECT ib.*, m.name as medication_name 
       FROM inventory_batches ib
       JOIN medications m ON ib.medication_id = m.id
       WHERE m.pharmacy_id = $1
       ORDER BY ib.created_at DESC`,
            [pharmacyId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Erreur getInventoryHistory:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
};

export const addStock = async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();
    try {
        const pharmacyId = req.user?.pharmacyId;
        const { medication_id, batch_number, quantity, expiry_date, supplier_id, buy_price } = req.body;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        await client.query('BEGIN');

        // Verify medication belongs to pharmacy
        const medCheck = await client.query('SELECT id FROM medications WHERE id = $1 AND pharmacy_id = $2', [medication_id, pharmacyId]);
        if (medCheck.rows.length === 0) {
            throw new Error('Médicament non trouvé');
        }

        const newBatch = await client.query(
            `INSERT INTO inventory_batches (
        medication_id, batch_number, quantity, current_stock, expiry_date, supplier_id, buy_price
      ) VALUES ($1, $2, $3, $3, $4, $5, $6) RETURNING *`,
            [medication_id, batch_number, quantity, expiry_date, supplier_id, buy_price]
        );

        await client.query('COMMIT');
        res.status(201).json(newBatch.rows[0]);
    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Erreur addStock:', error);
        res.status(500).json({ error: error.message || 'Erreur lors de l\'ajout de stock' });
    } finally {
        client.release();
    }
};
