const { Router } = require('express');
const { login, refresh, logout, me } = require('./auth.controller');
const { validate } = require('../../shared/middlewares/validate');
const { authenticate } = require('./auth.middleware');
const { authLimiter } = require('../../shared/middlewares/rateLimit');
const { LoginDto, RefreshDto } = require('./auth.dto');

const router = Router();

router.post('/login', authLimiter, validate(LoginDto), login);
router.post('/refresh', validate(RefreshDto), refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

module.exports = router;
