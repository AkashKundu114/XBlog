import { Router } from 'express';
import { login, refresh, logout, me } from './auth.controller';
import { validate } from '../../shared/middlewares/validate';
import { authenticate } from './auth.middleware';
import { authLimiter } from '../../shared/middlewares/rateLimit';
import { LoginDto, RefreshDto } from './auth.dto';

const router = Router();

router.post('/login', authLimiter, validate(LoginDto), login);
router.post('/refresh', validate(RefreshDto), refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
