import { Router } from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth.middleware';
import { getPatients, createPatient } from '../controllers/patient.controller';

const router = Router();

router.get('/', authenticateToken, requirePermission('patients.read'), getPatients);
router.post('/', authenticateToken, requirePermission('patients.write'), createPatient);

export default router;
