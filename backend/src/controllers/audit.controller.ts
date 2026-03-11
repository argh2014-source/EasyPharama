import { Response } from 'express';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
    const pharmacyId = req.user?.pharmacy_id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
        const result = await query(
            `SELECT a.id, a.action, a.entity_type, a.entity_id, a.details, a.created_at, 
                    u.full_name as user_name, u.role as user_role
             FROM audit_logs a
             LEFT JOIN users u ON a.user_id = u.id
             WHERE a.pharmacy_id = $1
             ORDER BY a.created_at DESC
             LIMIT $2 OFFSET $3`,
            [pharmacyId, limit, offset]
        );

        const countResult = await query(
            'SELECT COUNT(*) FROM audit_logs WHERE pharmacy_id = $1',
            [pharmacyId]
        );
        const totalCount = parseInt(countResult.rows[0].count, 10);

        res.json({
            data: result.rows,
            pagination: {
                total: totalCount,
                limit,
                offset
            }
        });
    } catch (error) {
        console.error('getAuditLogs error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des logs.' });
    }
};
