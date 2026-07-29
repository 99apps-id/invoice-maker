import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  User,
  Package,
  DollarSign,
  FileText,
  Palette,
  RefreshCw,
} from 'lucide-react';
import type { Client, CurrencyCode, Invoice, LineItem, UserProfile, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { generateInvoiceNumber } from '../../utils/formatters';
import { lookupSwiftCode } from '../../constants/banks';
import { BankSelectorInput } from '../UI/BankSelectorInput';
import { SignatureCanvas } from '../InvoicePreview/SignatureCanvas';
import { ThemeTemplatePicker } from './ThemeTemplatePicker';
import { ClientSelectorModal } from './ClientSelectorModal';
import { CatalogSelectorModal } from './CatalogSelectorModal';
import { QrisCropperModal } from '../UI/QrisCropperModal';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (updated: Invoice) => void;
  clients: Client[];
  catalogItems: any[];
  onSaveNewClient: (client: Omit<Client, 'id' | 'profileId'>) => void;
  language: Language;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onChange,
  clients,
  catalogItems,
  onSaveNewClient,
  language,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'content' | 'theme'>('content');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  // Field change handler
  const updateInvoice = <K extends keyof Invoice>(key: K, value: Invoice[K]) => {
    onChange({ ...invoice, [key]: value, updatedAt: new Date().toISOString() });
  };

  const updateIssuer = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    onChange({
      ...invoice,
      issuer: { ...invoice.issuer, [key]: value },
      updatedAt: new Date().toISOString(),
    });
  };

  const updateClient = <K extends keyof Client>(key: K, value: Client[K]) => {
    onChange({
      ...invoice,
      client: { ...invoice.client, [key]: value },
      updatedAt: new Date().toISOString(),
    });
  };

  // Line items handlers
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'pcs',
      taxRate: 11,
      discount: 0,
      discountType: 'percent',
    };
    updateInvoice('items', [...invoice.items, newItem]);
  };

  const handleUpdateItem = (id: string, key: keyof LineItem, value: any) => {
    const updated = invoice.items.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    updateInvoice('items', updated);
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) return;
    updateInvoice(
      'items',
      invoice.items.filter((item) => item.id !== id)
    );
  };

  const handleSelectCatalogItem = (catItem: any) => {
    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      name: catItem.name,
      description: catItem.description,
      quantity: 1,
      unitPrice: catItem.unitPrice,
      unit: catItem.unit || 'pcs',
      taxRate: catItem.defaultTaxRate || 11,
      discount: 0,
      discountType: 'percent',
    };
    updateInvoice('items', [...invoice.items, newItem]);
  };

  return (
    <div className="space-y-6">
      {/* Editor Tab switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'content'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            {t.invoiceDataTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'theme'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            {t.templateSettings}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency selector */}
          <select
            value={invoice.currency}
            onChange={(e) => updateInvoice('currency', e.target.value as CurrencyCode)}
            className="text-xs font-bold font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="IDR">IDR (Rp)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="SGD">SGD (S$)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
      </div>

      {activeTab === 'theme' ? (
        <ThemeTemplatePicker
          themeConfig={invoice.theme}
          onChange={(theme) => updateInvoice('theme', theme)}
          language={language}
        />
      ) : (
        <div className="space-y-6">
          {/* Header Metadata Section */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                {t.invoiceDataHeader}
              </h3>
              <button
                type="button"
                onClick={() => updateInvoice('number', generateInvoiceNumber())}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono"
              >
                <RefreshCw className="w-3 h-3" />
                Auto Number
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {t.invoiceNumber}
                </label>
                <input
                  type="text"
                  value={invoice.number}
                  onChange={(e) => updateInvoice('number', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {t.poNumber}
                </label>
                <input
                  type="text"
                  value={invoice.poNumber || ''}
                  onChange={(e) => updateInvoice('poNumber', e.target.value)}
                  placeholder="e.g. PO-8831"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {t.issueDate}
                </label>
                <input
                  type="date"
                  value={invoice.issueDate}
                  onChange={(e) => updateInvoice('issueDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {t.dueDate}
                </label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => updateInvoice('dueDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                />
                {/* Quick Date Shortcuts */}
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const base = new Date(invoice.issueDate || Date.now());
                      updateInvoice('dueDate', base.toISOString().split('T')[0]);
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    Hari Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const base = new Date(invoice.issueDate || Date.now());
                      base.setDate(base.getDate() + 7);
                      updateInvoice('dueDate', base.toISOString().split('T')[0]);
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    +7 Hari
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const base = new Date(invoice.issueDate || Date.now());
                      base.setDate(base.getDate() + 14);
                      updateInvoice('dueDate', base.toISOString().split('T')[0]);
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    +14 Hari
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const base = new Date(invoice.issueDate || Date.now());
                      base.setDate(base.getDate() + 30);
                      updateInvoice('dueDate', base.toISOString().split('T')[0]);
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    +30 Hari
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                {t.status}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['draft', 'pending', 'paid', 'overdue'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateInvoice('status', st)}
                    className={`py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                      invoice.status === st
                        ? st === 'paid'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : st === 'pending'
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : st === 'overdue'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-slate-700 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'draft' ? t.statusDraft : st === 'pending' ? t.statusPending : st === 'paid' ? t.statusPaid : t.statusOverdue}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Issuer & Client Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Issuer Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                {t.fromIssuer}
              </h4>
              <div>
                <input
                  type="text"
                  value={invoice.issuer.name}
                  onChange={(e) => updateIssuer('name', e.target.value)}
                  placeholder={t.companyName}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={invoice.issuer.ownerName}
                  onChange={(e) => updateIssuer('ownerName', e.target.value)}
                  placeholder={t.ownerName}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
                <input
                  type="email"
                  value={invoice.issuer.email}
                  onChange={(e) => updateIssuer('email', e.target.value)}
                  placeholder={t.email}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <textarea
                value={invoice.issuer.address}
                onChange={(e) => updateIssuer('address', e.target.value)}
                placeholder={t.address}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            {/* Client Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  {t.toClient}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  {t.selectClient}
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={invoice.client.company || invoice.client.name}
                  onChange={(e) => updateClient('company', e.target.value)}
                  placeholder={t.companyName}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={invoice.client.name}
                  onChange={(e) => updateClient('name', e.target.value)}
                  placeholder={t.ownerName}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
                <input
                  type="email"
                  value={invoice.client.email}
                  onChange={(e) => updateClient('email', e.target.value)}
                  placeholder={t.email}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <textarea
                value={invoice.client.address}
                onChange={(e) => updateClient('address', e.target.value)}
                placeholder={t.address}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Line Items Section */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-500" />
                {t.itemDetails}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatalogModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition flex items-center gap-1"
                >
                  {t.selectFromCatalog}
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t.addItem}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {invoice.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      placeholder="Nama Barang / Pekerjaan Jasa"
                      className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={invoice.items.length <= 1}
                      className="text-rose-500 hover:text-rose-700 p-1.5 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    placeholder="Rincian deskripsi / spesifikasi pekerjaan..."
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                        {t.qty}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                        {t.price}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                        {t.tax} (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.taxRate}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                        {t.discount}
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={item.discount}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'discount', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-rose-600"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateItem(
                              item.id,
                              'discountType',
                              item.discountType === 'percent' ? 'fixed' : 'percent'
                            )
                          }
                          className="px-1.5 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-[10px] font-bold"
                        >
                          {item.discountType === 'percent' ? '%' : '$'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Terms Section */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-500" />
              {t.paymentDetails}
            </h3>

            <div className="space-y-3">
              <BankSelectorInput
                bankName={invoice.issuer.bankName || ''}
                swiftCode={invoice.issuer.swiftCode || ''}
                onSelectBank={(bName, sCode) => {
                  onChange({
                    ...invoice,
                    issuer: {
                      ...invoice.issuer,
                      bankName: bName,
                      swiftCode: sCode,
                    },
                    updatedAt: new Date().toISOString(),
                  });
                }}
                onBankNameChange={(bName) => {
                  const autoSwift = lookupSwiftCode(bName);
                  onChange({
                    ...invoice,
                    issuer: {
                      ...invoice.issuer,
                      bankName: bName,
                      swiftCode: autoSwift || invoice.issuer.swiftCode || '',
                    },
                    updatedAt: new Date().toISOString(),
                  });
                }}
                onSwiftCodeChange={(sCode) => updateIssuer('swiftCode', sCode)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {t.accountNo}
                  </label>
                  <input
                    type="text"
                    value={invoice.issuer.bankAccountNo || ''}
                    onChange={(e) => updateIssuer('bankAccountNo', e.target.value)}
                    placeholder="e.g. 883-092-109"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {t.accountName}
                  </label>
                  <input
                    type="text"
                    value={invoice.issuer.bankAccountName || ''}
                    onChange={(e) => updateIssuer('bankAccountName', e.target.value)}
                    placeholder="Nama Pemilik Rekening"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* QRIS Upload & Crop Option */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1.5">
                    <span>Barcode QRIS Statis (Opsional)</span>
                  </label>
                </div>
                <div className="flex items-center justify-between gap-3">
                  {invoice.issuer.qrisUrl ? (
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <img
                        src={invoice.issuer.qrisUrl}
                        alt="QRIS Preview"
                        className="w-8 h-8 rounded-md object-contain bg-white"
                      />
                      <span className="text-[10px] font-bold text-emerald-600">QRIS Statis Aktif</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Belum ada QRIS statis diupload</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsQrisModalOpen(true)}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center gap-1"
                  >
                    <span>{invoice.issuer.qrisUrl ? 'Ubah / Potong QRIS' : 'Upload & Crop QRIS'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {t.notes}
                </label>
                <textarea
                  value={invoice.notes}
                  onChange={(e) => updateInvoice('notes', e.target.value)}
                  rows={2}
                  placeholder="Catatan tambahan untuk klien..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {t.paymentTerms}
                </label>
                <textarea
                  value={invoice.paymentTerms}
                  onChange={(e) => updateInvoice('paymentTerms', e.target.value)}
                  rows={2}
                  placeholder="Syarat & ketentuan pembayaran..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Signature Canvas */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <SignatureCanvas
                value={invoice.issuer.signatureUrl}
                onChange={(sigData) => updateIssuer('signatureUrl', sigData)}
                language={language}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ClientSelectorModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        clients={clients}
        onSelectClient={(c) => updateInvoice('client', c)}
        onSaveNewClient={onSaveNewClient}
        language={language}
      />

      <CatalogSelectorModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        catalog={catalogItems}
        currency={invoice.currency}
        onSelectCatalogItem={handleSelectCatalogItem}
        language={language}
      />

      <QrisCropperModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
        currentQrisUrl={invoice.issuer.qrisUrl}
        onSaveQrisUrl={(qUrl) => updateIssuer('qrisUrl', qUrl)}
        language={language}
      />

    </div>
  );
};
