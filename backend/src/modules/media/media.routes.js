const { Router } = require('express');
const multer = require('multer');
const { uploadImage, deleteImage, getSignedParams } = require('./media.controller');
const { authenticate, requireRole } = require('../auth/auth.middleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

router.use(authenticate, requireRole('ADMIN', 'AUTHOR'));
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/', deleteImage);
router.get('/sign', getSignedParams);
module.exports = router;
