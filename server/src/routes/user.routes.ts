// server/src/routes/ticket.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Admin only routes
router.get('/', requireAdmin, UserController.getAllUsers);
router.post('/', requireAdmin, validate(createUserSchema), UserController.createUser);
router.get('/:id', requireAdmin, UserController.getUserById);
router.put('/:id', requireAdmin, validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', requireAdmin, UserController.deleteUser);
router.patch('/:id/role', requireAdmin, UserController.changeUserRole);

export default router;