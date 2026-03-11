import { Request as ExpReq, Response as ExpRes, NextFunction as ExpNext } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_easypharma_2026';

export interface AuthRequest extends ExpReq {
    user?: {
        id: number;
        pharmacy_id: number;
        email: string;
        role: string;
        custom_permissions?: Record<string, boolean>;
    };
}

export const authenticateToken = (req: AuthRequest, res: ExpRes, next: ExpNext) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide ou expiré.' });
    }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: ExpRes, next: ExpNext) => {
        if (!req.user || (!allowedRoles.includes(req.user.role) && req.user.role !== 'SYSTEM_ADMIN' && req.user.role !== 'PHARMACY_ADMIN')) {
            return res.status(403).json({ error: 'Accès refusé. Rôle insuffisant.' });
        }
        next();
    };
};

export const requirePermission = (permissionKey: string) => {
    return (req: AuthRequest, res: ExpRes, next: ExpNext) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Non authentifié.' });
        }

        // SYSTEM_ADMIN and PHARMACY_ADMIN have all permissions implicitly
        if (req.user.role === 'SYSTEM_ADMIN' || req.user.role === 'PHARMACY_ADMIN') {
            return next();
        }

        // Check explicit custom overrides for that user
        const customPerms = req.user.custom_permissions || {};
        if (customPerms.hasOwnProperty(permissionKey)) {
            if (customPerms[permissionKey] === true) {
                return next();
            } else {
                return res.status(403).json({ error: `Permission refusée (${permissionKey}).` });
            }
        }

        // Default permission mappings based on roles
        const rolePermissions: Record<string, string[]> = {
            'PHARMACIST': ['medications.read', 'medications.write', 'prescriptions.read', 'prescriptions.write', 'patients.read'],
            'CASHIER': ['sales.read', 'sales.write', 'medications.read'],
            'STOCK_MANAGER': ['stock.read', 'stock.write', 'medications.read', 'suppliers.read', 'suppliers.write'],
            'ACCOUNTANT': ['reports.read', 'sales.read']
        };

        const defaultPerms = rolePermissions[req.user.role] || [];

        if (defaultPerms.includes(permissionKey)) {
            return next();
        }

        return res.status(403).json({ error: `Permission refusée (${permissionKey}). Rôle inadapté.` });
    };
};
