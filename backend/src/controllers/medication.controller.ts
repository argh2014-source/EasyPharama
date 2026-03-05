import { Request, Response } from 'express';
import pool from '../db';

export const getMedications = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = req.user?.pharmacyId;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        const { rows } = await pool.query(
            'SELECT * FROM medications WHERE pharmacy_id = $1 ORDER BY name ASC',
            [pharmacyId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Erreur getMedications:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des médicaments' });
    }
};

export const createMedication = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = req.user?.pharmacyId;
        const {
            name, generic_name, form, dosage, barcode,
            unit_price, packaging_unit, category, has_vat
        } = req.body;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        if (!name || unit_price === undefined) {
            res.status(400).json({ error: 'Le nom et le prix unitaire sont obligatoires' });
            return;
        }

        const newMedication = await pool.query(
            `INSERT INTO medications (
        pharmacy_id, name, generic_name, form, dosage, barcode, 
        unit_price, packaging_unit, category, has_vat
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [pharmacyId, name, generic_name, form, dosage, barcode, unit_price, packaging_unit, category, has_vat || false]
        );

        res.status(201).json(newMedication.rows[0]);
    } catch (error) {
        console.error('Erreur createMedication:', error);
        res.status(500).json({ error: 'Erreur lors de la création du médicament' });
    }
};

export const updateMedication = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = req.user?.pharmacyId;
        const { id } = req.params;
        const {
            name, generic_name, form, dosage, barcode,
            unit_price, packaging_unit, category, has_vat
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
        generic_name = COALESCE($2, generic_name),
        form = COALESCE($3, form),
        dosage = COALESCE($4, dosage),
        barcode = COALESCE($5, barcode),
        unit_price = COALESCE($6, unit_price),
        packaging_unit = COALESCE($7, packaging_unit),
        category = COALESCE($8, category),
        has_vat = COALESCE($9, has_vat),
        updated_at = NOW()
      WHERE id = $10 AND pharmacy_id = $11
      RETURNING *
    `;

        const updatedMedication = await pool.query(updateQuery, [
            name, generic_name, form, dosage, barcode, unit_price, packaging_unit, category, has_vat, id, pharmacyId
        ]);

        res.json(updatedMedication.rows[0]);
    } catch (error) {
        console.error('Erreur updateMedication:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du médicament' });
    }
};

export const deleteMedication = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = req.user?.pharmacyId;
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
