import { query } from '../db';

export const logAuditUserAction = async (
    userId: number,
    pharmacyId: number,
    action: string,
    entityType: string,
    entityId?: number | null,
    details?: any
) => {
    try {
        await query(
            `INSERT INTO audit_logs (user_id, pharmacy_id, action, entity_type, entity_id, details)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, pharmacyId, action, entityType, entityId || null, details ? JSON.stringify(details) : null]
        );
    } catch (error) {
        console.error('Failed to log audit action:', error);
        // We don't throw to prevent blocking the main business logic if logging fails
    }
};
