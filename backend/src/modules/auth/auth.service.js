const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../../database/client');
const { ApiError } = require('../../shared/utils/ApiError');
const { env } = require('../../config/env');

class AuthService {
  generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
  }

  generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch {
      throw ApiError.unauthorized('Invalid or expired token');
    }
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw ApiError.unauthorized('Invalid email or password');

    const payload = { userId: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refresh(token) {
    const stored = await prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });

    const newRefreshToken = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: stored.userId, expiresAt } });

    const payload = { userId: stored.user.id, email: stored.user.email, role: stored.user.role, name: stored.user.name };
    const accessToken = this.generateAccessToken(payload);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(token) {
    await prisma.refreshToken.updateMany({ where: { token, revokedAt: null }, data: { revokedAt: new Date() } });
  }
}

const authService = new AuthService();
module.exports = { authService };
