// server/src/routes/task.routes.ts
import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin, requireUser } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Mixed access routes
router.get('/', requireUser, TaskController.getAllTasks); // Admin: all tasks, User: own tasks
router.get('/:id', requireUser, TaskController.getTaskById); // Admin: any task, User: own task only

// Admin only routes
router.post('/', requireAdmin, validate(createTaskSchema), TaskController.createTask);
router.put('/:id', requireAdmin, validate(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', requireAdmin, TaskController.deleteTask);

// User-specific tasks
router.get('/user/:userId', requireUser, TaskController.getUserTasks);

export default router;