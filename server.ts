import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import mainApp, { seedData } from './api-src/app';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local only in development — on Render, env vars come from the dashboard
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env.local') });
}

// Render sets PORT automatically; fall back to API_PORT then 3001
const PORT = parseInt(process.env.PORT || process.env.API_PORT || '3001', 10);

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);

  if (process.env.RUN_SEED === 'true') {
    await seedData();
  }

  mainApp.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
