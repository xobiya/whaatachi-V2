import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mainApp from './app';
import { seedData } from './config/seed-data';
import { startProfileCache } from './models/user.model';
import prisma from './lib/prisma';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

const PORT = parseInt(process.env.PORT || process.env.API_PORT || '3005', 10);

function buildDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.MYSQL_URL) return process.env.MYSQL_URL;
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const pass = process.env.DB_PASS || '';
  const name = process.env.DB_NAME || 'whaatachi';
  const port = process.env.DB_PORT || '3306';
  return `mysql://${user}${pass ? `:${pass}` : ''}@${host}:${port}/${name}?schema=public&connection_limit=10`;
}

async function start() {
  const databaseUrl = buildDatabaseUrl();
  process.env.DATABASE_URL = databaseUrl;
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
