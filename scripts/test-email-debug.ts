import nodemailer from 'nodemailer';

const emailUser = 'info@prostarmarketing.de';
const emailPassword = 'pefn vhlu yeqm ghll';

console.log('🔍 Email-Test starten...');
console.log('User:', emailUser);
console.log('');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
  debug: true,
  logger: true,
});

(async () => {
  try {
    console.log('📍 Überprüfe SMTP-Verbindung...');
    await transporter.verify();
    console.log('✅ SMTP-Verbindung OK!\n');

    console.log('📍 Versende Test-E-Mail zu: info.loco@gmx.de');
    
    const result = await transporter.sendMail({
      from: `ProStar Marketing <${emailUser}>`,
      to: 'info.loco@gmx.de',
      subject: '🧪 Test-E-Mail von ProStar',
      html: `
        <h2>Test erfolgreich!</h2>
        <p>Diese E-Mail wurde von ProStar gesendet.</p>
        <p>Zeit: ${new Date().toLocaleString('de-DE')}</p>
      `,
    });

    console.log('✅ E-Mail versendet!');
    console.log('Message ID:', result.messageId);
    console.log('\n🎉 Überprüfen Sie Ihr Postfach: info.loco@gmx.de');
  } catch (error: any) {
    console.error('❌ Fehler:', error.message);
    if (error.response) console.error('Response:', error.response);
  }
})();
