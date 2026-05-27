import { Router } from 'express';
import { getMe, getAllUsers, updateMe } from './users.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();
router.get('/me', authenticate, getMe);
router.get('/', authenticate, requireRole(Role.ADMIN), getAllUsers);
router.patch('/me', authenticate, updateMe);
export default router;
