// server/src/routes/logwork.routes.ts
import { Router } from 'express';
import { LogworkController } from '../controllers/LogworkController';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireUser } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import { createLogworkSchema, updateLogworkSchema } from '../validations/logwork.validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken, requireUser);

router.get('/', LogworkController.getAllLogwork); // Admin: all, User: own only
router.post('/', validate(createLogworkSchema), LogworkController.createLogwork);
router.get('/:id', LogworkController.getLogworkById);
router.put('/:id', validate(updateLogworkSchema), LogworkController.updateLogwork);
router.delete('/:id', LogworkController.deleteLogwork);

export default router;