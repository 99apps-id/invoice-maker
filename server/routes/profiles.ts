import { Router } from 'express';
import { query } from '../db.js';
import { authenticateToken } from './authSecure.js';
import { isRecord, isSafeId, isText } from '../validation.js';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: any, res) => {
  try {
    const profilesRes = await query(
      'SELECT * FROM user_profiles WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC',
      [req.user.userId]
    );
    res.json(
      profilesRes.rows.map((p) => ({
        id: p.id,
        name: p.name,
        ownerName: p.owner_name || '',
        email: p.email || '',
        phone: p.phone || '',
        address: p.address || '',
        logoUrl: p.logo_url || '',
        taxId: p.tax_id || '',
        website: p.website || '',
        bankName: p.bank_name || '',
        bankAccountNo: p.bank_account_no || '',
        bankAccountName: p.bank_account_name || '',
        swiftCode: p.swift_code || '',
        qrisUrl: p.qris_url || '',
        defaultCurrency: p.default_currency || 'IDR',
        businessType: p.business_type || 'general',
        isDefault: p.is_default,
      }))
    );
  } catch {
    res.status(500).json({ error: 'Gagal mengambil profil usaha' });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const p = req.body;
    const userId = req.user.userId;
    if (
      !isRecord(p) ||
      !isSafeId(p.id) ||
      !isText(p.name, 160, true) ||
      !isText(p.ownerName || '', 160) ||
      !isText(p.email || '', 254) ||
      !isText(p.phone || '', 100) ||
      !isText(p.address || '', 4000) ||
      !isText(p.logoUrl || '', 2_000_000) ||
      !isText(p.qrisUrl || '', 2_000_000)
    ) {
      return res.status(400).json({ error: 'Data profil tidak valid atau terlalu panjang' });
    }

    if (p.isDefault) {
      await query('UPDATE user_profiles SET is_default = false WHERE user_id = $1', [userId]);
    }

    const existingRes = await query('SELECT id FROM user_profiles WHERE id = $1 AND user_id = $2', [
      p.id,
      userId,
    ]);

    if (existingRes.rows.length > 0) {
      await query(
        `UPDATE user_profiles SET
          name = $1, owner_name = $2, email = $3, phone = $4, address = $5, logo_url = $6, tax_id = $7,
          website = $8, bank_name = $9, bank_account_no = $10, bank_account_name = $11, swift_code = $12,
          qris_url = $13, default_currency = $14, business_type = $15, is_default = $16, updated_at = NOW()
        WHERE id = $17 AND user_id = $18`,
        [
          p.name,
          p.ownerName,
          p.email,
          p.phone,
          p.address,
          p.logoUrl,
          p.taxId,
          p.website,
          p.bankName,
          p.bankAccountNo,
          p.bankAccountName,
          p.swiftCode,
          p.qrisUrl,
          p.defaultCurrency || 'IDR',
          p.businessType || 'general',
          p.isDefault || false,
          p.id,
          userId,
        ]
      );
    } else {
      await query(
        `INSERT INTO user_profiles (
          id, user_id, name, owner_name, email, phone, address, logo_url, tax_id, website,
          bank_name, bank_account_no, bank_account_name, swift_code, qris_url, default_currency, business_type, is_default
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          p.id,
          userId,
          p.name,
          p.ownerName,
          p.email,
          p.phone,
          p.address,
          p.logoUrl,
          p.taxId,
          p.website,
          p.bankName,
          p.bankAccountNo,
          p.bankAccountName,
          p.swiftCode,
          p.qrisUrl,
          p.defaultCurrency || 'IDR',
          p.businessType || 'general',
          p.isDefault || false,
        ]
      );
    }

    res.json({ success: true, id: p.id });
  } catch {
    res.status(500).json({ error: 'Gagal menyimpan profil usaha' });
  }
});

router.delete('/:id', async (req: any, res) => {
  try {
    if (!isSafeId(req.params.id)) return res.status(400).json({ error: 'ID profil tidak valid' });
    await query('DELETE FROM user_profiles WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gagal menghapus profil usaha' });
  }
});

export default router;
