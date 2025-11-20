import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Course registration table for free mini course access
 * Stores course enrollments with unique access keys
 */
export const courseRegistrations = mysqlTable("courseRegistrations", {
  id: int("id").autoincrement().primaryKey(),
  accessKey: varchar("accessKey", { length: 64 }).notNull().unique(), // Unique access token
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  courseName: varchar("courseName", { length: 255 }).notNull().default("free-mini-course"),
  status: mysqlEnum("status", ["pending", "active", "expired", "cancelled"]).default("active").notNull(),
  emailSent: timestamp("emailSent"),
  accessedAt: timestamp("accessedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseRegistration = typeof courseRegistrations.$inferSelect;
export type InsertCourseRegistration = typeof courseRegistrations.$inferInsert;
