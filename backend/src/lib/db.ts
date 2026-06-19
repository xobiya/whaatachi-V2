import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL || process.env.MYSQL_URL || '';

    if (url) {
      // Full connection URL provided (e.g. mysql://user:pass@host/db)
      pool = mysql.createPool(url);
    } else {
      // Fall back to individual DB_* environment variables
      const host = process.env.DB_HOST;
      const user = process.env.DB_USER;
      const password = process.env.DB_PASS ?? '';
      const database = process.env.DB_NAME;

      if (!host || !user || !database) {
        throw new Error(
          'Database not configured. Set DATABASE_URL or DB_HOST + DB_USER + DB_NAME environment variables.'
        );
      }

      pool = mysql.createPool({ host, user, password, database, waitForConnections: true, connectionLimit: 10 });
    }
  }
  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const [rows] = await getPool().execute(sql, params);
  return rows as T;
}

export async function getRow<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T[]>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function scalar<T = any>(sql: string, params?: any[]): Promise<T> {
  const rows = await query<any[]>(sql, params);
  return rows[0]?.[Object.keys(rows[0] || {})[0]] as T;
}

export async function initializeSchema() {
  const sql = `
    CREATE TABLE IF NOT EXISTS User (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      age INT DEFAULT NULL,
      city VARCHAR(255) DEFAULT NULL,
      address TEXT DEFAULT NULL,
      bio TEXT DEFAULT NULL,
      gender VARCHAR(50) NOT NULL,
      lookingFor VARCHAR(50) DEFAULT NULL,
      image LONGTEXT DEFAULT NULL,
      status VARCHAR(50) DEFAULT 'Online',
      relationshipIntent VARCHAR(100) DEFAULT NULL,
      verified TINYINT(1) DEFAULT 0,
      phone VARCHAR(50) DEFAULT NULL,
      telegram VARCHAR(255) DEFAULT NULL,
      instagram VARCHAR(255) DEFAULT NULL,
      email VARCHAR(255) DEFAULT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      UNIQUE INDEX User_phone_key (phone),
      UNIQUE INDEX User_telegram_key (telegram),
      UNIQUE INDEX User_instagram_key (instagram),
      UNIQUE INDEX User_email_key (email),
      INDEX User_gender_lookingFor_idx (gender, lookingFor),
      INDEX User_gender_city_idx (gender, city),
      INDEX User_name_idx (name),
      INDEX User_status_idx (status),
      INDEX User_verified_idx (verified),
      INDEX User_createdAt_idx (createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS UserInterest (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      interest VARCHAR(255) NOT NULL,
      INDEX UserInterest_userId_idx (userId),
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS Payment (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      profileId VARCHAR(36) NOT NULL,
      profileName VARCHAR(255) NOT NULL,
      profileImage LONGTEXT DEFAULT NULL,
      senderName VARCHAR(255) NOT NULL,
      senderPhone VARCHAR(50) NOT NULL,
      transactionId VARCHAR(255) NOT NULL,
      method VARCHAR(50) NOT NULL,
      amount FLOAT NOT NULL,
      receiptImage LONGTEXT DEFAULT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX Payment_userId_createdAt_idx (userId, createdAt),
      INDEX Payment_status_createdAt_idx (status, createdAt),
      INDEX Payment_userId_status_idx (userId, status),
      FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS Admin (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const statements = sql.split(';').filter(s => s.trim().length > 0);
  const conn = await getPool().getConnection();
  try {
    for (const stmt of statements) {
      await conn.execute(stmt);
    }
    console.log('[schema] Tables initialized');
  } finally {
    conn.release();
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
