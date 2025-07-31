import { z } from 'zod';

export const createLogworkSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  hoursWorked: z.number().positive('Hours worked must be positive'),
  workDate: z.string().datetime().or(z.date()),
  taskId: z.number().positive('Invalid task ID'),
});

export const updateLogworkSchema = z.object({
  description: z.string().min(1, 'Description is required').optional(),
  hoursWorked: z.number().positive('Hours worked must be positive').optional(),
  workDate: z.string().datetime().or(z.date()).optional(),
});