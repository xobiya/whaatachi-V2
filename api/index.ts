import dotenv from 'dotenv';
dotenv.config();

import app from '../backend/src/app';
import { initDatabase } from '../backend/src/config/schema';

let dbReady: Promise<void> | null = null;

async function ensureDb() {
  if (!dbReady) {
    dbReady = initDatabase().catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      dbReady = null;
      throw err;
    });
  }
  return dbReady;
}

const handler = async (req: any, res: any) => {
  try {
    await ensureDb();
  } catch {
    res.status(500).json({ error: 'Database connection failed' });
    return;
  }
  app(req, res);
};

export default handler;
