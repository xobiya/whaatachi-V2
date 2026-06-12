import express from 'express';
import mongoose from 'mongoose';
import mainApp, { seedData, countUsers } from './dist/bundle.js';

const app = express();
let seedingDone = false;
let seedingPromise: Promise<void> | null = null;
let connectPromise: Promise<void> | null = null;

function ensureSeeded(): void {
  if (seedingDone || seedingPromise) return;
  seedingPromise = countUsers()
    .then(count => { if (count === 0) return seedData(false); })
    .then(() => { seedingDone = true; })
    .catch(err => { console.error('[SEED]', err?.message || err); seedingPromise = null; });
}

function ensureConnection(): Promise<void> {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (connectPromise) return connectPromise;
  const uri = process.env.MONGODB_URI;
  if (!uri) return Promise.reject(new Error('MONGODB_URI not set'));
  connectPromise = mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 })
    .then(() => { ensureSeeded(); })
    .catch(err => { connectPromise = null; throw err; });
  return connectPromise;
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
