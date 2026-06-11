import express from 'express';
import mongoose from 'mongoose';
import mainApp, { seedData, countUsers } from './dist/bundle.js';

const app = express();
let seedingDone = false;
let seedingPromise: Promise<void> | null = null;

function ensureSeeded(): Promise<void> {
  if (seedingDone) return Promise.resolve();
  if (seedingPromise) return seedingPromise;
  seedingPromise = countUsers()
    .then(count => { if (count === 0) return seedData(false); })
    .then(() => { seedingDone = true; })
    .catch(err => { console.error('[SEED]', err?.message || err); seedingPromise = null; });
  return seedingPromise;
}

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    ensureSeeded().finally(() => next());
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    res.status(500).json({ error: 'Database connection failed', detail: 'MONGODB_URI not set' });
    return;
  }
  mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 })
    .then(() => ensureSeeded().finally(() => next()))
    .catch(err => {
      res.status(500).json({ error: 'Database connection failed', detail: err?.message || String(err) });
    });
});

app.use(mainApp);

export default app;
