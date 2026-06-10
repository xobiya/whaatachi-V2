import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

import app from '../backend/src/app';
import { initDatabase } from '../backend/src/config/schema';
import { seedData } from '../backend/src/config/seed-data';
import { countUsers } from '../backend/src/models/user.model';

let dbReady: Promise<void> | null = null;
let seeded = false;

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

async function ensureSeeded() {
  if (seeded) return;
  const count = await countUsers();
  if (count === 0) {
    console.log('Database empty, auto-seeding...');
    await seedData(false);
  }
  seeded = true;
}

const handler = async (req: any, res: any) => {
  try {
    await ensureDb();
    await ensureSeeded();
  } catch {
    res.status(500).json({ error: 'Database connection failed' });
    return;
  }
  app(req, res);
};

export default handler;
