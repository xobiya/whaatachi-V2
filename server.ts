import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mainApp from './api-src/app';
import { seedData } from './api-src/config/seed-data';
import { startProfileCache } from './api-src/models/user.model';
import prisma from './api-src/lib/prisma';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env.local') });
}

const PORT = parseInt(process.env.PORT || process.env.API_PORT || '3001', 10);

async function start() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  await prisma.$connect();
  console.log('MySQL connected via Prisma');

  if (process.env.RUN_SEED === 'true') {
    await seedData();
  }

  const server = mainApp.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });

  server.timeout = 35000;
  server.headersTimeout = 36000;

  startProfileCache(300000);
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
