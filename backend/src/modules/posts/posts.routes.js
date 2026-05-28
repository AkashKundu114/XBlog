const { Router } = require('express');
const { getPosts, getPostBySlug, getPostById, createPost, updatePost, deletePost, trackView } = require('./posts.controller');
const { validate } = require('../../shared/middlewares/validate');
const { authenticate, requireRole } = require('../auth/auth.middleware');
const { CreatePostDto, UpdatePostDto, PostQueryDto } = require('./posts.dto');

const router = Router();

// Public routes
router.get('/', validate(PostQueryDto), getPosts);
router.get('/slug/:slug', getPostBySlug);
router.post('/:id/view', trackView);

// Protected routes
router.get('/:id', authenticate, requireRole('ADMIN', 'AUTHOR'), getPostById);
router.post('/', authenticate, requireRole('ADMIN', 'AUTHOR'), validate(CreatePostDto), createPost);
router.patch('/:id', authenticate, requireRole('ADMIN', 'AUTHOR'), validate(UpdatePostDto), updatePost);
router.delete('/:id', authenticate, requireRole('ADMIN'), deletePost);

module.exports = router;
