import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import paymentRoutes from './routes/payment.routes';
import storyRoutes from './routes/story.routes';
import adminRoutes from './routes/admin.routes';
import articleRoutes from './routes/article.routes';
import faqRoutes from './routes/faq.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('[CORS] method=%s origin=%s path=%s', req.method, origin, req.path);
  const allowed = [
    'https://whaatachi.vercel.app',
    'https://whaatachi.lovable.app',
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : []),
  ];
  if (origin && (allowed.includes(origin) || /\.vercel\.app$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-CORS-Debug', 'manual-middleware-active');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});
app.use(helmet());

app.use(morgan('short'));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

const cacheableRoutes = ['/api/faqs', '/api/articles', '/api/stories'];
app.use((req, res, next) => {
  if (req.method === 'GET' && cacheableRoutes.some(p => req.path.startsWith(p))) {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/faqs', faqRoutes);

app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  res.json({
    status: dbState === 1 ? 'ok' : 'error',
    database: dbStatus[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// In production, serve the built frontend (Vite output in dist/)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
export { seedData } from './config/seed-data';
export { countUsers } from './models/user.model';
