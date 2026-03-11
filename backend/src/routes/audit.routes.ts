import { Router } from 'express';
import { getAuditLogs } from '../controllers/audit.controller';
import { authenticateToken, requirePermission } from '../middleware/auth.middleware';

const router = Router();

// Only Admins or those with explicit 'audit.read' permission can view the logs
router.get('/', authenticateToken, requirePermission('audit.read'), getAuditLogs);

export default router;
