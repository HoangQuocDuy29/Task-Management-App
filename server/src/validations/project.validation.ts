import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  assignedUserIds: z.array(z.number().positive()).optional().default([]),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().optional(),
  assignedUserIds: z.array(z.number().positive()).optional(),
});