import { getPool } from '../lib/db';

export async function connectDB() {
  const pool = getPool();
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
  return pool;
}
