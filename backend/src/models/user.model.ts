import { query } from '../config/database';
import { UserRow } from '../types';

export async function findUserById(id: string): Promise<UserRow | null> {
  const rows: any = await query('SELECT * FROM users WHERE id = ?', [id]);
  return rows.length ? (rows[0] as UserRow) : null;
}

export async function findUserByName(name: string): Promise<UserRow[]> {
  const rows: any = await query('SELECT * FROM users WHERE LOWER(name) = LOWER(?)', [name.trim()]);
  return rows as UserRow[];
}

function buildWhereClause(filters: {
  gender?: string;
  lookingFor?: string;
  city?: string;
  intent?: string;
  search?: string;
  minAge?: number;
  maxAge?: number;
}): { clause: string; params: any[] } {
  let clause = 'WHERE 1=1';
  const params: any[] = [];

  if (filters.gender) { clause += ' AND gender = ?'; params.push(filters.gender); }
  if (filters.lookingFor) { clause += ' AND lookingFor = ?'; params.push(filters.lookingFor); }
  if (filters.city) { clause += ' AND LOWER(city) = LOWER(?)'; params.push(filters.city); }
  if (filters.intent) { clause += ' AND relationshipIntent = ?'; params.push(filters.intent); }
  if (filters.search) {
    clause += ' AND (LOWER(name) LIKE ? OR LOWER(city) LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.minAge) { clause += ' AND age >= ?'; params.push(filters.minAge); }
  if (filters.maxAge) { clause += ' AND age <= ?'; params.push(filters.maxAge); }

  return { clause, params };
}

export async function findUsersWithFilters(filters: {
  gender?: string;
  lookingFor?: string;
  city?: string;
  intent?: string;
  search?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
}): Promise<{ rows: UserRow[]; total: number }> {
  const { clause, params } = buildWhereClause(filters);

  const countRows: any = await query(`SELECT COUNT(*) as count FROM users ${clause}`, params);
  const total = countRows[0].count;

  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const offset = (page - 1) * limit;

  const dataRows: any = await query(
    `SELECT * FROM users ${clause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows: dataRows as UserRow[], total };
}

export async function createUser(data: {
  id: string;
  name: string;
  age?: number;
  city?: string;
  address?: string;
  bio?: string;
  gender: string;
  lookingFor?: string;
  image?: string;
  status?: string;
  relationshipIntent?: string;
  interests?: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  email?: string;
}): Promise<void> {
  await query(
    `INSERT INTO users (id, name, age, city, address, bio, gender, lookingFor, image, status, relationshipIntent, interests, verified, phone, telegram, instagram, email)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
    [data.id, data.name, data.age ?? null, data.city ?? null, data.address ?? null,
     data.bio ?? null, data.gender, data.lookingFor ?? null, data.image ?? null,
     data.status ?? 'Online', data.relationshipIntent ?? null, data.interests ?? null,
     data.phone ?? null, data.telegram ?? null, data.instagram ?? null, data.email ?? null]
  );
}

export async function updateUser(id: string, data: Record<string, any>): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  const allowed = ['name', 'age', 'city', 'address', 'bio', 'lookingFor', 'image',
    'status', 'relationshipIntent', 'interests', 'phone', 'telegram', 'instagram', 'email'];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key}=?`);
      values.push(key === 'interests' && Array.isArray(data[key])
        ? JSON.stringify(data[key])
        : data[key]);
    }
  }

  if (fields.length === 0) return;
  values.push(id);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE id=?`, values);
}

export async function verifyUser(userId: string): Promise<void> {
  await query('UPDATE users SET verified = 1 WHERE id = ?', [userId]);
}

export async function countUsers(): Promise<number> {
  const rows: any = await query('SELECT COUNT(*) as count FROM users');
  return rows[0].count;
}

export async function countUsersByGender(gender: string): Promise<number> {
  const rows: any = await query('SELECT COUNT(*) as count FROM users WHERE gender = ?', [gender]);
  return rows[0].count;
}

export async function countVerifiedUsers(): Promise<number> {
  const rows: any = await query('SELECT COUNT(*) as count FROM users WHERE verified = 1');
  return rows[0].count;
}
