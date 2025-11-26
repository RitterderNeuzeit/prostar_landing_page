const nodemailer = require("nodemailer");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

async function main() {
  const to = process.argv[2] || "info.prostar@gmx.de";
  const name = process.argv[3] || "Test Empfänger";

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("ERROR: EMAIL_USER or EMAIL_PASSWORD not set in .env");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const accessKey = crypto.randomBytes(16).toString("hex");
  const accessUrl = `${process.env.SITE_URL || "http://localhost:3000"}/course/access?key=${accessKey}`;
  const html = `<p>Hallo ${name},</p>
<p>Dies ist ein Test der ProStar Kurs Email-Automatisierung.</p>
<p>Dein Test-Zugriffscode: <strong style="font-family:monospace">${accessKey}</strong></p>
<p><a href="${accessUrl}">Zum Kurs (Test-Link)</a></p>
<p>Antwortadresse: ${process.env.REPLY_TO_EMAIL || process.env.EMAIL_USER}</p>`;

  try {
    const info = await transporter.sendMail({
      from: `"ProStar Marketing" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Test: Kurs-Zugang von ProStar Marketing`,
      text: `Hallo ${name},\n\nDies ist ein Test. Dein Code: ${accessKey}\nZugang: ${accessUrl}\n`,
      html,
      replyTo: process.env.REPLY_TO_EMAIL || process.env.EMAIL_USER,
    });

    console.log("✅ Test-E-Mail gesendet. messageId=", info.messageId);
    console.log("To:", to);
    console.log("AccessKey:", accessKey);
    process.exit(0);
  } catch (err) {
    console.error("❌ Fehler beim Senden der Test-E-Mail:");
    console.error(err);
    process.exit(2);
  }
}

main();
