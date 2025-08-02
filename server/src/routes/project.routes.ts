// server/src/routes/project.routes.ts
import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import { createProjectSchema, updateProjectSchema } from '../validations/project.validation';

const router = Router();

// All routes require authentication and admin role
//router.use(authenticateToken, requireAdmin);

router.get('/', ProjectController.getAllProjects);
router.post('/', validate(createProjectSchema), ProjectController.createProject);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', validate(updateProjectSchema), ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);
router.post('/:id/assign-user', ProjectController.assignUserToProject);

export default router;