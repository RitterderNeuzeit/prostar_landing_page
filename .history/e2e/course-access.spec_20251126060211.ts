import { test, expect } from '@playwright/test';

// Hilfsfunktion: Extrahiere Code aus Email-HTML (Mock/Intercept)
async function extractAccessKeyFromEmail(page) {
  // Hier müsste ein echter Mail-Provider/Maildev/Mailhog abgefragt werden
  // Für Demo: Wir nehmen einen statischen Wert oder intercepten die API
  // TODO: Anpassen für echtes E-Mail-System!
  return process.env.TEST_ACCESS_KEY || 'TEST_ACCESS_KEY';
}

test('Kurszugang End-to-End', async ({ page }) => {
  const testEmail = 'jonas.e2e@prostarmarketing.de';
  await page.goto('http://localhost:3000/course-access');

  // Schritt 1: Email eingeben und Code anfordern
  await page.fill('input[type="email"]', testEmail);
  await page.click('button:has-text("Code erhalten")');

  // Schritt 2: Warte auf Bestätigung/Hinweis
  await expect(page.locator('text=Code wurde automatisch versendet')).toBeVisible({ timeout: 5000 });

  // Schritt 3: (Simuliert) Code aus Email holen
  const accessKey = await extractAccessKeyFromEmail(page);
  await page.fill('input[type="text"]', accessKey);
  await page.click('button:has-text("Bestätigen")');

  // Schritt 4: Erfolgsnachricht abwarten
  await expect(page.locator('text=Erfolgreich angemeldet')).toBeVisible({ timeout: 5000 });

  // Schritt 5: Weiterleitung zum Kurs abwarten
  await page.waitForURL('**/course', { timeout: 5000 });
  await expect(page.locator('text=KI-Prompting-Kurs')).toBeVisible();
  await expect(page.locator('text=Kein Kurszugriff')).not.toBeVisible();

  // Schritt 6: localStorage prüfen
  const userEmail = await page.evaluate(() => localStorage.getItem('userEmail'));
  const userTier = await page.evaluate(() => localStorage.getItem(`userTier_${userEmail}`));
  expect(userEmail).toBe(testEmail);
  expect(userTier).toBe('starter');
});
