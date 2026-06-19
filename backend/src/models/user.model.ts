import { query, getRow, scalar } from '../lib/db';

export async function findUserById(id: string) {
  const rows = await query<any[]>(
    `SELECT u.*, GROUP_CONCAT(DISTINCT ui.interest) as interests_csv
     FROM User u
     LEFT JOIN UserInterest ui ON ui.userId = u.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [id]
  );
  return rows.length > 0 ? rowToUserWithInterests(rows[0]) : null;
}

export async function findUserByName(name: string) {
  const rows = await query<any[]>(
    `SELECT u.*, GROUP_CONCAT(DISTINCT ui.interest) as interests_csv
     FROM User u
     LEFT JOIN UserInterest ui ON ui.userId = u.id
     WHERE u.name = ?
     GROUP BY u.id`,
    [name]
  );
  return rows.map(rowToUserWithInterests);
}

export async function findUserByContact(telegram: string | null, instagram: string | null) {
  if (!telegram && !instagram) return null;

  const tg = telegram?.replace(/^@/, '');
  const ig = instagram?.replace(/^@/, '');

  const conditions: string[] = [];
  const params: string[] = [];

  if (tg) {
    conditions.push('(u.telegram = ? OR u.telegram = ?)');
    params.push(tg, `@${tg}`);
  }
  if (ig) {
    conditions.push('(u.instagram = ? OR u.instagram = ?)');
    params.push(ig, `@${ig}`);
  }

  const rows = await query<any[]>(
    `SELECT u.*, GROUP_CONCAT(DISTINCT ui.interest) as interests_csv
     FROM User u
     LEFT JOIN UserInterest ui ON ui.userId = u.id
     WHERE ${conditions.join(' OR ')}
     GROUP BY u.id
     LIMIT 1`,
    params
  );
  return rows.length > 0 ? rowToUserWithInterests(rows[0]) : null;
}

export async function findUserByPhone(phone: string) {
  const normalized = phone.replace(/\s+/g, '');

  const rows = await query<any[]>(
    `SELECT u.*, GROUP_CONCAT(DISTINCT ui.interest) as interests_csv
     FROM User u
     LEFT JOIN UserInterest ui ON ui.userId = u.id
     WHERE u.phone = ? OR u.phone = ? OR u.phone = ? OR u.phone = ?
     GROUP BY u.id
     LIMIT 1`,
    [phone, normalized, `+251 ${normalized.slice(3)}`, `+251${normalized.slice(3)}`]
  );
  return rows.length > 0 ? rowToUserWithInterests(rows[0]) : null;
}

export async function findUserByLogin(login: string) {
  const sanitized = login.replace(/^@/, '');

  const rows = await query<any[]>(
    `SELECT u.*, GROUP_CONCAT(DISTINCT ui.interest) as interests_csv
     FROM User u
     LEFT JOIN UserInterest ui ON ui.userId = u.id
     WHERE u.phone = ? OR u.phone = ? OR u.telegram = ? OR u.telegram = ? OR u.telegram = ? OR u.instagram = ? OR u.instagram = ? OR u.instagram = ?
     GROUP BY u.id
     LIMIT 1`,
    [login, sanitized, login, sanitized, `@${sanitized}`, login, sanitized, `@${sanitized}`]
  );
  return rows.length > 0 ? rowToUserWithInterests(rows[0]) : null;
}

export async function checkDuplicate(field: string, value: string, excludeId?: string) {
  if (!value) return false;

  let sql: string;
  let params: string[];

  if (field === 'phone') {
    sql = 'SELECT COUNT(*) as cnt FROM User WHERE phone = ?';
    params = [value];
  } else if (field === 'telegram' || field === 'instagram') {
    const val = value.replace(/^@/, '');
    sql = `SELECT COUNT(*) as cnt FROM User WHERE ${field} = ? OR ${field} = ?`;
    params = [val, `@${val}`];
  } else {
    sql = `SELECT COUNT(*) as cnt FROM User WHERE ${field} = ?`;
    params = [value];
  }

  if (excludeId) {
    sql += ' AND id != ?';
    params.push(excludeId);
  }

  const count = await scalar<number>(sql, params);
  return count > 0;
}

function buildFilterClauses(filters: Record<string, any>) {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.gender) { conditions.push('u.gender = ?'); params.push(filters.gender); }
  if (filters.lookingFor) { conditions.push('u.lookingFor = ?'); params.push(filters.lookingFor); }
  if (filters.city) { conditions.push('u.city = ?'); params.push(filters.city); }
  if (filters.intent) { conditions.push('u.relationshipIntent = ?'); params.push(filters.intent); }
  if (filters.search) {
    conditions.push('(u.name LIKE ? OR u.city LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.minAge) { conditions.push('u.age >= ?'); params.push(filters.minAge); }
  if (filters.maxAge) { conditions.push('u.age <= ?'); params.push(filters.maxAge); }

  return { conditions, params };
}

function rowToUserWithInterests(row: any) {
  const interests = row.interests_csv ? row.interests_csv.split(',').map((s: string) => ({ interest: s })) : [];
  return { ...row, interests };
}

function toProfileDoc(doc: any) {
  const interests = doc.interests?.map((i: any) => i.interest) ?? [];
  return {
    id: doc.id,
    _id: doc.id,
    name: doc.name,
    age: doc.age ?? null,
    city: doc.city ?? null,
    address: doc.address ?? null,
    bio: doc.bio ?? null,
    gender: doc.gender,
    lookingFor: doc.lookingFor ?? null,
    image: doc.image ?? null,
    status: doc.status ?? 'Offline',
    relationshipIntent: doc.relationshipIntent ?? null,
    interests,
    verified: doc.verified === 1 || doc.verified === true,
    contactInfo: {
      phone: doc.phone ?? null,
      telegram: doc.telegram ?? null,
      instagram: doc.instagram ?? null,
      email: doc.email ?? null,
    },
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

let cachedAllProfiles: { rows: any[]; total: number } | null = null;
let cacheTimer: ReturnType<typeof setInterval> | null = null;

export async function refreshProfileCache() {
  try {
    const rows = await query<any[]>(
      `SELECT u.*, GROUP_CONCAT(DISTINCT ui.interest) as interests_csv
       FROM User u
       LEFT JOIN UserInterest ui ON ui.userId = u.id
       GROUP BY u.id
       ORDER BY u.id DESC
       LIMIT 1000`
    );
    const mapped = rows.map(rowToUserWithInterests);
    const total = mapped.length;
    cachedAllProfiles = { rows: mapped.map(toProfileDoc), total };
    console.log('[profile-cache] refreshed: %d profiles', total);
  } catch (err: any) {
    console.error('[profile-cache] refresh error:', err?.message || err);
  }
}

export function startProfileCache(intervalMs = 60000) {
  if (cacheTimer) clearInterval(cacheTimer);
  refreshProfileCache();
  cacheTimer = setInterval(refreshProfileCache, intervalMs);
}

export function stopProfileCache() {
  if (cacheTimer) {
    clearInterval(cacheTimer);
    cacheTimer = null;
  }
}

export async function getAllProfiles() {
  let cache = cachedAllProfiles;
  if (cache) {
    return { profiles: cache.rows, total: cache.total };
  }
  await refreshProfileCache();
  cache = cachedAllProfiles;
  return { profiles: cache?.rows ?? [], total: cache?.total ?? 0 };
}

function normalizePhone(phone?: string): string | undefined {
  return phone ? phone.replace(/\s+/g, '') : undefined;
}

export async function createUser(data: Record<string, any>) {
  const { id, name, age, city, address, bio, gender, lookingFor, image,
    status, relationshipIntent, interests, phone, telegram, instagram, email } = data;

  await query(
    `INSERT INTO User (id, name, age, city, address, bio, gender, lookingFor, image, status, relationshipIntent, phone, telegram, instagram, email)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, name, age ?? null, city ?? null, address ?? null, bio ?? null,
      gender, lookingFor ?? null, image ?? null, status || 'Online',
      relationshipIntent ?? null, normalizePhone(phone) || null,
      telegram || null, instagram || null, email || null,
    ]
  );

  if (Array.isArray(interests) && interests.length > 0) {
    const values = interests.map((interest: string) => [id, interest]);
    const placeholders = values.map(() => '(?, ?)').join(', ');
    const flat = values.flat();
    await query(
      `INSERT INTO UserInterest (userId, interest) VALUES ${placeholders}`,
      flat
    );
  }

  cachedAllProfiles = null;

  return findUserById(id);
}

export async function updateUser(id: string, data: Record<string, any>) {
  const existing = await findUserById(id);
  if (!existing) return null;

  const fields: string[] = [];
  const params: any[] = [];
  const allowed = ['name', 'age', 'city', 'address', 'bio', 'lookingFor', 'image',
    'status', 'relationshipIntent', 'phone', 'telegram', 'instagram', 'email'];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      const val = ['phone', 'telegram', 'instagram', 'email'].includes(key) && (data[key] === '' || data[key] === null)
        ? null
        : key === 'phone' ? normalizePhone(data[key]) : data[key];
      fields.push(`${key} = ?`);
      params.push(val);
    }
  }

  if (fields.length > 0) {
    params.push(id);
    await query(
      `UPDATE User SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
  }

  if (data.interests !== undefined) {
    await query('DELETE FROM UserInterest WHERE userId = ?', [id]);
    if (Array.isArray(data.interests) && data.interests.length > 0) {
      const values = data.interests.map((interest: string) => [id, interest]);
      const placeholders = values.map(() => '(?, ?)').join(', ');
      const flat = values.flat();
      await query(
        `INSERT INTO UserInterest (userId, interest) VALUES ${placeholders}`,
        flat
      );
    }
  }

  cachedAllProfiles = null;
  return findUserById(id);
}

export async function verifyUser(userId: string) {
  await query('UPDATE User SET verified = 1 WHERE id = ?', [userId]);
}

export async function toggleUserVerification(userId: string) {
  const user = await getRow<{ verified: number }>('SELECT verified FROM User WHERE id = ?', [userId]);
  if (!user) return null;
  const newVal = user.verified ? 0 : 1;
  await query('UPDATE User SET verified = ? WHERE id = ?', [newVal, userId]);
  return { verified: newVal === 1 };
}

export async function countUsers() {
  return scalar<number>('SELECT COUNT(*) as cnt FROM User');
}

export async function deleteUser(id: string) {
  const existing = await getRow<{ id: string }>('SELECT id FROM User WHERE id = ?', [id]);
  if (!existing) return null;
  await query('DELETE FROM UserInterest WHERE userId = ?', [id]);
  await query('DELETE FROM User WHERE id = ?', [id]);
  return { id };
}

export async function countUsersByGender(gender: string) {
  return scalar<number>('SELECT COUNT(*) as cnt FROM User WHERE gender = ?', [gender]);
}

export async function countVerifiedUsers() {
  return scalar<number>('SELECT COUNT(*) as cnt FROM User WHERE verified = 1');
}
