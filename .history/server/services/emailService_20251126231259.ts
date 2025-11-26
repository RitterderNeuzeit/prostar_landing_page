import nodemailer from "nodemailer";

// Configure email transporter (cached singleton)
let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter if credentials are available
 */
function initializeTransporter() {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    console.warn(
      "⚠️ Email service not configured: EMAIL_USER or EMAIL_PASSWORD missing"
    );
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    console.log("✅ Email transporter initialized");
    return transporter;
  } catch (error) {
    console.error("❌ Failed to initialize email transporter:", error);
    return null;
  }
}

/**
 * Check if email service is properly configured.
 * Returns true if both EMAIL_USER and EMAIL_PASSWORD env vars are set.
 */
export function isEmailServiceConfigured(): boolean {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  return !!(emailUser && emailPassword);
}

/**
 * Generate HTML email template with tracking pixel.
 * 
 * Includes:
 * - Professional responsive design
 * - Access code and direct link
 * - Expiration date (90 days)
 * - Tracking pixel for open rate monitoring
 * - Email-specific headers for debugging
 */
function generateEmailTemplate(data: {
  name: string;
  email: string;
  accessKey: string;
  courseName: string;
  expiresAt: Date;
}): string {
  const { name, email, accessKey, courseName, expiresAt } = data;
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const accessUrl = `${siteUrl}/course-access?key=${encodeURIComponent(accessKey)}&email=${encodeURIComponent(email)}`;
  const trackingPixelUrl = `${siteUrl}/api/email/open?key=${encodeURIComponent(accessKey)}&email=${encodeURIComponent(email)}`;

  const expiresAtFormatted = expiresAt.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen zum ${courseName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .cta-button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: bold;
        }
        .cta-button:hover {
            background-color: #0056b3;
        }
        .code-box {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            margin: 20px 0;
            word-break: break-all;
        }
        .footer {
            color: #666;
            font-size: 12px;
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 10px;
            border-radius: 4px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Willkommen zum ${courseName}! 🎉</h1>
        
        <p>Liebe/r ${name},</p>
        
        <p>vielen Dank für deine Anmeldung zum <strong>${courseName}</strong>. Wir freuen uns, dich an Bord zu haben!</p>
        
        <p>Um auf deinen Kurs zuzugreifen, nutze folgenden Zugangs-Code:</p>
        
        <div class="code-box">${accessKey}</div>
        
        <p>Alternativ kannst du direkt hier zugreifen:</p>
        <a href="${accessUrl}" class="cta-button">Zum Kurs →</a>
        
        <div class="warning">
            <strong>⏰ Wichtig:</strong> Dieser Code ist gültig bis ${expiresAtFormatted} (90 Tage).
        </div>
        
        <p>Falls du Fragen hast, antworte einfach auf diese E-Mail oder kontaktiere uns über unsere Website.</p>
        
        <p>Viel Erfolg beim Lernen!</p>
        
        <p>Mit freundlichen Grüßen,<br>Das ProStar Team</p>
        
        <div class="footer">
            <p>Diese E-Mail wurde speziell für ${email} erstellt. Wenn du diese E-Mail versehentlich erhalten hast, ignoriere sie bitte einfach.</p>
            <img src="${trackingPixelUrl}" alt="" width="1" height="1" style="display: none;">
        </div>
    </div>
</body>
</html>
`;
}

/**
 * Send course access email with retry logic.
 * 
 * Flow:
 * 1. Check if email service configured
 * 2. Generate HTML template
 * 3. Try to send (3 attempts with exponential backoff)
 * 4. Include custom headers for debugging
 * 
 * Returns: { success, messageId? } or { success: false, error }
 */
export async function sendCourseAccessEmail(data: {
  name: string;
  email: string;
  accessKey: string;
  courseName: string;
  expiresAt: Date;
}): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const { name, email, accessKey, courseName } = data;

  try {
    // Check if email service is configured
    if (!isEmailServiceConfigured()) {
      console.warn("⚠️ Email service not configured");
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    // Initialize transporter
    const emailTransporter = initializeTransporter();
    if (!emailTransporter) {
      console.error("❌ Failed to initialize email transporter");
      return {
        success: false,
        error: "Email transporter initialization failed",
      };
    }

    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const htmlContent = generateEmailTemplate(data);

    console.log(`📧 [EMAIL] Sending to ${email}...`);

    // Send email with retry logic
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const info = await emailTransporter.sendMail({
          from: emailFrom,
          to: email,
          subject: `Dein Zugang zum ${courseName} 🎓`,
          html: htmlContent,
          text: `
Liebe/r ${name},

willkommen zum ${courseName}!

Dein Zugangs-Code: ${accessKey}

Dieser Code ist gültig für 90 Tage.

Mit freundlichen Grüßen,
Das ProStar Team
          `.trim(),
          headers: {
            "X-Access-Key": accessKey,
            "X-Course-Name": courseName,
            "X-Recipient-Email": email,
          },
        });

        console.log(`✅ Email sent successfully. Message ID: ${info.messageId}`);
        return {
          success: true,
          messageId: info.messageId,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `⚠️ Email send attempt ${attempt}/3 failed:`,
          lastError.message
        );

        if (attempt < 3) {
          // Wait before retry (exponential backoff)
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // All retry attempts failed
    console.error(
      `❌ Email send failed after 3 attempts: ${lastError?.message}`
    );
    return {
      success: false,
      error: lastError?.message || "Email send failed after multiple attempts",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(`❌ sendCourseAccessEmail error: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send generic email with retry logic (for other notifications).
 * 
 * Uses same retry logic as sendCourseAccessEmail for consistency.
 * Returns: { success, messageId? } or { success: false, error }
 */
export async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    if (!isEmailServiceConfigured()) {
      return {
        success: false,
        error: "Email service not configured",
      };
    }

    const emailTransporter = initializeTransporter();
    if (!emailTransporter) {
      return {
        success: false,
        error: "Email transporter initialization failed",
      };
    }

    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    // Send email with retry logic for consistency
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const info = await emailTransporter.sendMail({
          from: emailFrom,
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        });

        console.log(`✅ Generic email sent successfully. Message ID: ${info.messageId}`);
        return {
          success: true,
          messageId: info.messageId,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < 3) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error(`❌ Generic email send failed after 3 attempts: ${lastError?.message}`);
    return {
      success: false,
      error: lastError?.message || "Email send failed after multiple attempts",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("❌ sendEmail error:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
