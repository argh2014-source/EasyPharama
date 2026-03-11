import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth.middleware';
import { getSuppliers, createSupplier } from '../controllers/supplier.controller';

const router = Router();

router.get('/', authenticateToken, requirePermission('suppliers.read'), getSuppliers);
router.post('/', authenticateToken, requirePermission('suppliers.write'), createSupplier);

export default router;
