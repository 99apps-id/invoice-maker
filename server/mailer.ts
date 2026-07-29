import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// Zoho Mail SMTP Transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtppro.zoho.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // SSL for 465
  auth: {
    user: process.env.SMTP_USER || 'support@99apps.id',
    pass: process.env.SMTP_PASS,
  },
  disableFileAccess: true,
  disableUrlAccess: true,
  tls: {
    rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
  },
});

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!
  );

/**
 * Send Welcome Email to New User via Zoho Mail (support@99apps.id)
 */
export async function sendWelcomeEmail(toEmail: string, userName: string) {
  if (!process.env.SMTP_PASS || process.env.SMTP_PASS === 'ISIKAN_APP_PASSWORD_ZOHO_DISINI') {
    console.log(`ℹ️ [Mailer Demo] Welcome Email for ${userName} (${toEmail}) skipped (SMTP_PASS not set).`);
    return;
  }

  const emailSender = process.env.EMAIL_FROM || 'Tagih Dong <support@99apps.id>';
  const safeName = escapeHtml(userName.slice(0, 120));
  const safeEmail = escapeHtml(toEmail.slice(0, 254));

  const mailOptions = {
    from: emailSender,
    to: toEmail,
    subject: 'Selamat Datang di Tagih Dong! 🚀 - Pembuat Invoice Profesional',
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 12px; line-height: 48px; color: #ffffff; font-weight: bold; font-size: 20px;">
            📄
          </div>
          <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin-top: 12px; margin-bottom: 4px;">Tagih Dong</h1>
          <p style="color: #64748b; font-size: 13px; margin: 0;">Pembuat Invoice Bisnis Profesional</p>
        </div>

        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />

        <div style="color: #334155; font-size: 14px; line-height: 1.6;">
          <p>Halo <strong>${safeName}</strong>,</p>
          <p>Terima kasih telah bergabung dan mendaftar di <strong>Tagih Dong</strong> menggunakan akun Google Anda (<code>${safeEmail}</code>).</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #1e1b4b; font-size: 13px;">✨ Fitur yang Siap Anda Gunakan:</p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #475569; font-size: 13px;">
              <li>Menerbitkan invoice profesional dengan 24 template kertas putih ramah tinta.</li>
              <li>Menyimpan katalog produk/barang & layanan jasa.</li>
              <li>Manajemen data klien & multi-profil usaha.</li>
              <li>Metode pembayaran QRIS Statis opsional dengan fasilitas crop interaktif.</li>
            </ul>
          </div>

          <p>Jika Anda memiliki pertanyaan atau butuh bantuan, tim support kami siap membantu di <a href="mailto:support@99apps.id" style="color: #4f46e5; text-decoration: none; font-weight: bold;">support@99apps.id</a>.</p>
        </div>

        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />

        <div style="text-align: center; color: #94a3b8; font-size: 11px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Tagih Dong by 99apps.id. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Welcome Email sent via Zoho Mail to ${toEmail}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send Welcome Email via Zoho Mail to ${toEmail}:`, error);
  }
}
