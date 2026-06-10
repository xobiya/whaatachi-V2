import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { AdminRow } from '../types';

const ADMIN_USERNAME = 'admin';

export async function findOrCreateAdmin(passcode: string): Promise<AdminRow> {
  let rows: any = await query('SELECT * FROM admins WHERE username = ?', [ADMIN_USERNAME]);
  if (rows.length === 0) {
    const hashed = await bcrypt.hash(passcode, 10);
    await query('INSERT INTO admins (username, password) VALUES (?, ?)', [ADMIN_USERNAME, hashed]);
    rows = await query('SELECT * FROM admins WHERE username = ?', [ADMIN_USERNAME]);
  }
  return rows[0] as AdminRow;
}

export async function verifyAdminPasscode(passcode: string): Promise<AdminRow | null> {
  const rows: any = await query('SELECT * FROM admins WHERE username = ?', [ADMIN_USERNAME]);
  if (rows.length === 0) return null;
  const admin = rows[0] as AdminRow;
  const match = await bcrypt.compare(passcode, admin.password);
  return match ? admin : null;
}

export async function updateAdminPasscode(newPasscode: string): Promise<void> {
  const hashed = await bcrypt.hash(newPasscode, 10);
  await query('UPDATE admins SET password = ? WHERE username = ?', [hashed, ADMIN_USERNAME]);
}
