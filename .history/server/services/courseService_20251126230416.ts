import { v4 as uuidv4 } from "uuid";
import {
  createCourseRegistration,
  getCourseRegistrationByAccessKey,
  updateCourseRegistrationAccessed,
} from "../db";

/**
 * Generate unique access key for course with email tag
 * Format: <email_hash>_<random_code>
 * This ensures the code is tied to a specific email
 */
export function generateAccessKey(email: string): string {
  // Tag: Nur Buchstaben/Zahlen, max 8 Zeichen
  const rawTag = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const emailTag = rawTag.substring(0, 8);
  const randomCode = uuidv4().replace(/-/g, "").substring(0, 20);
  return `${emailTag}_${randomCode}`;
}

/**
 * Create course registration record
 */
export async function registerForCourse(data: {
  name: string;
  email: string;
  courseName?: string;
}) {
  const accessKey = generateAccessKey(data.email);
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
    // DEV-Modus: Ignoriere DB-Fehler und gib trotzdem AccessKey zurück
    if (process.env.NODE_ENV === "development") {
      return {
        success: true,
        accessKey,
        expiresAt,
        registration: null,
      };
    }
    // Für Sicherheit: Loggen und Fallback zurückgeben (Email kann trotzdem gesendet werden)
    console.warn("⚠️ Falling back: Email wird trotzdem gesendet (DB fehlt)");
    return {
      success: true,
      accessKey,
      expiresAt,
      registration: null,
      dbError: true,
    };
  }
}

/**
 * Verify access key and email, then update access tracking
 * Key format: <email_tag>_<code>
 */
export async function verifyAccessKey(email: string, accessKey: string) {
  try {
    // Input validation
    if (!email || typeof email !== "string") {
      return { valid: false, error: "Email ist erforderlich" };
    }
    if (!accessKey || typeof accessKey !== "string") {
      return { valid: false, error: "Code ist erforderlich" };
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { valid: false, error: "Ungültige Email-Adresse" };
    }

    // Validate key format
    if (!accessKey.includes("_")) {
      return { valid: false, error: "Ungültiges Code-Format" };
    }

    const [emailTag, code] = accessKey.split("_");
    // Tag aus Email: Nur Buchstaben/Zahlen, max 8 Zeichen
    const rawTag = normalizedEmail
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const expectedTag = rawTag.substring(0, 8);

    // Check if email tag matches
    if (emailTag !== expectedTag) {
      console.warn(`❌ Email tag mismatch: "${emailTag}" != "${expectedTag}"`);
      return {
        valid: false,
        error: "Code passt nicht zu dieser Email-Adresse",
      };
    }

    // Look up registration by email and code
    let registration;
    let dbErrorFlag = false;
    try {
      registration = await getCourseRegistrationByAccessKey(accessKey);
      console.log("🔍 [Verify] DB lookup result:", {
        found: !!registration,
        accessKey,
        emailTag,
        expectedTag,
      });
    } catch (dbError) {
      console.warn("⚠️ Database lookup failed:", dbError);
      dbErrorFlag = true;
    }

    // DEV MODE: Akzeptiere jeden Code mit passendem Tag
    if (process.env.NODE_ENV === "development" && emailTag === expectedTag) {
      console.warn("⚠️ [DEV MODE] Code akzeptiert: Tag passt, Code beliebig");
      return {
        valid: true,
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        courseName: "free-mini-course",
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      };
    }
    if (!registration) {
      console.error("❌ [Verify] Registration not found. Email:", normalizedEmail, "Code:", accessKey);
      return { valid: false, error: "Code nicht gefunden oder abgelaufen" };
    }

    // Verify email matches (case-insensitive)
    if (registration.email.toLowerCase() !== normalizedEmail) {
      return {
        valid: false,
        error: "Email-Mismatch: Code gehört zu anderer Email-Adresse",
      };
    }

    // Check expiration
    if (
      registration.expiresAt &&
      new Date() > new Date(registration.expiresAt)
    ) {
      return {
        valid: false,
        error: "Code ist abgelaufen — bitte melde dich neu an",
      };
    }

    // Check status
    if (registration.status !== "active") {
      return { valid: false, error: `Zugang ist ${registration.status}` };
    }

    // Update accessed timestamp
    try {
      await updateCourseRegistrationAccessed(accessKey);
    } catch (updateError) {
      console.warn("⚠️ Failed to update access timestamp:", updateError);
      // Don't fail verification just because we can't update tracking
    }

    return {
      valid: true,
      name: registration.name,
      email: registration.email,
      courseName: registration.courseName,
      expiresAt: registration.expiresAt,
    };
  } catch (error) {
    console.error("❌ Verification error:", error);
    return {
      valid: false,
      error: "Verifizierung fehlgeschlagen — bitte versuche es später",
    };
  }
}
