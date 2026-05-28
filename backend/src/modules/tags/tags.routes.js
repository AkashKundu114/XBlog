const { Router } = require('express');
const { getTags, createTag, updateTag, deleteTag } = require('./tags.controller');
const { authenticate, requireRole } = require('../auth/auth.middleware');

const router = Router();
router.get('/', getTags);
router.post('/', authenticate, requireRole('ADMIN'), createTag);
router.patch('/:id', authenticate, requireRole('ADMIN'), updateTag);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteTag);
module.exports = router;
