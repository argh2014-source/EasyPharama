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
            'SELECT * FROM patients WHERE pharmacy_id = $1 ORDER BY first_name ASC, last_name ASC',
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
        const { first_name, last_name, phone, address, insurance_id } = req.body;

        if (!pharmacyId) {
            res.status(403).json({ error: 'Accès non autorisé' });
            return;
        }

        if (!first_name) {
            res.status(400).json({ error: 'Le prénom est obligatoire' });
            return;
        }

        const newPatient = await pool.query(
            `INSERT INTO patients (
        pharmacy_id, first_name, last_name, phone, address, insurance_id
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [pharmacyId, first_name, last_name, phone, address, insurance_id]
        );

        res.status(201).json(newPatient.rows[0]);
    } catch (error) {
        console.error('Erreur createPatient:', error);
        res.status(500).json({ error: 'Erreur lors de la création du patient' });
    }
};
