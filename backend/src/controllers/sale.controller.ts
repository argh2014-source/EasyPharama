import { Request, Response } from 'express';
import pool from '../db';

export const createSale = async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        const userId = (req as any).user?.id;
        const { patient_id, items, total_amount, payment_method, tax_amount, insurance_id, assurance_covered_amount } = req.body;

        if (!pharmacyId || !userId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        await client.query('BEGIN');

        // 1. Create Sale record
        const saleResult = await client.query(
            `INSERT INTO sales (
        pharmacy_id, user_id, patient_id, total_amount, payment_method, 
        tax_amount, insurance_id, assurance_covered_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [pharmacyId, userId, patient_id, total_amount, payment_method, tax_amount || 0, insurance_id, assurance_covered_amount || 0]
        );

        const saleId = saleResult.rows[0].id;

        // 2. Process items and update stock
        for (const item of items) {
            const { medication_id, quantity, unit_price } = item;

            // Add sale item
            await client.query(
                `INSERT INTO sale_items (sale_id, medication_id, quantity, unit_price) 
         VALUES ($1, $2, $3, $4)`,
                [saleId, medication_id, quantity, unit_price]
            );

            // Decrement stock (simplified: taking from oldest batch with stock)
            // In a real scenario, you'd specify batches or use FIFO/FEFO
            await client.query(
                `UPDATE inventory_batches 
         SET current_stock = current_stock - $1 
         WHERE medication_id = $2 AND current_stock >= $1
         AND id = (SELECT id FROM inventory_batches WHERE medication_id = $2 AND current_stock >= $1 ORDER BY expiry_date ASC LIMIT 1)`,
                [quantity, medication_id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ id: saleId, message: 'Vente enregistrée avec succès' });
    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Erreur createSale:', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la vente' });
    } finally {
        client.release();
    }
};

export const getSalesHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        const { rows } = await pool.query(
            `SELECT s.*, u.full_name as user_name, p.full_name as patient_name 
       FROM sales s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN patients p ON s.patient_id = p.id
       WHERE s.pharmacy_id = $1
       ORDER BY s.created_at DESC`,
            [pharmacyId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Erreur getSalesHistory:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des ventes' });
    }
};
