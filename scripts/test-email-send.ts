import { sendCourseAccessEmail } from "../server/services/emailService";

(async () => {
  try {
    const result = await sendCourseAccessEmail({
      name: "Testuser",
      email: "info.prostar@gmx",
      accessKey: "infopros_1234567890abcdef",
      courseName: "Testkurs",
      expiresAt: new Date(Date.now() + 86400000),
    });
    console.log("Email send result:", result);
  } catch (err) {
    console.error("Email send error:", err);
  }
})();
