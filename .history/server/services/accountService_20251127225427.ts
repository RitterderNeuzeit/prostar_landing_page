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

  // 2. Check if user already exists
  const { getUserByEmail } = await import('../db');
  const existingUser = await getUserByEmail(email);
  
  if (existingUser) {
    // User exists - update password only
    console.log(`ℹ️ [Account] User ${email} already exists - updating password`);
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    try {
      await upsertUser({
        openId: existingUser.openId,
        email,
        name: name || existingUser.name || verifyResult.name || email.split('@')[0],
        loginMethod: 'local',
        passwordHash,
        role: existingUser.role || 'user',
        lastSignedIn: new Date(),
      });
    } catch (error) {
      console.error('❌ [Account] User update failed:', error);
      return { success: false, error: 'User konnte nicht aktualisiert werden' } as const;
    }

    // Mark registration as used
    await markRegistrationAsUsed(accessKey);

    console.log(`✅ [Account] Updated existing user ${email}`);
    return { success: true, user: { openId: existingUser.openId, email } } as const;
  }

  // 3. Create new user
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
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

  // 4. Mark registration as used
  await markRegistrationAsUsed(accessKey);

  console.log(`✅ [Account] Created new user ${email}`);
  return { success: true, user: { openId, email } } as const;
}
