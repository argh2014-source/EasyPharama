import { Request as ExpReq, Response as ExpRes, NextFunction as ExpNext } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_easypharma_2026';

export interface AuthRequest extends ExpReq {
    user?: {
        id: number;
        pharmacy_id: number;
        email: string;
        role: string;
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
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Accès refusé. Permissions insuffisantes.' });
        }
        next();
    };
};
