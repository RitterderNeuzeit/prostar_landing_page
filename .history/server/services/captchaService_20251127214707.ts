/**
 * Captcha Verifikation mit echter Google reCAPTCHA v3 API.
 * Unterstützt optional reCAPTCHA oder hCaptcha über ENV Variablen.
 */
export async function verifyCaptcha(token: string | undefined): Promise<{ valid: boolean; reason?: string; score?: number }> {
  const provider = process.env.CAPTCHA_PROVIDER; // 'recaptcha' | 'hcaptcha'
  const secret = process.env.CAPTCHA_SECRET;

  if (!provider || !secret) {
    // Captcha deaktiviert
    console.log('[Captcha] Disabled - no provider configured');
    return { valid: true };
  }
  if (!token) {
    return { valid: false, reason: 'captcha_missing' };
  }

  try {
    if (provider === 'recaptcha') {
      // Google reCAPTCHA v3 Verifikation
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      });
      const data = await response.json() as { success: boolean; score?: number; 'error-codes'?: string[] };
      
      if (!data.success) {
        console.warn('[Captcha] reCAPTCHA verification failed:', data['error-codes']);
        return { valid: false, reason: 'captcha_failed' };
      }
      
      // reCAPTCHA v3 score check (0.0 = bot, 1.0 = human)
      const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');
      if (data.score !== undefined && data.score < minScore) {
        console.warn(`[Captcha] Score too low: ${data.score} < ${minScore}`);
        return { valid: false, reason: 'captcha_score_low', score: data.score };
      }
      
      console.log(`✅ [Captcha] reCAPTCHA verified (score: ${data.score})`);
      return { valid: true, score: data.score };
    } else if (provider === 'hcaptcha') {
      // hCaptcha Verifikation
      const response = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      });
      const data = await response.json() as { success: boolean; 'error-codes'?: string[] };
      
      if (!data.success) {
        console.warn('[Captcha] hCaptcha verification failed:', data['error-codes']);
        return { valid: false, reason: 'captcha_failed' };
      }
      
      console.log('✅ [Captcha] hCaptcha verified');
      return { valid: true };
    }
    
    return { valid: false, reason: 'unknown_provider' };
  } catch (e) {
    console.error('[Captcha] Verification error:', e);
    return { valid: false, reason: 'captcha_error' };
  }
}
