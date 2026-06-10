import { connectDB } from './database';

export async function initDatabase(): Promise<void> {
  await connectDB();
  console.log('Database initialized.');
}
