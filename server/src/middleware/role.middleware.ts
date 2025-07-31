import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { sendError } from '../utils/response.utils';

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return sendError(res, 'Admin access required', undefined, 403);
  }
  next();
};

export const requireUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !['admin', 'user'].includes(req.user.role)) {
    return sendError(res, 'User access required', undefined, 403);
  }
  next();
};