import { getDb } from "../db";
import * as dbService from "./courseServiceDB";
import * as cacheService from "./courseService";

let useDatabase = false;

/**
 * Initialize and check if database is available
 */
export async function initCourseService() {
  try {
    const db = await getDb();
    if (db) {
      useDatabase = true;
      console.log("✅ [CourseService] Using database backend");
    } else {
      console.warn("⚠️ [CourseService] Using in-memory cache backend");
    }
  } catch (error) {
    console.warn("⚠️ [CourseService] Database unavailable, using cache");
    useDatabase = false;
  }
}

/**
 * Auto-delegating functions - use DB if available, otherwise cache
 */

export async function registerForCourse(data: Parameters<typeof dbService.registerForCourse>[0]) {
  if (useDatabase) {
    return await dbService.registerForCourse(data);
  } else {
    return await cacheService.registerForCourse(data);
  }
}

export async function verifyAccessKey(email: string, accessKey: string) {
  if (useDatabase) {
    return await dbService.verifyAccessKey(email, accessKey);
  } else {
    return await cacheService.verifyAccessKey(email, accessKey);
  }
}

export async function markRegistrationAsUsed(accessKey: string) {
  if (useDatabase) {
    return await dbService.markRegistrationAsUsed(accessKey);
  } else {
    // Cache version marks as used via update
    return { success: true };
  }
}

export async function markEmailSent(accessKey: string) {
  if (useDatabase) {
    return await dbService.markEmailSent(accessKey);
  } else {
    // Cache doesn't track email sent separately
    return { success: true };
  }
}

export function generateAccessKey(email: string) {
  return dbService.generateAccessKey(email); // Same implementation
}
