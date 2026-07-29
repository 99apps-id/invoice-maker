import { Router, type NextFunction, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../db.js';
import { sendWelcomeEmail } from '../mailer.js';

const router = Router();
const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(googleClientId);
const tokenIssuer = 'tagih-dong-api';
const tokenAudience = 'tagih-dong-web';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret.includes('CHANGE_THIS')) {
    throw new Error('JWT_SECRET wajib berupa secret acak minimal 32 karakter');
  }
  return secret;
};

export function authenticateToken(req: any, res: Response, next: NextFunction) {
  const [scheme, token] =
    typeof req.headers.authorization === 'string'
      ? req.headers.authorization.split(' ')
      : [];
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Autentikasi diperlukan' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      issuer: tokenIssuer,
      audience: tokenAudience,
    });
    if (typeof payload === 'string' || !payload.userId || !payload.email) {
      return res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
  }
}

export function requireAdmin(req: any, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Autentikasi diperlukan' });
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses admin diperlukan' });
  }
  next();
}

router.post('/google', async (req, res) => {
  try {
    const credential = typeof req.body?.credential === 'string' ? req.body.credential : '';
    if (!googleClientId || googleClientId.startsWith('YOUR_')) {
      return res.status(503).json({ error: 'Login Google belum dikonfigurasi pada server' });
    }
    if (!credential || credential.length > 12_000) {
      return res.status(400).json({ error: 'Credential Google tidak valid' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ error: 'Token Google tidak valid atau sudah kedaluwarsa' });
    }

    if (!payload?.email || !payload.sub || payload.email_verified !== true) {
      return res.status(401).json({ error: 'Email Google belum terverifikasi' });
    }

    const email = payload.email.toLowerCase().trim();
    const name = (payload.name || 'Pengguna Tagih Dong').trim().slice(0, 120);
    const picture = (payload.picture || '').slice(0, 2048);
    const googleId = payload.sub;

    const existing = await query(
      'SELECT * FROM users WHERE email = $1 OR google_id = $2',
      [email, googleId]
    );

    let user = existing.rows[0];
    let isNewUser = false;
    if (user) {
      const updated = await query(
        'UPDATE users SET name = $1, picture = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [name, picture, user.id]
      );
      user = updated.rows[0];
    } else {
      isNewUser = true;
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
      const role = adminEmails.includes(email) ? 'admin' : 'user';
      const inserted = await query(
        'INSERT INTO users (email, google_id, name, picture, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [email, googleId, name, picture, role]
      );
      user = inserted.rows[0];
      await query(
        `INSERT INTO user_profiles
          (user_id, name, owner_name, email, default_currency, business_type, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [user.id, `${name} Studio`.slice(0, 160), name, email, 'IDR', 'general', true]
      );
      void sendWelcomeEmail(email, name).catch((error) =>
        console.error('Gagal mengirim email sambutan:', error)
      );
    }

    const profiles = await query(
      'SELECT * FROM user_profiles WHERE user_id = $1 ORDER BY is_default DESC',
      [user.id]
    );
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      getJwtSecret(),
      {
        expiresIn: '8h',
        algorithm: 'HS256',
        issuer: tokenIssuer,
        audience: tokenAudience,
      }
    );

    return res.json({
      success: true,
      isNewUser,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
      profiles: profiles.rows,
    });
  } catch (error) {
    console.error('Google Auth API Error:', error);
    return res.status(500).json({ error: 'Gagal melakukan login Google' });
  }
});

router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, picture, role FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    const profiles = await query(
      'SELECT * FROM user_profiles WHERE user_id = $1 ORDER BY is_default DESC',
      [req.user.userId]
    );
    return res.json({ user: result.rows[0], profiles: profiles.rows });
  } catch {
    return res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
});

router.put('/me', authenticateToken, async (req: any, res) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim().slice(0, 120) : null;
    const picture =
      typeof req.body?.picture === 'string' ? req.body.picture.trim().slice(0, 2048) : null;
    if (!name && !picture) {
      return res.status(400).json({ error: 'Tidak ada data profil yang valid' });
    }
    const updated = await query(
      `UPDATE users SET
        name = COALESCE($1, name), picture = COALESCE($2, picture), updated_at = NOW()
       WHERE id = $3 RETURNING id, email, name, picture, role`,
      [name, picture, req.user.userId]
    );
    if (!updated.rows.length) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    return res.json({ success: true, user: updated.rows[0] });
  } catch {
    return res.status(500).json({ error: 'Gagal memperbarui profil pengguna' });
  }
});

router.get('/admin/users', authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const users = await query(
      `SELECT
        u.id,
        u.email,
        u.name,
        u.picture,
        u.role,
        u.created_at,
        (SELECT COUNT(*)::int FROM user_profiles p WHERE p.user_id = u.id) AS profiles_count,
        (SELECT COUNT(*)::int FROM invoices i WHERE i.user_id = u.id) AS invoices_count,
        (SELECT COALESCE(SUM(ii.quantity * ii.unit_price), 0)::float
         FROM invoices i
         JOIN invoice_items ii ON ii.invoice_id = i.id
         WHERE i.user_id = u.id) AS total_volume
       FROM users u
       ORDER BY u.created_at DESC`
    );
    return res.json(users.rows);
  } catch {
    return res.status(500).json({ error: 'Gagal mengambil daftar pengguna' });
  }
});

export default router;
