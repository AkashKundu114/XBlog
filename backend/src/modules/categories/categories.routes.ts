import { Router } from 'express';
import { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } from './categories.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', authenticate, requireRole(Role.ADMIN), createCategory);
router.patch('/:id', authenticate, requireRole(Role.ADMIN), updateCategory);
router.delete('/:id', authenticate, requireRole(Role.ADMIN), deleteCategory);

export default router;
