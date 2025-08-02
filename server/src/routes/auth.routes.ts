// server/src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { requireAdmin } from '../middleware/role.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', validate(loginSchema), AuthController.login);

// Admin only registration
router.post('/register', 
  authenticateToken, 
  requireAdmin, 
  validate(registerSchema), 
  AuthController.register
);

export default router;