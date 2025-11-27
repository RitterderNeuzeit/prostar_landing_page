import { eq, and, gt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db";
import { registrations, type InsertRegistration } from "../../drizzle/schema";

/**
 * Database-backed registration service
 * Replaces in-memory cache with persistent MySQL storage
 */

/**
 * Generate unique access key for course with email tag.
 * Format: <email_tag>_<random_code>
 */
export function generateAccessKey(email: string): string {
  const rawTag = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const emailTag = rawTag.substring(0, 8);
  const randomCode = uuidv4().replace(/-/g, "").substring(0, 20);
  return `${emailTag}_${randomCode}`;
}

/**
 * Create a course registration record in database
 */
export async function registerForCourse(data: {
  name: string;
  email: string;
  courseName?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  const accessKey = generateAccessKey(data.email);
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days

  try {
    const registration: InsertRegistration = {
      id: `reg_${uuidv4()}`,
      accessKey,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      courseName: data.courseName || "free-mini-course",
      status: "active",
      emailSentAt: null,
      accessedAt: null,
      expiresAt,
    };

    await db.insert(registrations).values(registration);

    console.log(`✅ [DB Register] Created registration for ${data.email}`);

    return {
      success: true,
      accessKey,
      expiresAt,
      registration,
    };
  } catch (error: any) {
    // Handle duplicate key error gracefully
    if (error.code === "ER_DUP_ENTRY") {
      console.warn(`⚠️ [DB Register] Duplicate registration for ${data.email}`);
      return {
        success: false,
        error: "Bereits registriert - prüfe deine E-Mails",
      };
    }

    console.error("❌ [DB Register] Error:", error);
    return {
      success: false,
      error: "Registrierung fehlgeschlagen",
    };
  }
}

/**
 * Verify access key and email
 */
export async function verifyAccessKey(email: string, accessKey: string) {
  try {
    console.log("🔍 [DB Verify] Starting verification:", { email, accessKey });

    // Input validation
    if (!email || typeof email !== "string") {
      return { valid: false, error: "Email ist erforderlich" };
    }
    if (!accessKey || typeof accessKey !== "string") {
      return { valid: false, error: "Code ist erforderlich" };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { valid: false, error: "Ungültige Email-Adresse" };
    }

    // Validate key format
    if (!accessKey.includes("_")) {
      return { valid: false, error: "Ungültiges Code-Format" };
    }

    const [emailTag] = accessKey.split("_");
    const rawTag = normalizedEmail
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const expectedTag = rawTag.substring(0, 8);

    // Check if email tag matches
    if (emailTag !== expectedTag) {
      console.warn(`❌ [DB Verify] Email tag mismatch: "${emailTag}" != "${expectedTag}"`);
      return {
        valid: false,
        error: "Code passt nicht zu dieser Email-Adresse",
      };
    }

    // Look up registration from database
    const db = await getDb();
  if (!db) throw new Error("Database not available");
    const [registration] = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.accessKey, accessKey),
          eq(registrations.email, normalizedEmail)
        )
      )
      .limit(1);

    console.log("🔍 [DB Verify] DB lookup result:", {
      found: !!registration,
      accessKey,
      email: normalizedEmail,
    });

    if (!registration) {
      console.error("❌ [DB Verify] Registration not found");
      return {
        valid: false,
        error: "Code nicht gefunden oder abgelaufen",
      };
    }

    // Check expiration
    if (new Date() > new Date(registration.expiresAt)) {
      return {
        valid: false,
        error: "Code ist abgelaufen — bitte melde dich neu an",
      };
    }

    // Check status
    if (registration.status !== "active") {
      return {
        valid: false,
        error: `Zugang ist ${registration.status}`,
      };
    }

    // Update accessed timestamp
    await db
      .update(registrations)
      .set({ accessedAt: new Date() })
      .where(eq(registrations.accessKey, accessKey));

    console.log(`✅ [DB Verify] Code accepted for ${normalizedEmail}`);

    return {
      valid: true,
      name: registration.name,
      email: registration.email,
      courseName: registration.courseName,
      expiresAt: registration.expiresAt,
    };
  } catch (error) {
    console.error("❌ [DB Verify] Verification error:", error);
    return {
      valid: false,
      error: "Verifizierung fehlgeschlagen — bitte versuche es später",
    };
  }
}

/**
 * Mark registration as used (after account creation)
 */
export async function markRegistrationAsUsed(accessKey: string) {
  try {
    const db = await getDb();
  if (!db) throw new Error("Database not available");
    await db
      .update(registrations)
      .set({ status: "used" })
      .where(eq(registrations.accessKey, accessKey));

    console.log(`✅ [DB] Marked registration as used: ${accessKey}`);
    return { success: true };
  } catch (error) {
    console.error("❌ [DB] Failed to mark as used:", error);
    return { success: false };
  }
}

/**
 * Update email sent timestamp
 */
export async function markEmailSent(accessKey: string) {
  try {
    const db = await getDb();
  if (!db) throw new Error("Database not available");
    await db
      .update(registrations)
      .set({ emailSentAt: new Date() })
      .where(eq(registrations.accessKey, accessKey));

    console.log(`✅ [DB] Marked email sent: ${accessKey}`);
    return { success: true };
  } catch (error) {
    console.error("❌ [DB] Failed to mark email sent:", error);
    return { success: false };
  }
}

/**
 * Get all registrations for an email (for debugging)
 */
export async function getRegistrationsByEmail(email: string) {
  try {
    const db = await getDb();
  if (!db) throw new Error("Database not available");
    const results = await db
      .select()
      .from(registrations)
      .where(eq(registrations.email, email.toLowerCase().trim()));

    return results;
  } catch (error) {
    console.error("❌ [DB] Failed to get registrations:", error);
    return [];
  }
}

/**
 * Clean up expired registrations (cron job helper)
 */
export async function cleanupExpiredRegistrations() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const now = new Date();

    const result = await db
      .update(registrations)
      .set({ status: "expired" })
      .where(
        and(
          eq(registrations.status, "active"),
          gt(registrations.expiresAt, now)
        )
      );

    console.log(`🧹 [DB] Cleaned up expired registrations`);
    return { success: true };
  } catch (error) {
    console.error("❌ [DB] Cleanup failed:", error);
    return { success: false };
  }
}
