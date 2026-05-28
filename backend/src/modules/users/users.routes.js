const { Router } = require('express');
const { getMe, getAllUsers, updateMe } = require('./users.controller');
const { authenticate, requireRole } = require('../auth/auth.middleware');

const router = Router();
router.get('/me', authenticate, getMe);
router.get('/', authenticate, requireRole('ADMIN'), getAllUsers);
router.patch('/me', authenticate, updateMe);
module.exports = router;
