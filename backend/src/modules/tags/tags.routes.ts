import { Router } from 'express';
import { getTags, createTag, updateTag, deleteTag } from './tags.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();
router.get('/', getTags);
router.post('/', authenticate, requireRole(Role.ADMIN), createTag);
router.patch('/:id', authenticate, requireRole(Role.ADMIN), updateTag);
router.delete('/:id', authenticate, requireRole(Role.ADMIN), deleteTag);
export default router;
