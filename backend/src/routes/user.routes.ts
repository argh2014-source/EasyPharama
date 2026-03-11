import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import {
    getUsers,
    createUser,
    updateUserRole,
    updateUserPermissions,
    toggleUserStatus
} from '../controllers/user.controller';

const router = Router();

// Only Admins can access user management
router.use(authenticateToken, authorizeRoles('SYSTEM_ADMIN', 'PHARMACY_ADMIN'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id/role', updateUserRole);
router.put('/:id/permissions', updateUserPermissions);
router.patch('/:id/status', toggleUserStatus); // Activate/Deactivate user

export default router;
