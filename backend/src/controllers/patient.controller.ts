import { Request, Response } from 'express';
import pool from '../db';

export const getPatients = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        const { rows } = await pool.query(
            'SELECT * FROM patients WHERE pharmacy_id = $1 ORDER BY full_name ASC',
            [pharmacyId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Erreur getPatients:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des patients' });
    }
};

export const createPatient = async (req: Request, res: Response): Promise<void> => {
    try {
        const pharmacyId = (req as any).user?.pharmacy_id;
        const { full_name, phone, email, address, insurance_id, assurance_id_number, insurance_coverage_percent } = req.body;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        if (!full_name) {
            res.status(400).json({ error: 'Le nom est obligatoire' });
            return;
        }

        const newPatient = await pool.query(
            `INSERT INTO patients (
        pharmacy_id, full_name, phone, email, address, 
        insurance_id, assurance_id_number, insurance_coverage_percent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [pharmacyId, full_name, phone, email, address, insurance_id, assurance_id_number, insurance_coverage_percent]
        );

        res.status(201).json(newPatient.rows[0]);
    } catch (error) {
        console.error('Erreur createPatient:', error);
        res.status(500).json({ error: 'Erreur lors de la création du patient' });
    }
};
