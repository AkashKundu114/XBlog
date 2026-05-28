const { authService } = require('./auth.service');
const { ApiError } = require('../../shared/utils/ApiError');

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No token provided'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = authService.verifyAccessToken(token);
    req.user = { id: payload.userId, email: payload.email, role: payload.role, name: payload.name };
    next();
  } catch (err) {
    next(err);
  }
};

const requireRole = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden('Insufficient permissions'));
    next();
  };
};

module.exports = { authenticate, requireRole };
