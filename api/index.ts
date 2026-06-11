import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import mainApp from '../api-src/app';
import { seedData } from '../api-src/config/seed-data';
import { countUsers } from '../api-src/models/user.model';

const app = express();

let seedingDone = false;

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    if (!seedingDone) {
      countUsers().then(count => {
        if (count === 0) {
          console.log('Seeding database...');
          return seedData(false);
        }
      }).catch(err => console.error('Seed check failed:', err))
        .finally(() => { seedingDone = true; });
    }
    return next();
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    res.status(500).json({ error: 'Database connection failed', detail: 'MONGODB_URI environment variable is not set' });
    return;
  }

  mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 })
    .then(() => {
      console.log('MongoDB connected');
      countUsers().then(count => {
        if (count === 0) {
          console.log('Seeding database...');
          return seedData(false);
        }
      }).catch(err => console.error('Seed check failed:', err))
        .finally(() => { seedingDone = true; });
      next();
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      res.status(500).json({ error: 'Database connection failed', detail: err.message });
    });
});

app.use(mainApp);

export default app;
