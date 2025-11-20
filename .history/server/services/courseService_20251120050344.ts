import { v4 as uuidv4 } from "uuid";
import {
  createCourseRegistration,
  getCourseRegistrationByAccessKey,
  updateCourseRegistrationAccessed,
} from "../db";

/**
 * Generate unique access key for course
 */
export function generateAccessKey(): string {
  return uuidv4().replace(/-/g, "").substring(0, 32);
}

/**
 * Create course registration record
 */
export async function registerForCourse(data: {
  name: string;
  email: string;
  courseName?: string;
}) {
  const accessKey = generateAccessKey();
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days

  try {
    const registration = await createCourseRegistration({
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
    const registration = await getCourseRegistrationByAccessKey(accessKey);

    if (!registration) {
      return { valid: false, error: "Access key not found" };
    }

    // Check expiration
    if (registration.expiresAt && new Date() > new Date(registration.expiresAt)) {
      return { valid: false, error: "Access key has expired" };
    }

    // Check status
    if (registration.status !== "active") {
      return { valid: false, error: `Course access is ${registration.status}` };
    }

    // Update accessed timestamp
    await updateCourseRegistrationAccessed(accessKey);

    return {
      valid: true,
      name: registration.name,
      email: registration.email,
      courseName: registration.courseName,
      expiresAt: registration.expiresAt,
    };
  } catch (error) {
    console.error("Error verifying access key:", error);
    return { valid: false, error: "Verification failed" };
  }
}
