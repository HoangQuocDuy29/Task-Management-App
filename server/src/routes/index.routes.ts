// server/src/routes/index.routes.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import taskRoutes from './task.routes';
import projectRoutes from './project.routes';
import ticketRoutes from './ticket.routes';
import logworkRoutes from './logwork.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);
router.use('/tickets', ticketRoutes);
router.use('/logwork', logworkRoutes);

router.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

export default router;