import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { query } from '../db.js';
import { authenticateToken } from './authSecure.js';
import { isFiniteNumber, isRecord, isSafeId, isText, isUuid } from '../validation.js';

const router = Router();

// All invoice routes require JWT token
router.use(authenticateToken);

/**
 * GET /api/invoices
 * Get all invoices for logged in user
 */
router.get('/', async (req: any, res) => {
  try {
    const invoicesRes = await query(
      'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );

    // Attach items for each invoice
    const invoices = await Promise.all(
      invoicesRes.rows.map(async (inv) => {
        const itemsRes = await query('SELECT * FROM invoice_items WHERE invoice_id = $1', [inv.id]);
        return {
          id: inv.id,
          profileId: inv.profile_id,
          number: inv.number,
          issueDate: inv.issue_date,
          dueDate: inv.due_date,
          poNumber: inv.po_number || '',
          status: inv.status,
          language: inv.language,
          currency: inv.currency,
          issuer: inv.issuer_data,
          client: inv.client_data,
          taxName: inv.tax_name || 'PPN',
          shippingFee: Number(inv.shipping_fee) || 0,
          notes: inv.notes || '',
          paymentTerms: inv.payment_terms || '',
          theme: inv.theme_config,
          createdAt: inv.created_at,
          updatedAt: inv.updated_at,
          items: itemsRes.rows.map((it) => ({
            id: it.id,
            name: it.name,
            description: it.description || '',
            quantity: Number(it.quantity),
            unitPrice: Number(it.unit_price),
            unit: it.unit || 'pcs',
            taxRate: Number(it.tax_rate),
            discount: Number(it.discount),
            discountType: it.discount_type || 'percent',
          })),
        };
      })
    );

    res.json(invoices);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil invoice' });
  }
});

/**
 * POST /api/invoices
 * Create or Update invoice
 */
router.post('/', async (req: any, res) => {
  try {
    const inv = req.body;
    const userId = req.user.userId;
    const validItems =
      Array.isArray(inv?.items) &&
      inv.items.length > 0 &&
      inv.items.length <= 500 &&
      inv.items.every(
        (item: unknown) =>
          isRecord(item) &&
          isSafeId(item.id) &&
          isText(item.name, 300, true) &&
          isText(item.description || '', 4000) &&
          isFiniteNumber(item.quantity, 0.000001, 1_000_000) &&
          isFiniteNumber(item.unitPrice, 0, 1_000_000_000_000) &&
          isFiniteNumber(item.taxRate ?? 0, 0, 100) &&
          isFiniteNumber(item.discount ?? 0, 0, 1_000_000_000_000)
      );
    if (
      !isRecord(inv) ||
      !isSafeId(inv.id) ||
      !isSafeId(inv.profileId) ||
      !isText(inv.number, 100, true) ||
      !isText(inv.issueDate, 20, true) ||
      !isText(inv.dueDate, 20, true) ||
      !isText(inv.notes || '', 10_000) ||
      !isText(inv.paymentTerms || '', 4000) ||
      !validItems
    ) {
      return res.status(400).json({ error: 'Data invoice tidak valid atau di luar batas' });
    }

    const existingRes = await query('SELECT id FROM invoices WHERE id = $1 AND user_id = $2', [
      inv.id,
      userId,
    ]);

    if (existingRes.rows.length > 0) {
      // Update
      await query(
        `UPDATE invoices SET 
          profile_id = $1, number = $2, issue_date = $3, due_date = $4, po_number = $5,
          status = $6, language = $7, currency = $8, issuer_data = $9, client_data = $10,
          tax_name = $11, shipping_fee = $12, notes = $13, payment_terms = $14, theme_config = $15,
          updated_at = NOW()
        WHERE id = $16 AND user_id = $17`,
        [
          inv.profileId,
          inv.number,
          inv.issueDate,
          inv.dueDate,
          inv.poNumber || null,
          inv.status,
          inv.language,
          inv.currency,
          JSON.stringify(inv.issuer),
          JSON.stringify(inv.client),
          inv.taxName || 'PPN',
          inv.shippingFee || 0,
          inv.notes || '',
          inv.paymentTerms || '',
          JSON.stringify(inv.theme),
          inv.id,
          userId,
        ]
      );

      // Re-insert line items
      await query('DELETE FROM invoice_items WHERE invoice_id = $1', [inv.id]);
    } else {
      // Insert new
      await query(
        `INSERT INTO invoices (
          id, user_id, profile_id, number, issue_date, due_date, po_number, status, language, currency,
          issuer_data, client_data, tax_name, shipping_fee, notes, payment_terms, theme_config
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          inv.id,
          userId,
          inv.profileId,
          inv.number,
          inv.issueDate,
          inv.dueDate,
          inv.poNumber || null,
          inv.status,
          inv.language,
          inv.currency,
          JSON.stringify(inv.issuer),
          JSON.stringify(inv.client),
          inv.taxName || 'PPN',
          inv.shippingFee || 0,
          inv.notes || '',
          inv.paymentTerms || '',
          JSON.stringify(inv.theme),
        ]
      );
    }

    // Insert line items
    if (inv.items && inv.items.length > 0) {
      for (const it of inv.items) {
        await query(
          `INSERT INTO invoice_items (
            id, invoice_id, name, description, quantity, unit_price, unit, tax_rate, discount, discount_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            isUuid(it.id) ? it.id : randomUUID(),
            inv.id,
            it.name,
            it.description || '',
            it.quantity,
            it.unitPrice,
            it.unit || 'pcs',
            it.taxRate || 0,
            it.discount || 0,
            it.discountType || 'percent',
          ]
        );
      }
    }

    res.json({ success: true, id: inv.id });
  } catch (err: any) {
    console.error('❌ Save invoice error:', err);
    res.status(500).json({ error: 'Gagal menyimpan invoice' });
  }
});

/**
 * DELETE /api/invoices/:id
 */
router.delete('/:id', async (req: any, res) => {
  try {
    if (!isSafeId(req.params.id)) return res.status(400).json({ error: 'ID invoice tidak valid' });
    await query('DELETE FROM invoices WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gagal menghapus invoice' });
  }
});

export default router;
