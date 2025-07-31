import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  deadline: z.string().datetime().optional().or(z.date().optional()),
  assignedToId: z.coerce.number().positive('Invalid user ID'),
  projectId: z.coerce.number().positive('Invalid project ID').optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  deadline: z.string().datetime().optional().or(z.date().optional()),
  assignedToId: z.coerce.number().positive('Invalid user ID').optional(),
  projectId: z.coerce.number().positive('Invalid project ID').optional(),
});

export type CreateTaskData = z.infer<typeof createTaskSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;