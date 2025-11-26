import nodemailer from "nodemailer";
import { ENV } from "../_core/env";

// Debug: Log loaded email config at startup
console.log("[EmailService] ENV.emailUser:", ENV.emailUser);
console.log(
  "[EmailService] ENV.emailPassword:",
  ENV.emailPassword ? "***" : "(leer)"
);
console.log("[EmailService] ENV.siteUrl:", ENV.siteUrl);

export interface CourseEmailData {
  name: string;
  email: string;
  accessKey: string;
  courseName: string;
  expiresAt: Date;
}

/**
 * Retry configuration for email sends
 */
const EMAIL_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 1000,
  timeoutMs: 10000,
};

/**
 * Validates email format and configuration
 */
function validateEmailData(data: CourseEmailData): {
  valid: boolean;
  error?: string;
} {
  if (!data.name || data.name.trim().length === 0) {
    return { valid: false, error: "Invalid name" };
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }
  if (!data.accessKey || data.accessKey.length < 10) {
    return { valid: false, error: "Invalid access key" };
  }
  if (!ENV.emailUser || !ENV.emailPassword) {
    return { valid: false, error: "Email service not configured" };
  }
  return { valid: true };
}

/**
 * Sends personalized course access email with unique key
 * Includes retry logic and comprehensive error handling
 */
export async function sendCourseAccessEmail(
  data: CourseEmailData,
  attempt: number = 1
): Promise<{ success: boolean; messageId?: string }> {
  try {
    // Validate input
    const validation = validateEmailData(data);
    if (!validation.valid) {
      console.error(`❌ Email validation failed: ${validation.error}`);
      throw new Error(`Email validation failed: ${validation.error}`);
    }

    // SMTP-Debug-Logging
    console.log("[SMTP] Initialisiere Transporter mit:", {
      user: ENV.emailUser,
      pass: ENV.emailPassword ? "***" : "(leer)",
      service: "gmail",
      timeout: EMAIL_RETRY_CONFIG.timeoutMs,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ENV.emailUser,
        pass: ENV.emailPassword,
      },
      connectionTimeout: EMAIL_RETRY_CONFIG.timeoutMs,
      socketTimeout: EMAIL_RETRY_CONFIG.timeoutMs,
      logger: true,
      debug: true,
    });

    const accessUrl = `${ENV.siteUrl}/course/access?key=${data.accessKey}&email=${encodeURIComponent(data.email)}`;
    // Add tracking pixel URL (non-cachable) so opening the email can be registered
    const trackingPixelUrl = `${ENV.siteUrl}/api/email/open?key=${data.accessKey}&email=${encodeURIComponent(
      data.email
    )}&_t=${Date.now()}`;
    const expiryDate = new Date(data.expiresAt).toLocaleDateString("de-DE");

    // Email template using table layout + inline styles for best client compatibility
    const htmlContent = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Dein Mini-Kurs Zugang</title>
  </head>
  <body style="margin:0;padding:0;background:#f2fbff;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
            <tr>
              <td style="background:linear-gradient(90deg,#06b6d4,#0ea5e9);padding:28px 24px;color:#fff;text-align:center;">
                <h1 style="margin:0;font-size:22px;line-height:1.2">🎉 Dein Gratis Mini-Kurs</h1>
                <p style="margin:6px 0 0;font-size:14px;opacity:0.95">Dein Zugang ist bereit — schnell loslegen!</p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 24px 10px;color:#0f172a;">
                <p style="margin:0 0 12px;font-size:15px">Hallo <strong style="color:#0f172a">${data.name}</strong>,</p>
                <p style="margin:0 0 18px;color:#334155;font-size:14px;">Danke für deine Anmeldung. Unten findest du deinen persönlichen Zugriffscode und einen Direktlink zum Kurs.</p>

                <!-- Key box -->
                <div style="background:#f8fafc;border:1px solid #c7f0fb;padding:14px;border-radius:6px;margin:12px 0;">
                  <div style="font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Dein Zugriffscode</div>
                  <div style="font-family:Menlo,Monaco,monospace;font-size:18px;color:#0369a1;font-weight:700;background:#fff;padding:10px;border-radius:4px;text-align:center;word-break:break-all;">${data.accessKey}</div>
                </div>

                <p style="margin:10px 0 18px;font-size:14px;color:#334155;text-align:center;">
                  <a href="${accessUrl}" style="display:inline-block;padding:12px 20px;background:#06b6d4;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">→ Zum Kurs</a>
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:6px;">
                  <tr>
                    <td style="vertical-align:top;padding:10px 0 0;">
                      <div style="background:#eef2ff;padding:10px;border-radius:6px;border:1px solid #e0e7ff;font-size:13px;color:#3730a3;">
                        <strong>⏰ Gültig bis:</strong> ${expiryDate}
                      </div>
                    </td>
                    <td style="vertical-align:top;padding:10px 0 0;text-align:right;">
                      <div style="font-size:13px;color:#475569;">E-Mail: <strong>${data.email}</strong></div>
                    </td>
                  </tr>
                </table>

                <p style="margin:18px 0 0;font-size:13px;color:#64748b;">Wenn der Link nicht funktioniert, kopiere den Code oben und füge ihn auf der Seite ein: <code style="background:#f1f5f9;padding:3px 6px;border-radius:4px;font-family:Menlo,monospace;">${data.accessKey}</code></p>
              </td>
            </tr>

            <tr>
              <td style="background:#f8fafc;padding:14px 24px;color:#475569;text-align:center;font-size:12px;border-top:1px solid #eef2ff;">
                <div>Fragen? Antworte auf diese E-Mail oder schreibe an <a href="mailto:${ENV.replyToEmail || ENV.emailUser}" style="color:#0ea5e9;text-decoration:none">${ENV.replyToEmail || ENV.emailUser}</a></div>
                <div style="margin-top:6px;color:#94a3b8">ProStar Marketing • © ${new Date().getFullYear()}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!-- Tracking pixel (transparent 1x1) -->
    <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display:none!important;border:0!important;" />
  </body>
</html>`;

    const textContent = `
Hallo ${data.name},

herzlich willkommen! Vielen Dank, dass du dich für unseren kostenlosen Mini-Kurs angemeldet hast.

Dein persönlicher Zugriffscode:
${data.accessKey}

Zugang: ${accessUrl}

Gültig bis: ${expiryDate}

Viel Spaß im Kurs!
ProStar Marketing Team
  `;

    console.log(
      `[Email] Attempt ${attempt}/${EMAIL_RETRY_CONFIG.maxRetries + 1} - Sending to ${data.email}`
    );

    const info = await transporter.sendMail({
      from: `"ProStar Marketing" <${ENV.emailUser}>`,
      to: data.email,
      subject: `🎉 Dein kostenloses Mini-Kurs Zugang: ${data.courseName}`,
      html: htmlContent,
      text: textContent,
      replyTo: ENV.replyToEmail || ENV.emailUser,
    });

    console.log(`✅ Email sent to ${data.email} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(
      `❌ Email error (attempt ${attempt}/${EMAIL_RETRY_CONFIG.maxRetries + 1}): ${errorMsg}`
    );

    // Retry logic
    if (attempt < EMAIL_RETRY_CONFIG.maxRetries + 1) {
      console.log(`⏳ Retrying in ${EMAIL_RETRY_CONFIG.retryDelayMs}ms...`);
      await new Promise(resolve =>
        setTimeout(resolve, EMAIL_RETRY_CONFIG.retryDelayMs)
      );
      return sendCourseAccessEmail(data, attempt + 1);
    }

    // All retries exhausted
    throw new Error(
      `Failed to send email after ${EMAIL_RETRY_CONFIG.maxRetries + 1} attempts: ${errorMsg}`
    );
  }
}

/**
 * Verifies email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  const configured = !!(ENV.emailUser && ENV.emailPassword);
  if (!configured) {
    console.warn(
      "⚠️ Email service not configured: missing EMAIL_USER or EMAIL_PASSWORD in .env"
    );
  }
  return configured;
}
