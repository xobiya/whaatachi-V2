import express from 'express';
import mongoose from 'mongoose';
import mainApp, { seedData, countUsers } from './dist/bundle.js';

const app = express();
let seedingDone = false;
let seedingPromise: Promise<void> | null = null;
let connectLock: Promise<void> | null = null;

function ensureSeeded(): void {
  if (seedingDone || seedingPromise) return;
  seedingPromise = countUsers()
    .then(count => { if (count === 0) return seedData(false); })
    .then(() => { seedingDone = true; })
    .catch(err => { console.error('[SEED]', err?.message || err); seedingPromise = null; });
}

async function connectToDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
}

function ensureConnection(): Promise<void> {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (connectLock) return connectLock;
  connectLock = connectToDatabase()
    .then(() => { ensureSeeded(); })
    .catch(err => { connectLock = null; return Promise.reject(err); });
  return connectLock;
}

// Warm up connection immediately on cold start (before first request)
if (process.env.MONGODB_URI) {
  connectToDatabase().then(() => ensureSeeded()).catch(() => {});
}

app.use((req, res, next) => {
  ensureConnection()
    .then(() => next())
    .catch(err => {
      res.status(500).json({ error: 'Database connection failed', detail: err?.message || String(err) });
    });
});

app.post('/api/seed', express.json(), async (req, res) => {
  try {
    await ensureConnection();
    await seedData(true);
    seedingDone = true;
    res.json({ message: 'Database seeded successfully with 60 users, 3 stories, 3 articles, and 7 FAQs.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Seed failed', detail: err?.message || String(err) });
  }
});

app.use(mainApp);

export default app;
