#!/usr/bin/env tsx
import { verifyAccessKey } from "../server/services/courseService";
const DEMO_MODE = !process.env.DATABASE_URL;

async function run() {
  const argv = process.argv.slice(2);
  const emailArg = argv.find(a => a.startsWith("--email="));
  const keyArg = argv.find(a => a.startsWith("--key="));

  const email = emailArg ? emailArg.split("=")[1] : process.env.VERIFY_EMAIL;
  const key = keyArg ? keyArg.split("=")[1] : process.env.VERIFY_KEY;

  if (!email || !key) {
    console.error(
      "Usage: tsx scripts/verify-key.ts --email=you@example.com --key=access_key_here"
    );
    process.exit(1);
  }

  if (DEMO_MODE) {
    console.warn("[DEMO_MODE] Keine DB erkannt. Demo-Flow wird ausgeführt.");
    console.log("Demo-Verification:", {
      valid: true,
      name: email.split("@")[0],
      email,
      courseName: "demo-course",
    });
    process.exit(0);
  }
  try {
    console.log(`Verifying key for ${email} -> ${key}`);
    const res = await verifyAccessKey(email, key);
    console.log("Result:", res);
    process.exit(0);
  } catch (err) {
    console.error("Verification failed:", err);
    process.exit(2);
  }
}

run();
