test('Kurszugang End-to-End', async ({ page }) => {
import { test, expect } from '@playwright/test';

// Hilfsfunktion: Access-Key direkt per API holen
async function fetchAccessKey(email: string) {
  const res = await fetch('http://localhost:3000/api/trpc/course.getLatestEmail?batch=1&input=%7B%7D');
  const data = await res.json();
  // Die API gibt das letzte registrierte Email-Objekt zurück
  // Wir nehmen an, dass es das Test-Email ist (da Testumgebung)
  // Alternativ: courseRegistrations direkt abfragen, falls API vorhanden
  // Hier: accessKey aus Email ableiten (z.B. nach Registrierung)
  // Fallback: Dummy-Key
  if (Array.isArray(data) && data[0]?.result?.data?.email === email && data[0]?.result?.data?.accessKey) {
    return data[0].result.data.accessKey;
  }
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

  // Schritt 3: Access-Key direkt per API holen
  const accessKey = await page.evaluate(fetchAccessKey, testEmail);
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
