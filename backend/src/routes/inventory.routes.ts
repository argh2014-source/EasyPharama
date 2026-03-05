import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { getInventoryHistory, addStock } from '../controllers/inventory.controller';

const router = Router();

router.get('/history', authenticateToken, getInventoryHistory);
router.post('/add', authenticateToken, authorizeRoles('SYSTEM_ADMIN', 'PHARMACY_ADMIN', 'STOCK_MANAGER'), addStock);

export default router;
