import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const DB_NAME = process.env.DB_NAME || 'whaatachi';

const SCHEMA_SQL = `
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`${DB_NAME}\`;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  gender ENUM('Male','Female') NOT NULL,
  lookingFor ENUM('Male','Female') DEFAULT NULL,
  image VARCHAR(500) DEFAULT NULL,
  status ENUM('Online','Offline','Recently Active') DEFAULT 'Offline',
  relationshipIntent ENUM('True Relationship','Friendship','Friends with Benefits','Only Sex') DEFAULT NULL,
  interests JSON DEFAULT NULL,
  verified TINYINT(1) DEFAULT 0,
  phone VARCHAR(20) DEFAULT NULL,
  telegram VARCHAR(100) DEFAULT NULL,
  instagram VARCHAR(100) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  profileId VARCHAR(36) NOT NULL,
  profileName VARCHAR(100) NOT NULL,
  profileImage VARCHAR(500) DEFAULT NULL,
  senderName VARCHAR(100) NOT NULL,
  senderPhone VARCHAR(20) NOT NULL,
  transactionId VARCHAR(100) NOT NULL,
  method ENUM('Telebirr','CBE Birr') NOT NULL,
  amount INT NOT NULL,
  receiptImage VARCHAR(500) DEFAULT NULL,
  status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS success_stories (
  id VARCHAR(36) PRIMARY KEY,
  coupleNames VARCHAR(200) NOT NULL,
  story TEXT NOT NULL,
  year VARCHAR(10) DEFAULT NULL,
  image VARCHAR(500) DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  readTime VARCHAR(50) DEFAULT NULL,
  date VARCHAR(50) DEFAULT NULL,
  image VARCHAR(500) DEFAULT NULL,
  content TEXT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS faqs (
  id VARCHAR(36) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  sortOrder INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

export async function initDatabase() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    await conn.query(SCHEMA_SQL);
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize database schema:', err);
    throw err;
  } finally {
    await conn.end();
  }
}
