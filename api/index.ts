import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import mainApp from '../api-src/app';
import { seedData } from '../api-src/config/seed-data';
import { countUsers } from '../api-src/models/user.model';

const app = express();
const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

let seedingDone = false;
let seedingPromise: Promise<void> | null = null;

function ensureSeeded(): Promise<void> {
  if (seedingDone) return Promise.resolve();
  if (seedingPromise) return seedingPromise;

  seedingPromise = countUsers()
    .then(count => {
      console.log(`[DB] User count: ${count}`);
      if (count === 0) {
        console.log('[DB] Database empty, seeding...');
        return seedData(false);
      }
    })
    .then(() => {
      console.log('[DB] Seed check passed');
      seedingDone = true;
    })
    .catch(err => {
      console.error('[DB] Seed error:', err?.message || err);
      seedingPromise = null;
    });

  return seedingPromise;
}

function logDbState(label: string) {
  console.log(`[DB] ${label} — state: ${DB_STATES[mongoose.connection.readyState] || 'unknown'}`);
}

app.use((req, res, next) => {
  logDbState('request');

  if (mongoose.connection.readyState === 1) {
    ensureSeeded().finally(() => next());
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[DB] MONGODB_URI not set in environment');
    res.status(500).json({ error: 'Database connection failed', detail: 'MONGODB_URI not set in environment' });
    return;
  }

  console.log('[DB] Connecting...');
  mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 })
    .then(() => {
      logDbState('connected');
      ensureSeeded().finally(() => next());
    })
    .catch(err => {
      console.error('[DB] Connection error:', err?.message || err);
      res.status(500).json({ error: 'Database connection failed', detail: err?.message || String(err) });
    });
});

app.use(mainApp);

export default app;
