import { Router } from 'express';
import { query } from '../db.js';
import { authenticateToken } from './authSecure.js';
import { isRecord, isSafeId, isText } from '../validation.js';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: any, res) => {
  try {
    const clientsRes = await query('SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC', [
      req.user.userId,
    ]);
    res.json(
      clientsRes.rows.map((c) => ({
        id: c.id,
        profileId: c.profile_id,
        name: c.name,
        company: c.company || '',
        email: c.email || '',
        phone: c.phone || '',
        address: c.address || '',
        taxId: c.tax_id || '',
      }))
    );
  } catch {
    res.status(500).json({ error: 'Gagal mengambil data klien' });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const c = req.body;
    const userId = req.user.userId;
    if (
      !isRecord(c) ||
      !isSafeId(c.id) ||
      !isSafeId(c.profileId) ||
      !isText(c.name || '', 160) ||
      !isText(c.company || '', 160) ||
      (!String(c.name || '').trim() && !String(c.company || '').trim()) ||
      !isText(c.email || '', 254) ||
      !isText(c.phone || '', 100) ||
      !isText(c.address || '', 2000)
    ) {
      return res.status(400).json({ error: 'Data klien tidak valid atau terlalu panjang' });
    }

    const existingRes = await query('SELECT id FROM clients WHERE id = $1 AND user_id = $2', [c.id, userId]);

    if (existingRes.rows.length > 0) {
      await query(
        'UPDATE clients SET name = $1, company = $2, email = $3, phone = $4, address = $5, tax_id = $6, updated_at = NOW() WHERE id = $7 AND user_id = $8',
        [c.name, c.company, c.email, c.phone, c.address, c.taxId, c.id, userId]
      );
    } else {
      await query(
        'INSERT INTO clients (id, user_id, profile_id, name, company, email, phone, address, tax_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [c.id, userId, c.profileId, c.name, c.company, c.email, c.phone, c.address, c.taxId]
      );
    }

    res.json({ success: true, id: c.id });
  } catch {
    res.status(500).json({ error: 'Gagal menyimpan data klien' });
  }
});

router.delete('/:id', async (req: any, res) => {
  try {
    if (!isSafeId(req.params.id)) return res.status(400).json({ error: 'ID klien tidak valid' });
    await query('DELETE FROM clients WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gagal menghapus data klien' });
  }
});

export default router;
