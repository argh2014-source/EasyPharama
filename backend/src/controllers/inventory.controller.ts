import { Request, Response } from 'express';
import pool from '../db';

export const getInventoryHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        const { rows } = await pool.query(
            `SELECT ib.*, m.name as medication_name 
       FROM inventory_batches ib
       JOIN medications m ON ib.medication_id = m.id
       WHERE m.pharmacy_id = $1
       ORDER BY ib.received_date DESC`,
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
        const pharmacyId = (req as any).user?.pharmacy_id;
        const { medication_id, batch_number, quantity, expiration_date } = req.body;

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
        medication_id, batch_number, quantity, expiration_date
      ) VALUES ($1, $2, $3, $4) RETURNING *`,
            [medication_id, batch_number, quantity, expiration_date]
        );

        // Update main medication stock count
        await client.query(
            'UPDATE medications SET stock_quantity = stock_quantity + $1 WHERE id = $2',
            [quantity, medication_id]
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
