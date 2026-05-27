import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../database/client';
import { ApiError } from '../../shared/utils/ApiError';
import { env } from '../../config/env';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export class AuthService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch {
      throw ApiError.unauthorized('Invalid or expired token');
    }
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw ApiError.unauthorized('Invalid email or password');

    const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refresh(token: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Rotate refresh token
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });

    const newRefreshToken = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: stored.userId, expiresAt } });

    const payload: TokenPayload = {
      userId: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
      name: stored.user.name,
    };
    const accessToken = this.generateAccessToken(payload);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(token: string) {
    await prisma.refreshToken.updateMany({
      where: { token, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

export const authService = new AuthService();
