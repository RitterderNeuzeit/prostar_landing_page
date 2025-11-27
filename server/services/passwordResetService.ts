import { v4 as uuidv4 } from 'uuid';
import * as db from '../db';

/**
 * In-Memory Reset Token Cache (Fallback wenn DB offline)
 */
interface ResetToken {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const resetTokenCache = new Map<string, ResetToken>();

/**
 * Generate reset token (24h validity)
 */
export function generateResetToken(email: string): { token: string; expiresAt: Date } {
  const token = uuidv4().replace(/-/g, '');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  return { token, expiresAt };
}

/**
 * Store reset token (Cache + future DB extension)
 */
export async function storeResetToken(email: string, token: string, expiresAt: Date): Promise<void> {
  const normalized = email.toLowerCase();
  resetTokenCache.set(token, {
    email: normalized,
    token,
    expiresAt,
    used: false,
    createdAt: new Date(),
  });
  console.log(`✅ [Reset] Token stored for ${normalized} (Cache)`);
  // TODO: Store in DB table when schema extended
}

/**
 * Verify reset token
 */
export async function verifyResetToken(token: string): Promise<{ valid: boolean; email?: string; error?: string }> {
  const cached = resetTokenCache.get(token);
  if (!cached) {
    return { valid: false, error: 'Token nicht gefunden oder abgelaufen' };
  }
  if (cached.used) {
    return { valid: false, error: 'Token bereits verwendet' };
  }
  if (new Date() > cached.expiresAt) {
    return { valid: false, error: 'Token abgelaufen' };
  }
  return { valid: true, email: cached.email };
}

/**
 * Mark token as used
 */
export async function markResetTokenUsed(token: string): Promise<void> {
  const cached = resetTokenCache.get(token);
  if (cached) {
    cached.used = true;
  }
  console.log(`✅ [Reset] Token marked as used`);
}

/**
 * Request password reset (generate + store token)
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; token?: string; expiresAt?: Date; error?: string }> {
  const normalized = email.toLowerCase();
  const user = await db.getUserByEmail(normalized);
  if (!user || !user.passwordHash) {
    // Security: Don't reveal if user exists
    console.warn(`⚠️ [Reset] No local user found for ${normalized}`);
    return { success: true }; // Always return success to prevent user enumeration
  }
  const { token, expiresAt } = generateResetToken(normalized);
  await storeResetToken(normalized, token, expiresAt);
  return { success: true, token, expiresAt };
}

/**
 * Complete password reset (verify token + update password)
 */
export async function completePasswordReset(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const verification = await verifyResetToken(token);
  if (!verification.valid) {
    return { success: false, error: verification.error };
  }
  const email = verification.email!;
  const user = await db.getUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Benutzer nicht gefunden' };
  }
  // Hash new password
  const bcrypt = (await import('bcryptjs')).default;
  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  // Update user
  await db.upsertUser({
    openId: user.openId,
    passwordHash,
  });
  
  // Mark token as used
  await markResetTokenUsed(token);
  
  console.log(`✅ [Reset] Password updated for ${email}`);
  return { success: true };
}
