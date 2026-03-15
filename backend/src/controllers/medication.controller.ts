import { Request, Response } from 'express';
import pool from '../db';

export const getMedications = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        const { search } = req.query;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        let queryStr = 'SELECT * FROM medications WHERE pharmacy_id = $1';
        const queryParams: any[] = [pharmacyId];

        if (search) {
            queryStr += ` AND (
                name ILIKE $2 OR 
                dci ILIKE $2 OR 
                barcode ILIKE $2
            )`;
            queryParams.push(`%${search}%`);
        }

        queryStr += ' ORDER BY name ASC';

        const { rows } = await pool.query(queryStr, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Erreur getMedications:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des médicaments' });
    }
};

export const createMedication = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        const {
            name, dci, dosage_form, dosage, barcode,
            selling_price, purchase_price, manufacturer, supplier_id, category,
            stock_quantity, min_stock_threshold, location
        } = req.body;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        if (!name || selling_price === undefined) {
            res.status(400).json({ error: 'Le nom et le prix de vente sont obligatoires' });
            return;
        }

        const newMedication = await pool.query(
            `INSERT INTO medications (
        pharmacy_id, name, dci, dosage_form, dosage, barcode, 
        selling_price, purchase_price, manufacturer, supplier_id, category,
        stock_quantity, min_stock_threshold, location
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [
                pharmacyId, name, dci, dosage_form, dosage, barcode, 
                selling_price, purchase_price, manufacturer, supplier_id, category,
                stock_quantity || 0, min_stock_threshold || 10, location
            ]
        );

        res.status(201).json(newMedication.rows[0]);
    } catch (error) {
        console.error('Erreur createMedication:', error);
        res.status(500).json({ error: 'Erreur lors de la création du médicament' });
    }
};

export const updateMedication = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        const { id } = req.params;
        const {
            name, dci, dosage_form, dosage, barcode,
            selling_price, purchase_price, manufacturer, supplier_id, category,
            stock_quantity, min_stock_threshold, location
        } = req.body;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        // Checking if the medication belongs to this pharmacy
        const authCheck = await pool.query('SELECT id FROM medications WHERE id = $1 AND pharmacy_id = $2', [id, pharmacyId]);
        if (authCheck.rows.length === 0) {
            res.status(404).json({ error: 'Médicament non trouvé' });
            return;
        }

        const updateQuery = `
      UPDATE medications 
      SET 
        name = COALESCE($1, name),
        dci = COALESCE($2, dci),
        dosage_form = COALESCE($3, dosage_form),
        dosage = COALESCE($4, dosage),
        barcode = COALESCE($5, barcode),
        selling_price = COALESCE($6, selling_price),
        purchase_price = COALESCE($7, purchase_price),
        manufacturer = COALESCE($8, manufacturer),
        supplier_id = COALESCE($9, supplier_id),
        category = COALESCE($10, category),
        stock_quantity = COALESCE($11, stock_quantity),
        min_stock_threshold = COALESCE($12, min_stock_threshold),
        location = COALESCE($13, location),
        updated_at = NOW()
      WHERE id = $14 AND pharmacy_id = $15
      RETURNING *
    `;

        const updatedMedication = await pool.query(updateQuery, [
            name, dci, dosage_form, dosage, barcode, selling_price, purchase_price, 
            manufacturer, supplier_id, category, stock_quantity, min_stock_threshold, location, id, pharmacyId
        ]);

        res.json(updatedMedication.rows[0]);
    } catch (error) {
        console.error('Erreur updateMedication:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du médicament' });
    }
};

export const deleteMedication = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        const { id } = req.params;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        const deleteResult = await pool.query('DELETE FROM medications WHERE id = $1 AND pharmacy_id = $2 RETURNING id', [id, pharmacyId]);

        if (deleteResult.rows.length === 0) {
            res.status(404).json({ error: 'Médicament non trouvé' });
            return;
        }

        res.json({ message: 'Médicament supprimé avec succès' });
    } catch (error) {
        console.error('Erreur deleteMedication:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression du médicament' });
    }
};
