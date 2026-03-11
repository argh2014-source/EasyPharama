import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth.middleware';
import { getInventoryHistory, addStock } from '../controllers/inventory.controller';

const router = Router();

router.get('/history', authenticateToken, requirePermission('stock.read'), getInventoryHistory);
router.post('/add', authenticateToken, requirePermission('stock.write'), addStock);

export default router;
