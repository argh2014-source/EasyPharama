import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
} from '../controllers/medication.controller';

const router = Router();

// Routes for medications
// Note: Some roles might be adjusted later. Currently letting admins and managers do CRUD.
router.get('/', authenticateToken, authorizeRoles('SYSTEM_ADMIN', 'PHARMACY_ADMIN', 'PHARMACIST', 'CASHIER'), getMedications);
router.post('/', authenticateToken, authorizeRoles('SYSTEM_ADMIN', 'PHARMACY_ADMIN', 'PHARMACIST', 'STOCK_MANAGER'), createMedication);
router.put('/:id', authenticateToken, authorizeRoles('SYSTEM_ADMIN', 'PHARMACY_ADMIN', 'PHARMACIST', 'STOCK_MANAGER'), updateMedication);
router.delete('/:id', authenticateToken, authorizeRoles('SYSTEM_ADMIN', 'PHARMACY_ADMIN'), deleteMedication);

export default router;
