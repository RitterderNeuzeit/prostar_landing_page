import nodemailer from "nodemailer";
import { ENV } from "../_core/env";

export interface CourseEmailData {
  name: string;
  email: string;
  accessKey: string;
  courseName: string;
  expiresAt: Date;
}

/**
 * Sends personalized course access email with unique key
 */
export async function sendCourseAccessEmail(data: CourseEmailData) {
  const accessUrl = `${process.env.SITE_URL}/course/access/${data.accessKey}`;
  const expiryDate = new Date(data.expiresAt).toLocaleDateString("de-DE");

  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dein kostenloses Mini-Kurs Zugang</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0099cc 0%, #0077a3 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f8fbff; padding: 30px; border-radius: 0 0 8px 8px; }
    .greeting { font-size: 18px; margin-bottom: 20px; }
    .key-box { background: white; border: 2px solid #0099cc; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .key-box .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .key-box .key { font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #0099cc; margin: 10px 0; }
    .button { display: inline-block; background: #0099cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .button:hover { background: #0077a3; }
    .info { background: #e3f2fd; padding: 15px; border-left: 4px solid #0099cc; margin: 20px 0; border-radius: 4px; font-size: 14px; }
    .footer { color: #999; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Willkommen!</h1>
      <p>Dein Zugang ist bereit</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hallo <strong>${data.name}</strong>,<br>
        herzlich willkommen! Vielen Dank, dass du dich für unseren kostenlosen Mini-Kurs angemeldet hast.
      </div>

      <p>Dein persönlicher Zugriffscode:</p>
      
      <div class="key-box">
        <div class="label">Dein Zugriffscode</div>
        <div class="key">${data.accessKey}</div>
      </div>

      <p style="text-align: center;">
        <a href="${accessUrl}" class="button">→ Zum Kurs</a>
      </p>

      <div class="info">
        <strong>⏰ Gültig bis:</strong> ${expiryDate}<br>
        <strong>📧 E-Mail:</strong> ${data.email}
      </div>

      <p>
        <strong>So startest du:</strong><br>
        1. Besuche den Link oben oder kopiere deinen Code<br>
        2. Gib deinen persönlichen Code ein<br>
        3. Sofort Zugang zum Kurs erhalten!
      </p>

      <p style="color: #666; font-size: 14px;">
        Falls du Fragen hast, antworte einfach auf diese E-Mail. Wir helfen dir gerne weiter!
      </p>
    </div>

    <div class="footer">
      <p>ProStar Marketing | Gratis Mini-Kurs</p>
      <p>© 2025 Alle Rechte vorbehalten</p>
    </div>
  </div>
</body>
</html>
  `;

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

  try {
    const info = await transporter.sendMail({
      from: `"ProStar Marketing" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `🎉 Dein kostenloses Mini-Kurs Zugang: ${data.courseName}`,
      html: htmlContent,
      text: textContent,
      replyTo: process.env.REPLY_TO_EMAIL || process.env.EMAIL_USER,
    });

    console.log(`✅ Email sent to ${data.email} (${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email error for ${data.email}:`, error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

/**
 * Verifies email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
}
