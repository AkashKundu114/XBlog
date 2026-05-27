import { Router } from 'express';
import multer from 'multer';
import { uploadImage, deleteImage, getSignedParams } from './media.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

router.use(authenticate, requireRole(Role.ADMIN, Role.AUTHOR));
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/', deleteImage);
router.get('/sign', getSignedParams);
export default router;
