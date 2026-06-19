import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { getPool } from './lib/db';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.set('trust proxy', 1);
app.use((req, res, next) => {
  const origin = req.headers.origin;
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
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});
app.use(helmet());

app.use(morgan('short'));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    const pool = getPool();
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
