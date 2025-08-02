// server/src/routes/ticket.routes.ts
import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import { createTicketSchema, updateTicketSchema } from '../validations/ticket.validation';

const router = Router();

// All routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.get('/', TicketController.getAllTickets);
router.post('/', validate(createTicketSchema), TicketController.createTicket);
router.get('/:id', TicketController.getTicketById);
router.put('/:id', validate(updateTicketSchema), TicketController.updateTicket);
router.delete('/:id', TicketController.deleteTicket);

export default router;