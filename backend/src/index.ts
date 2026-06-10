import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { initDatabase } from './config/schema';

const PORT = process.env.PORT || 3001;

const requiredEnv = ['JWT_SECRET'];
for (const env of requiredEnv) {
  if (!process.env[env]) {
    console.error(`Missing required environment variable: ${env}`);
    process.exit(1);
  }
}

async function start(): Promise<void> {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Whaatachi API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
