import { Router } from 'express';
import { getPosts, getPostBySlug, getPostById, createPost, updatePost, deletePost, trackView } from './posts.controller';
import { validate } from '../../shared/middlewares/validate';
import { authenticate, requireRole } from '../auth/auth.middleware';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './posts.dto';
import { Role } from '@prisma/client';

const router = Router();

// Public
router.get('/', validate(PostQueryDto), getPosts);
router.get('/slug/:slug', getPostBySlug);

// Protected
router.post('/:id/view', trackView);
router.get('/:id', authenticate, requireRole(Role.ADMIN, Role.AUTHOR), getPostById);
router.post('/', authenticate, requireRole(Role.ADMIN, Role.AUTHOR), validate(CreatePostDto), createPost);
router.patch('/:id', authenticate, requireRole(Role.ADMIN, Role.AUTHOR), validate(UpdatePostDto), updatePost);
router.delete('/:id', authenticate, requireRole(Role.ADMIN), deletePost);

export default router;
