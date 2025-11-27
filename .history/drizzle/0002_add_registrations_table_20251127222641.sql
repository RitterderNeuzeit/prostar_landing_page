-- Add registrations table for course access management
CREATE TABLE `registrations` (
  `id` varchar(191) NOT NULL,
  `access_key` varchar(128) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `course_name` varchar(255) NOT NULL DEFAULT 'free-mini-course',
  `status` enum('pending', 'active', 'expired', 'cancelled', 'used') NOT NULL DEFAULT 'active',
  `email_sent_at` timestamp NULL,
  `accessed_at` timestamp NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_access_key` (`access_key`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add password_reset_tokens table
CREATE TABLE `password_reset_tokens` (
  `id` varchar(191) NOT NULL,
  `token` varchar(128) NOT NULL UNIQUE,
  `email` varchar(255) NOT NULL,
  `used` boolean NOT NULL DEFAULT FALSE,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  KEY `idx_email` (`email`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
