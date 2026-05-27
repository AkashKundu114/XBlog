import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../../config/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(`${err.message} — ${req.method} ${req.path}`);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Prisma unique constraint violation
  if ((err as any).code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Resource already exists' });
  }

  // Prisma record not found
  if ((err as any).code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
