import "dotenv/config";
import { chromium } from "playwright";
import { exec } from "child_process";

async function run() {
  const url = process.env.SITE_URL || "http://localhost:3000";
  const pageUrl = `${url.replace(/\/$/, "")}/mini-course`;
  console.log(`[auto-e2e] Opening page: ${pageUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(pageUrl, { waitUntil: "networkidle" });

    // Try to read the email input value
    const emailValue = await page.locator('input[type="email"]').first().inputValue();

    if (!emailValue || emailValue.trim().length === 0) {
      console.error("[auto-e2e] Keine E-Mail im Formular gefunden. Bitte öffne die Seite und gib eine E-Mail ein oder liefere eine per CLI.");
      await browser.close();
      process.exit(2);
    }

    console.log(`[auto-e2e] Found email on landing page: ${emailValue}`);

    // Run the E2E script with the detected email
    const cmd = `DEMO_MODE=false npx tsx scripts/e2e-customer-flow.ts --email "${emailValue}" --name "LandingPageUser"`;
    console.log(`[auto-e2e] Running E2E command: ${cmd}`);

    const child = exec(cmd, { cwd: process.cwd(), env: process.env }, (err, stdout, stderr) => {
      if (err) {
        console.error(`[auto-e2e] E2E script failed:`, err);
        console.error(stderr);
        return;
      }
      console.log(`[auto-e2e] E2E script output:\n${stdout}`);
    });

    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);

    // Wait for the child to finish
    child.on("exit", async code => {
      console.log(`[auto-e2e] Child exited with code ${code}`);
      await browser.close();
      process.exit(code ?? 0);
    });
  } catch (error) {
    console.error("[auto-e2e] Error during automation:", error);
    await browser.close();
    process.exit(1);
  }
}

run();
