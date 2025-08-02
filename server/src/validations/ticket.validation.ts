// server/src/validations/ticket.validation.ts
import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  taskId: z.number().positive('Invalid task ID'),
  notes: z.string().optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  taskId: z.number().positive('Invalid task ID').optional(),
  notes: z.string().optional(),
  approvedById: z.number().positive('Invalid user ID').optional(),
});
