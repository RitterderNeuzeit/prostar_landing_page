CREATE TABLE `courseRegistrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accessKey` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`courseName` varchar(255) NOT NULL DEFAULT 'free-mini-course',
	`status` enum('pending','active','expired','cancelled') NOT NULL DEFAULT 'active',
	`emailSent` timestamp,
	`accessedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseRegistrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `courseRegistrations_accessKey_unique` UNIQUE(`accessKey`)
);
