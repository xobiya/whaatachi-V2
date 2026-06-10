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
  try {
    const count = await countUsers();
    if (count === 0) {
      console.log('Database empty, auto-seeding...');
      await seedData(false);
    }
  } catch (err) {
    console.error('Seed check failed (non-fatal):', err);
  }
  seeded = true;
}

export default async function handler(req: any, res: any) {
  console.log(`[${req.method}] ${req.url}`);

  try {
    await ensureDb();
    await ensureSeeded();
  } catch (err: any) {
    console.error('Handler init error:', err?.message || err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Database connection failed', detail: err?.message }));
    return;
  }

  app(req, res);
}
