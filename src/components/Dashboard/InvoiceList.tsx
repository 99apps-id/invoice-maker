import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Plus,
  Edit3,
  Copy,
  CheckCircle2,
  Trash2,
  Download,
  FileText,
  DollarSign,
  Clock,
} from 'lucide-react';
import type { Invoice, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { calculateInvoiceTotals, formatCurrency, formatDate } from '../../utils/formatters';

interface InvoiceListProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onNewInvoice: () => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onMarkAsPaid: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  language: Language;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onSelectInvoice,
  onNewInvoice,
  onDuplicateInvoice,
  onMarkAsPaid,
  onDeleteInvoice,
  language,
}) => {
  const t = getTranslation(language);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats calculation
  let totalRevenue = 0;
  let pendingAmount = 0;
  let paidCount = 0;

  invoices.forEach((inv) => {
    const totals = calculateInvoiceTotals(inv.items, inv.shippingFee);
    if (inv.status === 'paid') {
      totalRevenue += totals.grandTotal;
      paidCount += 1;
    } else if (inv.status === 'pending' || inv.status === 'overdue') {
      pendingAmount += totals.grandTotal;
    }
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.company.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTriggerPaid = (id: string) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onMarkAsPaid(id);
  };

  const handleExportJson = (inv: Invoice) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inv, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${inv.number.replace(/\//g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">{t.totalRevenue}</span>
            <h4 className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">
              {formatCurrency(totalRevenue, 'IDR', language)}
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">{t.pendingAmount}</span>
            <h4 className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">
              {formatCurrency(pendingAmount, 'IDR', language)}
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">{t.paidCount}</span>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {paidCount} <span className="text-xs font-normal text-slate-400">Faktur</span>
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">{t.totalInvoices}</span>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {invoices.length} <span className="text-xs font-normal text-slate-400">Total</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="all">{t.filterStatus}</option>
            <option value="draft">{t.statusDraft}</option>
            <option value="pending">{t.statusPending}</option>
            <option value="paid">{t.statusPaid}</option>
            <option value="overdue">{t.statusOverdue}</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onNewInvoice}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition btn-hallmark"
        >
          <Plus className="w-4 h-4" />
          {t.navEditor}
        </button>
      </div>

      {/* Invoice List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t.invoiceNumber}</th>
                <th className="py-3 px-4">{t.toClient}</th>
                <th className="py-3 px-4">{t.issueDate}</th>
                <th className="py-3 px-4">{t.dueDate}</th>
                <th className="py-3 px-4">{t.status}</th>
                <th className="py-3 px-4 text-right">{t.grandTotal}</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Tidak ada faktur ditemukan.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const totals = calculateInvoiceTotals(inv.items, inv.shippingFee);
                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {inv.number}
                        {inv.poNumber && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            PO: {inv.poNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {inv.client.company || inv.client.name}
                        </span>
                        {inv.client.company && (
                          <span className="text-[11px] text-slate-500">
                            {inv.client.name}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        {formatDate(inv.issueDate, language)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        {formatDate(inv.dueDate, language)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            inv.status === 'paid'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : inv.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                              : inv.status === 'overdue'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {inv.status === 'paid'
                            ? t.statusPaid
                            : inv.status === 'pending'
                            ? t.statusPending
                            : inv.status === 'overdue'
                            ? t.statusOverdue
                            : t.statusDraft}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                        {formatCurrency(totals.grandTotal, inv.currency, language)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectInvoice(inv)}
                            title={t.edit}
                            className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDuplicateInvoice(inv)}
                            title={t.duplicate}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {inv.status !== 'paid' && (
                            <button
                              type="button"
                              onClick={() => handleTriggerPaid(inv.id)}
                              title={t.markPaid}
                              className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleExportJson(inv)}
                            title={t.downloadJson}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteInvoice(inv.id)}
                            title={t.delete}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
