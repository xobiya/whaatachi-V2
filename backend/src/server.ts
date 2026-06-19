import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mainApp from './app';
import { seedData } from './config/seed-data';
import { startProfileCache } from './models/user.model';
import { getPool, initializeSchema } from './lib/db';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

const PORT = parseInt(process.env.PORT || process.env.API_PORT || '3005', 10);

async function start() {
  const pool = getPool();
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
  console.log('MySQL connected');

  if (process.env.AUTO_MIGRATE !== 'false') {
    await initializeSchema();
  }

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
