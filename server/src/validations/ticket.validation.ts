import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['bug', 'feature', 'improvement']).default('bug'),
  taskId: z.number().positive('Invalid task ID'),
});

export const updateTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  type: z.enum(['bug', 'feature', 'improvement']).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  taskId: z.number().positive('Invalid task ID').optional(),
});