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

async function connectWithRetry(attempts = 2): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  for (let i = 0; i < attempts; i++) {
    try {
      await mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 20000,
        connectTimeoutMS: 20000,
      });
      return;
    } catch (err) {
      if (i < attempts - 1) {
        await mongoose.disconnect().catch(() => {});
        await new Promise(r => setTimeout(r, 2000));
      } else {
        throw err;
      }
    }
  }
}

function ensureConnection(): Promise<void> {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (connectLock) return connectLock;
  connectLock = connectWithRetry()
    .then(() => { ensureSeeded(); })
    .catch(err => { connectLock = null; return Promise.reject(err); });
  return connectLock;
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
    const count = await countUsers();
    if (count > 0) {
      res.json({ message: 'Database already has data. No changes made.' });
      return;
    }
    await seedData(false);
    seedingDone = true;
    res.json({ message: 'Database seeded successfully with 60 users, 3 stories, 3 articles, and 7 FAQs.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Seed failed', detail: err?.message || String(err) });
  }
});

app.use(mainApp);

export default app;
