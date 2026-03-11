import { Router } from 'express';
import { authenticateToken, authorizeRoles, requirePermission } from '../middleware/auth.middleware';
import {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
} from '../controllers/medication.controller';

const router = Router();

router.get('/', authenticateToken, requirePermission('medications.read'), getMedications);
router.post('/', authenticateToken, requirePermission('medications.write'), createMedication);
router.put('/:id', authenticateToken, requirePermission('medications.write'), updateMedication);
router.delete('/:id', authenticateToken, authorizeRoles('SYSTEM_ADMIN', 'PHARMACY_ADMIN'), deleteMedication);

export default router;
