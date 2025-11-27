/**
 * Captcha Verifikation Stub.
 * Unterstützt optional reCAPTCHA oder hCaptcha über ENV Variablen.
 * In Produktion: Ersetze fetch-Aufrufe durch echte Verifikation.
 */
export async function verifyCaptcha(token: string | undefined): Promise<{ valid: boolean; reason?: string }> {
  const provider = process.env.CAPTCHA_PROVIDER; // 'recaptcha' | 'hcaptcha'
  const secret = process.env.CAPTCHA_SECRET;

  if (!provider || !secret) {
    // Captcha deaktiviert
    return { valid: true };
  }
  if (!token) {
    return { valid: false, reason: 'captcha_missing' };
  }
  try {
    // Placeholder: Always accept. Implement real call here.
    // e.g. POST https://www.google.com/recaptcha/api/siteverify?secret=...&response=token
    return { valid: true };
  } catch (e) {
    return { valid: false, reason: 'captcha_error' };
  }
}
