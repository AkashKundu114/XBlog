import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { corsOptions } from './config/cors';
import { env } from './config/env';
import { generalLimiter } from './shared/middlewares/rateLimit';
import { errorHandler } from './shared/middlewares/errorHandler';

import authRoutes from './modules/auth/auth.routes';
import postsRoutes from './modules/posts/posts.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import tagsRoutes from './modules/tags/tags.routes';
import usersRoutes from './modules/users/users.routes';
import mediaRoutes from './modules/media/media.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import searchRoutes from './modules/search/search.routes';

const app = express();

// Security & compression
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
