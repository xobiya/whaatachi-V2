import dotenv from 'dotenv';
dotenv.config();

import { initDatabase } from './config/schema';
import { seedData } from './config/seed-data';
import { countUsers } from './models/user.model';

async function main(): Promise<void> {
  try {
    await initDatabase();

    const force = process.argv.includes('--force');
    if (force) {
      await seedData(true);
    } else {
      const existing = await countUsers();
      if (existing > 0) {
        console.log('Database already has data. Skipping seed.');
        console.log('Use --force to re-seed.');
        process.exit(0);
      }
      await seedData(false);
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

main();
