const { Router } = require('express');
const { getOverview } = require('./analytics.controller');
const { authenticate, requireRole } = require('../auth/auth.middleware');

const router = Router();
router.get('/overview', authenticate, requireRole('ADMIN'), getOverview);
module.exports = router;
