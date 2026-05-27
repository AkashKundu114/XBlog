import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { authService } from './auth.service';
import { ApiError } from '../../shared/utils/ApiError';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No token provided'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = authService.verifyAccessToken(token);
    req.user = { id: payload.userId, email: payload.email, role: payload.role as Role, name: payload.name };
    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden('Insufficient permissions'));
    next();
  };
};
