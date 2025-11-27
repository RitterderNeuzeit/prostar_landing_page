import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { userCache, type CachedUser } from "./services/userCache";

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
    console.warn("[Database] DB not available - using file-persisted cache for user");
    
    // Fallback to file cache
    const cachedUser: CachedUser = {
      openId: user.openId!,
      email: user.email || '',
      name: user.name || undefined,
      loginMethod: user.loginMethod || undefined,
      role: user.role || 'user',
      passwordHash: user.passwordHash || undefined,
      lastSignedIn: user.lastSignedIn || new Date(),
      createdAt: new Date(),
    };
    
    userCache.upsert(cachedUser);
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
      values.role = 'admin';
      updateSet.role = 'admin';
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
    console.error("[Database] Failed to upsert user, falling back to cache:", error);
    
    // Fallback to cache on error
    const cachedUser: CachedUser = {
      openId: user.openId!,
      email: user.email || '',
      name: user.name || undefined,
      loginMethod: user.loginMethod || undefined,
      role: user.role || 'user',
      passwordHash: user.passwordHash || undefined,
      lastSignedIn: user.lastSignedIn || new Date(),
      createdAt: new Date(),
    };
    
    userCache.upsert(cachedUser);
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available - using cache");
    const cachedUser = userCache.getByOpenId(openId);
    if (cachedUser) {
      return {
        id: 0, // Dummy ID for cache
        openId: cachedUser.openId,
        email: cachedUser.email,
        name: cachedUser.name || null,
        loginMethod: cachedUser.loginMethod || null,
        role: cachedUser.role,
        passwordHash: cachedUser.passwordHash || null,
        createdAt: cachedUser.createdAt,
        updatedAt: cachedUser.createdAt,
        lastSignedIn: cachedUser.lastSignedIn,
      };
    }
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user by email: database not available - using cache");
    const cachedUser = userCache.getByEmail(email);
    if (cachedUser) {
      return {
        id: 0, // Dummy ID for cache
        openId: cachedUser.openId,
        email: cachedUser.email,
        name: cachedUser.name || null,
        loginMethod: cachedUser.loginMethod || null,
        role: cachedUser.role,
        passwordHash: cachedUser.passwordHash || null,
        createdAt: cachedUser.createdAt,
        updatedAt: cachedUser.createdAt,
        lastSignedIn: cachedUser.lastSignedIn,
      };
    }
    return undefined;
  }
  const normalized = email.toLowerCase();
  const result = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}


// TODO: add feature queries here as your schema grows.
