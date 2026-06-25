import bcrypt from 'bcryptjs';
import { getRow, query } from '../lib/db';

const ADMIN_USERNAME = 'admin';

export async function findOrCreateAdmin(passcode: string) {
  let admin = await getRow<any>('SELECT * FROM Admin WHERE username = ?', [ADMIN_USERNAME]);

  if (!admin) {
    const hashed = await bcrypt.hash(passcode, 10);
    await query('INSERT INTO Admin (username, password) VALUES (?, ?)', [ADMIN_USERNAME, hashed]);
    admin = await getRow<any>('SELECT * FROM Admin WHERE username = ?', [ADMIN_USERNAME]);
  }

  return {
    id: String(admin.id),
    username: admin.username,
    password: admin.password,
    createdAt: new Date(admin.createdAt).toISOString(),
  };
}

export async function verifyAdminPasscode(passcode: string) {
  const admin = await getRow<any>('SELECT * FROM Admin WHERE username = ?', [ADMIN_USERNAME]);
  if (!admin) return null;

  const match = await bcrypt.compare(passcode, admin.password);
  if (!match) return null;

  return {
    id: String(admin.id),
    username: admin.username,
    password: admin.password,
    createdAt: new Date(admin.createdAt).toISOString(),
  };
}

export async function updateAdminPasscode(newPasscode: string) {
  const hashed = await bcrypt.hash(newPasscode, 10);
  await query('UPDATE Admin SET password = ? WHERE username = ?', [hashed, ADMIN_USERNAME]);
}
