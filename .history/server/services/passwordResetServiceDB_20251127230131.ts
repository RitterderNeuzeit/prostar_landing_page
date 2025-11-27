import { eq, and, gt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { getDb, getUserByEmail } from "../db";
import { passwordResetTokens, type InsertPasswordResetToken } from "../../drizzle/schema";

/**
 * Database-backed password reset service
 * Replaces in-memory cache with persistent MySQL storage
 */

/**
 * Generate UUID-based reset token
 */
export function generateResetToken(): string {
  return uuidv4();
}

/**
 * Store reset token in database
 */
export async function storeResetToken(email: string, token: string, expiresAt: Date) {
  try {
    const db = await getDb();
  if (!db) throw new Error("Database not available");
    
    const resetToken: InsertPasswordResetToken = {
      id: `rst_${uuidv4()}`,
      token,
      email: email.toLowerCase().trim(),
      used: 0,
      expiresAt,
    };

    await db.insert(passwordResetTokens).values(resetToken);

    console.log(`✅ [DB Reset] Token stored for ${email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ [DB Reset] Failed to store token:", error);
    return { success: false };
  }
}

/**
 * Verify reset token from database
 */
export async function verifyResetToken(token: string) {
  try {
    const db = await getDb();
  if (!db) throw new Error("Database not available");
    const now = new Date();

    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.used, 0),
          gt(passwordResetTokens.expiresAt, now)
        )
      )
      .limit(1);

    if (!resetToken) {
      console.warn("❌ [DB Reset] Token not found or expired");
      return { valid: false, error: "Token ungültig oder abgelaufen" };
    }

    console.log(`✅ [DB Reset] Token valid for ${resetToken.email}`);
    return {
      valid: true,
      email: resetToken.email,
      expiresAt: resetToken.expiresAt,
    };
  } catch (error) {
    console.error("❌ [DB Reset] Verification error:", error);
    return { valid: false, error: "Verifizierung fehlgeschlagen" };
  }
}

/**
 * Mark reset token as used
 */
export async function markResetTokenUsed(token: string) {
  try {
    const db = await getDb();
  if (!db) throw new Error("Database not available");
    await db
      .update(passwordResetTokens)
      .set({ used: 1 })
      .where(eq(passwordResetTokens.token, token));

    console.log(`✅ [DB Reset] Token marked as used`);
    return { success: true };
  } catch (error) {
    console.error("❌ [DB Reset] Failed to mark as used:", error);
    return { success: false };
  }
}

/**
 * Request password reset - generates token and returns it for email sending
 */
export async function requestPasswordReset(email: string) {
  try {
    // Check if user exists (but don't reveal this to prevent enumeration)
    const user = await getUserByEmail(email);
    
    if (!user) {
      console.log(`⚠️ [DB Reset] User not found: ${email} (returning success for security)`);
      // Return success to prevent user enumeration
      return { success: true, userExists: false };
    }

    // Generate token with 24h expiry
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store in database
    await storeResetToken(email, token, expiresAt);

    console.log(`✅ [DB Reset] Reset requested for ${email}`);

    return {
      success: true,
      userExists: true,
      token,
      expiresAt,
    };
  } catch (error) {
    console.error("❌ [DB Reset] Request failed:", error);
    return { success: false, error: "Anfrage fehlgeschlagen" };
  }
}

/**
 * Complete password reset - verify token and update password
 */
export async function completePasswordReset(token: string, newPassword: string) {
  try {
    // Verify token
    const verification = await verifyResetToken(token);
    if (!verification.valid) {
      return { success: false, error: verification.error };
    }

    const email = verification.email!;

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: "Benutzer nicht gefunden" };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    await db.execute(
      `UPDATE users SET passwordHash = ?, updatedAt = NOW() WHERE email = ?`,
      [passwordHash, email]
    );

    // Mark token as used
    await markResetTokenUsed(token);

    console.log(`✅ [DB Reset] Password reset completed for ${email}`);

    return { success: true };
  } catch (error) {
    console.error("❌ [DB Reset] Complete reset failed:", error);
    return { success: false, error: "Passwort-Reset fehlgeschlagen" };
  }
}

/**
 * Clean up expired tokens (cron job helper)
 */
export async function cleanupExpiredResetTokens() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const now = new Date();

    await db
      .delete(passwordResetTokens)
      .where(gt(passwordResetTokens.expiresAt, now));

    console.log(`🧹 [DB Reset] Cleaned up expired tokens`);
    return { success: true };
  } catch (error) {
    console.error("❌ [DB Reset] Cleanup failed:", error);
    return { success: false };
  }
}
