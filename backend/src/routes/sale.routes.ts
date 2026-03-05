import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { createSale, getSalesHistory } from '../controllers/sale.controller';

const router = Router();

router.post('/', authenticateToken, createSale);
router.get('/', authenticateToken, getSalesHistory);

export default router;
