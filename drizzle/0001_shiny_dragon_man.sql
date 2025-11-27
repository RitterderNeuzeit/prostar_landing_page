CREATE TABLE `password_reset_tokens` (
	`id` varchar(191) NOT NULL,
	`token` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	`used` int NOT NULL DEFAULT 0,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_reset_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` varchar(191) NOT NULL,
	`access_key` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`course_name` varchar(255) NOT NULL DEFAULT 'free-mini-course',
	`status` enum('pending','active','expired','cancelled','used') NOT NULL DEFAULT 'active',
	`email_sent_at` timestamp,
	`accessed_at` timestamp,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `registrations_access_key_unique` UNIQUE(`access_key`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(128);