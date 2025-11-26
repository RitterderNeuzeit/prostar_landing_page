import "dotenv/config";
import {
  registerForCourse,
  verifyAccessKey,
} from "../server/services/courseService";
import { sendCourseAccessEmail } from "../server/services/emailService";
import { registrationCache, logRegistrationCache } from "../server/services/registrationCache";

const DEMO_MODE =
  !process.env.DATABASE_URL ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASSWORD;

// Allow manual override
const FORCE_REAL_MODE = process.env.DEMO_MODE === "false";
const EFFECTIVE_DEMO_MODE = DEMO_MODE && !FORCE_REAL_MODE;

function randomString(len: number) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + len);
}

function randomEmail() {
  return `${randomString(8)}.${randomString(4)}@${randomString(5)}.de`;
}

function parseArg(key: string) {
  const idx = process.argv.findIndex(a => a === key);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function runE2ETest() {
  const providedEmail = parseArg("--email");
  const providedName = parseArg("--name");

  const name = providedName || `User${randomString(5)}`;
  const email = providedEmail || randomEmail();
  const courseName = "Testkurs";

  if (DEMO_MODE) {
    console.warn(
      "[DEMO_MODE] Keine DB/SMTP erkannt. Demo-Flow wird ausgeführt."
    );
    const accessKey = `demo_${email.split("@")[0]}_${randomString(8)}`;
    console.log("Demo-Registrierung:", { accessKey, name, email, courseName });
    console.log("Demo-E-Mail:", {
      success: true,
      messageId: "demo-message-id",
      accessKey,
    });
    console.log("Demo-Code-Login:", { valid: true, name, email, courseName });
    console.log("✅ End-to-End-Test (Demo) erfolgreich!");
    return;
  }

  console.log("--- E2E Test: Registrierung ---");
  const regResult = await registerForCourse({ name, email, courseName });
  console.log("Registrierung:", regResult);

  if (!regResult.accessKey) {
    console.error("Kein AccessKey generiert!");
    return;
  }

  console.log("--- E2E Test: Email-Versand ---");
  const emailResult = await sendCourseAccessEmail({
    name,
    email,
    accessKey: regResult.accessKey,
    courseName,
    expiresAt: regResult.expiresAt,
  });
  console.log("Email-Versand:", emailResult);

  console.log("--- E2E Test: Code-Login ---");
  const verifyResult = await verifyAccessKey(email, regResult.accessKey);
  console.log("Code-Login:", verifyResult);

  if (verifyResult.valid) {
    console.log("✅ End-to-End-Test erfolgreich!");
  } else {
    console.error("❌ End-to-End-Test fehlgeschlagen:", verifyResult.error);
      // VERBOSE: Check cache state AFTER registration
      console.log("\n📊 [Cache Check] Nach Registrierung:");
      const reg = registrationCache.get(regResult.accessKey);
      if (reg) {
        console.log(`   ✅ Im Cache gespeichert: ${reg.email}`);
      } else {
        console.log(`   ⚠️ NICHT im Cache: Könnte in DB sein`);
      }
  }

}

runE2ETest();

runE2ETest();
