import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return sendError(res, 'Validation Error', err.message, 400);
  }

  if (err.code === 11000) {
    return sendError(res, 'Duplicate field value', 'Resource already exists', 409);
  }

  return sendError(
    res,
    'Internal Server Error',
    process.env.NODE_ENV === 'development' ? err.message : undefined,
    500
  );
};