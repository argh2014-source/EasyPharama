import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getSuppliers, createSupplier } from '../controllers/supplier.controller';

const router = Router();

router.get('/', authenticateToken, getSuppliers);
router.post('/', authenticateToken, createSupplier);

export default router;
