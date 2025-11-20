import { v4 as uuidv4 } from "uuid";
import { courseRegistrations } from "../db";

/**
 * Generate unique access key for course
 */
export function generateAccessKey(): string {
  return uuidv4().replace(/-/g, "").substring(0, 32);
}

/**
 * Create course registration record
 */
export async function createCourseRegistration(data: {
  name: string;
  email: string;
  courseName?: string;
}) {
  const accessKey = generateAccessKey();
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days

  try {
    const registration = await courseRegistrations.insert({
      accessKey,
      name: data.name,
      email: data.email,
      courseName: data.courseName || "free-mini-course",
      status: "active",
      expiresAt,
    });

    return {
      success: true,
      accessKey,
      expiresAt,
      registration,
    };
  } catch (error) {
    console.error("Error creating course registration:", error);
    throw new Error("Failed to create course registration");
  }
}

/**
 * Verify access key and update access tracking
 */
export async function verifyAccessKey(accessKey: string) {
  try {
    const registration = await courseRegistrations
      .select()
      .where((t) => t.accessKey.equals(accessKey))
      .limit(1)
      .execute();

    if (!registration || registration.length === 0) {
      return { valid: false, error: "Access key not found" };
    }

    const reg = registration[0];

    // Check expiration
    if (reg.expiresAt && new Date() > new Date(reg.expiresAt)) {
      return { valid: false, error: "Access key has expired" };
    }

    // Check status
    if (reg.status !== "active") {
      return { valid: false, error: `Course access is ${reg.status}` };
    }

    // Update accessed timestamp
    await courseRegistrations
      .update()
      .set({ accessedAt: new Date() })
      .where((t) => t.accessKey.equals(accessKey))
      .execute();

    return {
      valid: true,
      name: reg.name,
      email: reg.email,
      courseName: reg.courseName,
      expiresAt: reg.expiresAt,
    };
  } catch (error) {
    console.error("Error verifying access key:", error);
    return { valid: false, error: "Verification failed" };
  }
}
