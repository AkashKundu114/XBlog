import { Router } from 'express';
import { getOverview } from './analytics.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();
router.get('/overview', authenticate, requireRole(Role.ADMIN), getOverview);
export default router;
