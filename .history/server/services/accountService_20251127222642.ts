import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { upsertUser } from '../db';
import { verifyAccessKey, markRegistrationAsUsed } from './courseServiceAuto';

export async function finalizeRegistration(params: { email: string; accessKey: string; password: string; name?: string; }) {
  const { email, accessKey, password, name } = params;

  // 1. Verify access key
  const verifyResult = await verifyAccessKey(email, accessKey);
  if (!verifyResult.valid) {
    return { success: false, error: verifyResult.error || 'Verifikation fehlgeschlagen' } as const;
  }

  // 2. Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 3. Create local user (openId synthetic)
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
    console.error('❌ [Account] User creation failed:', error);
    return { success: false, error: 'User konnte nicht erstellt werden' } as const;
  }

  // 4. Mark registration as used in database
  await markRegistrationAsUsed(accessKey);

  console.log(`✅ [Account] Finalized registration for ${email}`);

  return { success: true, user: { openId, email } } as const;
}
