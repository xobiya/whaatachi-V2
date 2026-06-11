import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from '../api-src/app';
import { connectDB } from '../api-src/config/database';
import { seedData } from '../api-src/config/seed-data';
import { countUsers } from '../api-src/models/user.model';

let dbReady: Promise<void> | null = null;
let seeded = false;

async function ensureDb() {
  if (!dbReady) {
    dbReady = connectDB().then(() => {
      console.log('Database initialized.');
    }).catch((err) => {
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
