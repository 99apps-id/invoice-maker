import { Router } from 'express';
import { query } from '../db.js';
import { authenticateToken } from './authSecure.js';
import { isFiniteNumber, isRecord, isSafeId, isText } from '../validation.js';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: any, res) => {
  try {
    const catalogRes = await query(
      'SELECT * FROM catalog_items WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(
      catalogRes.rows.map((cat) => ({
        id: cat.id,
        profileId: cat.profile_id,
        name: cat.name,
        description: cat.description || '',
        unitPrice: Number(cat.unit_price),
        unit: cat.unit || 'pcs',
        defaultTaxRate: Number(cat.default_tax_rate),
        category: cat.category || 'product',
      }))
    );
  } catch {
    res.status(500).json({ error: 'Gagal mengambil katalog' });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const cat = req.body;
    const userId = req.user.userId;
    if (
      !isRecord(cat) ||
      !isSafeId(cat.id) ||
      !isSafeId(cat.profileId) ||
      !isText(cat.name, 200, true) ||
      !isText(cat.description || '', 4000) ||
      !isText(cat.unit || 'pcs', 40, true) ||
      !isFiniteNumber(cat.unitPrice, 0, 1_000_000_000_000) ||
      !isFiniteNumber(cat.defaultTaxRate ?? 0, 0, 100)
    ) {
      return res.status(400).json({ error: 'Data katalog tidak valid atau di luar batas' });
    }

    const existingRes = await query('SELECT id FROM catalog_items WHERE id = $1 AND user_id = $2', [
      cat.id,
      userId,
    ]);

    if (existingRes.rows.length > 0) {
      await query(
        `UPDATE catalog_items SET 
          name = $1, description = $2, unit_price = $3, unit = $4, default_tax_rate = $5, category = $6, updated_at = NOW() 
        WHERE id = $7 AND user_id = $8`,
        [cat.name, cat.description, cat.unitPrice, cat.unit, cat.defaultTaxRate, cat.category, cat.id, userId]
      );
    } else {
      await query(
        `INSERT INTO catalog_items (
          id, user_id, profile_id, name, description, unit_price, unit, default_tax_rate, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          cat.id,
          userId,
          cat.profileId,
          cat.name,
          cat.description,
          cat.unitPrice,
          cat.unit || 'pcs',
          cat.defaultTaxRate || 11,
          cat.category || 'product',
        ]
      );
    }

    res.json({ success: true, id: cat.id });
  } catch {
    res.status(500).json({ error: 'Gagal menyimpan item katalog' });
  }
});

router.delete('/:id', async (req: any, res) => {
  try {
    if (!isSafeId(req.params.id)) return res.status(400).json({ error: 'ID katalog tidak valid' });
    await query('DELETE FROM catalog_items WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gagal menghapus item katalog' });
  }
});

export default router;
