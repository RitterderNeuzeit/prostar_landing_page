import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { upsertUser } from '../db';
import { registrationCache } from './registrationCache';
import { verifyAccessKey } from './courseService';

export async function finalizeRegistration(params: { email: string; accessKey: string; password: string; name?: string; }) {
  const { email, accessKey, password, name } = params;

  // 1. Verify access key
  const verifyResult = await verifyAccessKey(email, accessKey);
  if (!verifyResult.valid) {
    return { success: false, error: verifyResult.error || 'Verifikation fehlgeschlagen' } as const;
  }

  // 2. Ensure not already used
  const reg = registrationCache.get(accessKey);
  if (!reg) {
    return { success: false, error: 'Registrierung nicht gefunden' } as const;
  }
  if (reg.status === 'used') {
    return { success: false, error: 'Code bereits verwendet' } as const;
  }

  // 3. Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 4. Create local user (openId synthetic)
  const openId = `local_${uuidv4()}`;
  try {
    await upsertUser({
      openId,
      email,
      name: name || verifyResult.name || email.split('@')[0],
      loginMethod: 'local',
      passwordHash,
      role: 'user',
      lastSignedIn: new Date(),
    });
  } catch (error) {
    return { success: false, error: 'User konnte nicht erstellt werden' } as const;
  }

  // 5. Mark registration as used
  registrationCache.update(accessKey, { status: 'used', accessedAt: new Date() } as any);

  return { success: true, user: { openId, email } } as const;
}
