import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (example)
router.get('/me', authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
});

export default router;
