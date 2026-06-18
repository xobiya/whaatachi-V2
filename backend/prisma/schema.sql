CREATE TABLE User (
  id VARCHAR(36) NOT NULL DEFAULT (UUID()),
  name VARCHAR(191) NOT NULL,
  age INT NULL,
  city VARCHAR(191) NULL,
  address TEXT NULL,
  bio TEXT NULL,
  gender VARCHAR(191) NOT NULL,
  lookingFor VARCHAR(191) NULL,
  image LONGTEXT NULL,
  status VARCHAR(191) NOT NULL DEFAULT 'Online',
  relationshipIntent VARCHAR(191) NULL,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  phone VARCHAR(191) NULL,
  telegram VARCHAR(191) NULL,
  instagram VARCHAR(191) NULL,
  email VARCHAR(191) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
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

CREATE TABLE UserInterest (
  id INT NOT NULL AUTO_INCREMENT,
  userId VARCHAR(36) NOT NULL,
  interest VARCHAR(191) NOT NULL,
  PRIMARY KEY (id),
  INDEX UserInterest_userId_idx (userId),
  CONSTRAINT UserInterest_userId_fkey FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Payment (
  id VARCHAR(36) NOT NULL DEFAULT (UUID()),
  userId VARCHAR(36) NOT NULL,
  profileId VARCHAR(191) NOT NULL,
  profileName VARCHAR(191) NOT NULL,
  profileImage LONGTEXT NULL,
  senderName VARCHAR(191) NOT NULL,
  senderPhone VARCHAR(191) NOT NULL,
  transactionId VARCHAR(191) NOT NULL,
  method VARCHAR(191) NOT NULL,
  amount DOUBLE NOT NULL,
  receiptImage LONGTEXT NULL,
  status VARCHAR(191) NOT NULL DEFAULT 'Pending',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  INDEX Payment_userId_createdAt_idx (userId, createdAt),
  INDEX Payment_status_createdAt_idx (status, createdAt),
  INDEX Payment_userId_status_idx (userId, status),
  CONSTRAINT Payment_userId_fkey FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Admin (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(191) NOT NULL,
  password VARCHAR(191) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX Admin_username_key (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
