import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getPatients, createPatient } from '../controllers/patient.controller';

const router = Router();

router.get('/', authenticateToken, getPatients);
router.post('/', authenticateToken, createPatient);

export default router;
