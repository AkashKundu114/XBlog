const { Router } = require('express');
const { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require('./categories.controller');
const { authenticate, requireRole } = require('../auth/auth.middleware');

const router = Router();
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', authenticate, requireRole('ADMIN'), createCategory);
router.patch('/:id', authenticate, requireRole('ADMIN'), updateCategory);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteCategory);

module.exports = router;
