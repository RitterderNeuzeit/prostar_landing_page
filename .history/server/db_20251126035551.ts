import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  courseRegistrations,
  InsertCourseRegistration,
  CourseRegistration,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { registrationCache } from "./services/registrationCache";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Course registration queries
export async function createCourseRegistration(
  data: InsertCourseRegistration
): Promise<CourseRegistration | null> {
  const db = await getDb();
  if (!db) {
    console.warn(
      "[Database] Cannot create registration: database not available"
    );
    // Fallback to in-memory cache
    registrationCache.set(data.accessKey!, {
      id: String(Math.random()),
      accessKey: data.accessKey!,
      name: data.name,
      email: data.email,
      courseName: data.courseName || "free-mini-course",
      status: (data.status as any) || "active",
      emailSent: (data.emailSent as any) || null,
      accessedAt: null,
      expiresAt: data.expiresAt || new Date(),
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    } as any);
    return null;
  }

  try {
    await db.insert(courseRegistrations).values(data);
    // Return the created record
    const created = await db
      .select()
      .from(courseRegistrations)
      .where(eq(courseRegistrations.accessKey, data.accessKey))
      .limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create registration:", error);
    // Fallback: store in cache
    console.warn("[Database] DB failed, using in-memory cache fallback");
    registrationCache.set(data.accessKey!, {
      id: String(Math.random()),
      accessKey: data.accessKey!,
      name: data.name,
      email: data.email,
      courseName: data.courseName || "free-mini-course",
      status: (data.status as any) || "active",
      emailSent: (data.emailSent as any) || null,
      accessedAt: null,
      expiresAt: data.expiresAt || new Date(),
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    } as any);
    return null;
  }
}

export async function getCourseRegistrationByAccessKey(
  accessKey: string
): Promise<CourseRegistration | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get registration: database not available");
    const cached = registrationCache.get(accessKey);
    return cached as CourseRegistration | null;
  }

  try {
    const result = await db
      .select()
      .from(courseRegistrations)
      .where(eq(courseRegistrations.accessKey, accessKey))
      .limit(1);

    if (result.length > 0) {
      return result[0];
    }
  } catch (error) {
    console.warn("[Database] Query failed, checking cache:", error);
  }

  const cached = registrationCache.get(accessKey);
  if (cached) {
    console.log("[Database] Returning cached registration:", accessKey);
    return cached as unknown as CourseRegistration;
  }

  return null;
}

export async function updateCourseRegistrationAccessed(
  accessKey: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn(
      "[Database] Cannot update registration: database not available"
    );
    // Update cache if present
    const updated = registrationCache.update(accessKey, { accessedAt: new Date() } as any);
    if (updated) {
      console.log("[Database] Updated cached accessedAt for:", accessKey);
    }
    return;
  }

  await db
    .update(courseRegistrations)
    .set({ accessedAt: new Date() })
    .where(eq(courseRegistrations.accessKey, accessKey));
}

export async function updateCourseRegistrationEmailSent(
  accessKey: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update emailSent: database not available");
    const updated = registrationCache.update(accessKey, { emailSent: new Date() } as any);
    if (updated) {
      console.log("[Database] Updated cached emailSent for:", accessKey);
    }
    return;
  }

  await db
    .update(courseRegistrations)
    .set({ emailSent: new Date() })
    .where(eq(courseRegistrations.accessKey, accessKey));
}

export async function getRecentRegistrations(
  limit: number = 1
): Promise<CourseRegistration[]> {
  const db = await getDb();
  if (!db) {
    console.warn(
      "[Database] Cannot get recent registrations: database not available"
    );
    // Return from cache
    const cached = registrationCache.getAll();
    if (cached && cached.length > 0) {
      return cached.slice(0, limit);
    }
    return [];
  }

  try {
    const result = await db
      .select()
      .from(courseRegistrations)
      .orderBy(desc(courseRegistrations.createdAt))
      .limit(limit);
    
    console.log(`✅ Found ${result.length} recent registrations`);
    return result;
  } catch (error) {
    console.warn("[Database] Query for recent registrations failed:", error);
    // Fallback to cache
    const cached = registrationCache.getAll();
    if (cached && cached.length > 0) {
      return cached.slice(0, limit);
    }
    return [];
  }
}
