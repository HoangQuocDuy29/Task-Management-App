import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendError } from '../utils/response.utils';

export const validate = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessages = result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        
        return sendError(res, 'Validation failed', errorMessages, 400);
      }
      
      // Optional: Replace req.body with validated data
      req.body = result.data;
      next();
    } catch (error: any) {
      return sendError(res, 'Validation error', error.message || 'Invalid input data', 400);
    }
  };
};

// For query parameters
export const validateQuery = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        const errorMessages = result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        
        return sendError(res, 'Query validation failed', errorMessages, 400);
      }
      
      req.query = result.data;
      next();
    } catch (error: any) {
      return sendError(res, 'Query validation error', error.message || 'Invalid query', 400);
    }
  };
};