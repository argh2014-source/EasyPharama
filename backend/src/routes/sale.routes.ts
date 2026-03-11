import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth.middleware';
import { createSale, getSalesHistory } from '../controllers/sale.controller';

const router = Router();

router.post('/', authenticateToken, requirePermission('sales.write'), createSale);
router.get('/', authenticateToken, requirePermission('sales.read'), getSalesHistory);

export default router;
