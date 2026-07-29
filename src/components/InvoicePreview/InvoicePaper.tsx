import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Invoice } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { calculateInvoiceTotals, formatCurrency, formatDate } from '../../utils/formatters';
import { FONT_OPTIONS } from '../../constants/templates';
import { useAuth } from '../../context/AuthContext';

interface InvoicePaperProps {
  invoice: Invoice;
}

export const InvoicePaper: React.FC<InvoicePaperProps> = ({ invoice }) => {
  const t = getTranslation(invoice.language);
  const { plan } = useAuth();
  const totals = calculateInvoiceTotals(invoice.items, invoice.shippingFee);
  const theme = invoice.theme;

  const fontClass = FONT_OPTIONS.find((f) => f.id === theme.fontFamily)?.class || 'font-sans';
  const primaryColor = theme.primaryColor || '#4f46e5';

  const cleanTaxId = (val?: string) => (val ? val.replace(/\s*\([^)]*NPWP\)/gi, '').trim() : '');

  // Density classes
  const densityPadding =
    theme.density === 'compact' ? 'p-5 gap-3' : theme.density === 'spacious' ? 'p-9 gap-7' : 'p-7 gap-5';
  const tableCellPadding =
    theme.density === 'compact' ? 'py-1.5 px-3' : theme.density === 'spacious' ? 'py-3.5 px-4' : 'py-2.5 px-3.5';

  // Watermark text & styling
  let watermarkText = theme.watermarkText;
  if (!watermarkText && theme.showWatermark) {
    if (invoice.status === 'paid') watermarkText = t.statusPaid;
    else if (invoice.status === 'pending') watermarkText = t.statusPending;
    else if (invoice.status === 'overdue') watermarkText = t.statusOverdue;
    else watermarkText = t.statusDraft;
  }

  let watermarkClass = 'watermark-draft';
  if (invoice.status === 'paid') watermarkClass = 'watermark-paid';
  else if (invoice.status === 'pending') watermarkClass = 'watermark-pending';
  else if (invoice.status === 'overdue') watermarkClass = 'watermark-overdue';

  // Template ID checks
  const isAtmospheric = theme.templateId === 'atmospheric';
  const isRisograph = theme.templateId === 'risograph';
  const isMinimalMono = theme.templateId === 'minimal_mono';
  const isSwissGrid = theme.templateId === 'swiss_grid';
  const isBoutique = theme.templateId === 'emerald_boutique';
  const isTechNeo = theme.templateId === 'tech_neo';
  const isWarmArtisan = theme.templateId === 'warm_artisan';
  const isMetroCompact = theme.templateId === 'metro_compact';
  const isPastelPop = theme.templateId === 'pastel_pop';

  // Layout Formats
  const isSidebarLayout = theme.templateId === 'sidebar_layout';
  const isHeroBannerFormat = theme.templateId === 'top_hero_banner' || theme.templateId === 'duotone_split';
  const isReceiptTicket = theme.templateId === 'receipt_ticket';
  const isLetterheadFormat = theme.templateId === 'classic_letterhead';
  const isTerminalConsole = theme.templateId === 'terminal_console';

  // Format Flags
  const isCardGridTiles = theme.templateId === 'card_grid_tiles';
  const isCertifiedTax = theme.templateId === 'stamp_certification';
  const isLuxuryGold = theme.templateId === 'luxury_gold_leaf';
  const isMinimalTable = theme.templateId === 'minimal_table_only';

  return (
    <div className={`printable-invoice-container transition-all duration-300 ${fontClass}`}>
      <div
        className={`printable-invoice relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between ${densityPadding} ${
          isAtmospheric ? 'bg-white text-slate-900 border-2 border-emerald-500/40 shadow-lg' : ''
        } ${isRisograph ? 'bg-orange-50/40 border-orange-200 text-slate-900' : ''} ${
          isMinimalMono ? 'border-2 border-black rounded-none shadow-none text-black bg-white' : ''
        } ${isSwissGrid ? 'border-l-8 border-l-red-600 border-slate-300 rounded-none bg-white' : ''} ${
          isBoutique ? 'bg-white text-emerald-950 border-2 border-amber-300 shadow-md' : ''
        } ${isTechNeo ? 'bg-white text-slate-900 border-2 border-cyan-400 shadow-md' : ''} ${
          isWarmArtisan ? 'bg-stone-50 text-stone-900 border border-stone-300 rounded-3xl' : ''
        } ${isMetroCompact ? 'bg-white border-2 border-slate-300 text-slate-900' : ''} ${
          isPastelPop ? 'bg-purple-50/30 border-2 border-purple-200 rounded-3xl text-slate-900' : ''
        } ${isSidebarLayout ? 'bg-white text-slate-900 border border-slate-300 p-0 rounded-2xl' : ''} ${
          isTerminalConsole ? 'bg-white text-green-950 border-2 border-green-700 rounded-lg font-mono' : ''
        } ${isReceiptTicket ? 'border-2 border-dashed border-slate-400 bg-white text-slate-900' : ''} ${
          isLuxuryGold ? 'border-4 border-double border-amber-400 bg-white text-amber-950 p-8 shadow-xl' : ''
        } ${isMinimalTable ? 'border-none shadow-none bg-white p-4' : ''} ${
          isCertifiedTax ? 'border-2 border-red-800 bg-white text-slate-900 p-6' : ''
        }`}
      >
        {/* Watermark Stamp */}
        {theme.showWatermark && watermarkText && (
          <div className={`watermark-stamp ${watermarkClass}`}>
            {watermarkText}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FORMAT 1: SIDEBAR LAYOUT (Vertical 2-Column Split)            */}
        {/* ------------------------------------------------------------- */}
        {isSidebarLayout ? (
          <div className="grid grid-cols-12 gap-0 min-h-full">
            <div className="col-span-4 bg-slate-50 dark:bg-slate-800/60 p-6 space-y-6 border-r border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
              <div className="space-y-3">
                {invoice.issuer.logoUrl ? (
                  <img src={invoice.issuer.logoUrl} alt={invoice.issuer.name} className="h-12 max-w-[160px] object-contain rounded-lg" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-xs" style={{ backgroundColor: primaryColor }}>
                    {invoice.issuer.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">{invoice.issuer.name}</h1>
                  {invoice.issuer.ownerName && <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{invoice.issuer.ownerName}</p>}
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 space-y-0.5 leading-tight">
                  <p>{invoice.issuer.address}</p>
                  <p>{invoice.issuer.email}</p>
                  <p>{invoice.issuer.phone}</p>
                  {invoice.issuer.taxId && <p>{t.taxId}: <span className="font-mono font-medium">{cleanTaxId(invoice.issuer.taxId)}</span></p>}
                </div>
              </div>

              {invoice.issuer.bankAccountNo && (
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1 text-[11px]">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px]">{t.paymentDetails}</span>
                  <p className="text-slate-600 dark:text-slate-400">{invoice.issuer.bankName}</p>
                  <p className="font-mono text-slate-900 dark:text-white font-bold">{invoice.issuer.bankAccountNo}</p>
                  <p className="text-slate-600 dark:text-slate-400">{invoice.issuer.bankAccountName}</p>
                  {invoice.issuer.swiftCode && <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">SWIFT: {invoice.issuer.swiftCode}</p>}
                </div>
              )}

              {plan === 'paid' && Boolean(invoice.issuer.qrisUrl) && (
                <div className="space-y-2 pt-2">
                  <div className="p-1.5 bg-white rounded-xl inline-block border border-slate-200 shadow-2xs">
                    {invoice.issuer.qrisUrl?.startsWith('data:image/') || invoice.issuer.qrisUrl?.startsWith('http') ? (
                      <img src={invoice.issuer.qrisUrl} alt="QRIS Payment" className="w-[85px] h-[85px] object-contain rounded-lg" />
                    ) : (
                      <QRCodeSVG value={invoice.issuer.qrisUrl!} size={85} />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{t.scanQrisPayment}</p>
                </div>
              )}
            </div>

            <div className="col-span-8 p-6 bg-white dark:bg-slate-900 space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      {t.invoiceTitle}
                    </span>
                    <h2 className="text-sm font-bold font-mono text-slate-900 dark:text-white whitespace-nowrap leading-tight tracking-wider">{invoice.number}</h2>
                  </div>
                  <div className="text-right text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                    <p className="whitespace-nowrap"><span className="text-slate-400">{t.issueDate}:</span> <strong className="text-slate-900 dark:text-white whitespace-nowrap">{formatDate(invoice.issueDate, invoice.language)}</strong></p>
                    <p className="whitespace-nowrap"><span className="text-slate-400">{t.dueDate}:</span> <strong className="text-rose-600 dark:text-rose-400 whitespace-nowrap">{formatDate(invoice.dueDate, invoice.language)}</strong></p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.toClient}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{invoice.client.company || invoice.client.name}</h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{invoice.client.address}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{t.grandTotal}</span>
                    <div className="text-xl font-extrabold font-mono whitespace-nowrap" style={{ color: primaryColor }}>
                      {formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2 px-3">{t.itemDescription}</th>
                        <th className="py-2 px-3 text-center">{t.qty}</th>
                        <th className="py-2 px-3 text-right">{t.price}</th>
                        <th className="py-2 px-3 text-right">{t.amount}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {invoice.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                          <td className="py-2 px-3 text-center font-mono">{item.quantity}</td>
                          <td className="py-2 px-3 text-right font-mono whitespace-nowrap">{formatCurrency(item.unitPrice, invoice.currency, invoice.language)}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {formatCurrency(item.quantity * item.unitPrice, invoice.currency, invoice.language)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between items-end">
                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <p className="whitespace-nowrap">{t.subtotal}: <span className="font-mono text-slate-800 dark:text-slate-200">{formatCurrency(totals.subtotal, invoice.currency, invoice.language)}</span></p>
                  <p className="font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap">{t.grandTotal}: <span className="font-mono text-base" style={{ color: primaryColor }}>{formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}</span></p>
                </div>

                {theme.showSignature && (
                  <div className="text-right text-[11px]">
                    <p className="text-[10px] text-slate-400 uppercase">{t.authorizedSignature}</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-4">{invoice.issuer.ownerName || invoice.issuer.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : isHeroBannerFormat ? (
          /* ------------------------------------------------------------- */
          /* FORMAT 2: INK-FRIENDLY LIGHT HERO BANNER & DUOTONE SPLIT     */
          /* ------------------------------------------------------------- */
          <div className="space-y-5">
            <div className="-mx-7 -mt-7 p-6 bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400">{t.invoiceTitle}</span>
                <h1 className="text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">{invoice.number}</h1>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{invoice.issuer.name}</p>
              </div>
              <div className="text-right bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                <span className="text-[10px] uppercase tracking-wider font-bold block text-slate-400">{t.grandTotal}</span>
                <div className="text-2xl font-extrabold font-mono whitespace-nowrap" style={{ color: primaryColor }}>
                  {formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">{t.fromIssuer}</span>
                <h3 className="font-bold text-slate-900 dark:text-white">{invoice.issuer.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">{invoice.issuer.address}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">{t.toClient}</span>
                <h3 className="font-bold text-slate-900 dark:text-white">{invoice.client.company || invoice.client.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">{invoice.client.address}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">{t.itemDescription}</th>
                    <th className="py-2.5 px-3 text-center">{t.qty}</th>
                    <th className="py-2.5 px-3 text-right">{t.price}</th>
                    <th className="py-2.5 px-3 text-right">{t.amount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap">{formatCurrency(item.unitPrice, invoice.currency, invoice.language)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold whitespace-nowrap">{formatCurrency(item.quantity * item.unitPrice, invoice.currency, invoice.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-12 gap-4 pt-2 text-xs">
              <div className="col-span-7 space-y-2 text-slate-600 dark:text-slate-400">
                {invoice.issuer.bankAccountNo && (
                  <p>{t.bankName}: <strong>{invoice.issuer.bankName}</strong> • {t.accountNo}: <strong className="font-mono">{invoice.issuer.bankAccountNo}</strong> ({invoice.issuer.bankAccountName})</p>
                )}
                {invoice.notes && <p className="italic">{invoice.notes}</p>}
              </div>
              <div className="col-span-5 text-right space-y-1">
                <p className="whitespace-nowrap">{t.subtotal}: <span className="font-mono">{formatCurrency(totals.subtotal, invoice.currency, invoice.language)}</span></p>
                <p className="text-base font-extrabold whitespace-nowrap" style={{ color: primaryColor }}>{t.grandTotal}: <span className="font-mono">{formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}</span></p>
              </div>
            </div>
          </div>
        ) : isTerminalConsole ? (
          /* ------------------------------------------------------------- */
          /* FORMAT 3: INK-FRIENDLY CLEAN WHITE MONOSPACED CONSOLE        */
          /* ------------------------------------------------------------- */
          <div className="space-y-4 font-mono text-xs text-green-950 dark:text-green-400">
            <div className="flex items-center justify-between border-b-2 border-green-700 pb-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">root@tagih-dong:~# invoice --execute</span>
              </div>
              <span className="text-green-700 dark:text-green-400 font-bold">STATUS: {invoice.status.toUpperCase()}</span>
            </div>

            <div className="space-y-1">
              <p>&gt; ISSUER: {invoice.issuer.name} [{invoice.issuer.email}]</p>
              <p>&gt; CLIENT: {invoice.client.company || invoice.client.name}</p>
              <p className="whitespace-nowrap">&gt; INVOICE_REF: {invoice.number} | ISSUE: {invoice.issueDate}</p>
            </div>

            <div className="border border-green-800 rounded-md overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-300 border-b border-green-800">
                  <tr>
                    <th className="p-2">COMMAND / ITEM</th>
                    <th className="p-2 text-center">QTY</th>
                    <th className="p-2 text-right">UNIT_PRICE</th>
                    <th className="p-2 text-right">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-200 dark:divide-green-900">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-bold">{item.name}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right whitespace-nowrap">{formatCurrency(item.unitPrice, invoice.currency, invoice.language)}</td>
                      <td className="p-2 text-right font-bold whitespace-nowrap">{formatCurrency(item.quantity * item.unitPrice, invoice.currency, invoice.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center border-t border-green-800 pt-3 text-sm">
              <span className="text-slate-600 dark:text-slate-400">&gt; GRAND_TOTAL_AMOUNT:</span>
              <span className="text-xl font-bold text-green-700 dark:text-green-400 whitespace-nowrap">{formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}</span>
            </div>
          </div>
        ) : isLetterheadFormat ? (
          /* ------------------------------------------------------------- */
          /* FORMAT 4: SYMMETRICAL CLASSIC LETTERHEAD                     */
          /* ------------------------------------------------------------- */
          <div className="space-y-5 text-center">
            <div className="border-b-4 border-double border-slate-900 dark:border-slate-100 pb-4 space-y-2">
              <h1 className="text-2xl font-serif font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {invoice.issuer.name}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {invoice.issuer.address} • {invoice.issuer.email} • {invoice.issuer.phone}
              </p>
              <div className="inline-block border-t border-b border-slate-400 px-6 py-1 mt-2">
                <span className="text-xs font-serif font-bold tracking-widest uppercase">{t.invoiceTitle} {invoice.number}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-left text-xs bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-serif font-bold uppercase text-slate-400">{t.toClient}:</span>
                <p className="font-bold text-slate-900 dark:text-white">{invoice.client.company || invoice.client.name}</p>
                <p className="text-slate-600 dark:text-slate-400">{invoice.client.address}</p>
              </div>
              <div className="text-right text-[11px] space-y-0.5">
                <p className="whitespace-nowrap">{t.issueDate}: <strong className="whitespace-nowrap">{formatDate(invoice.issueDate, invoice.language)}</strong></p>
                <p className="whitespace-nowrap">{t.dueDate}: <strong className="whitespace-nowrap">{formatDate(invoice.dueDate, invoice.language)}</strong></p>
              </div>
            </div>

            <div className="border border-slate-300 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 font-serif font-bold uppercase border-b border-slate-300">
                  <tr>
                    <th className="p-2.5">{t.itemDescription}</th>
                    <th className="p-2.5 text-center">{t.qty}</th>
                    <th className="p-2.5 text-right">{t.price}</th>
                    <th className="p-2.5 text-right">{t.amount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium">{item.name}</td>
                      <td className="p-2.5 text-center">{item.quantity}</td>
                      <td className="p-2.5 text-right whitespace-nowrap">{formatCurrency(item.unitPrice, invoice.currency, invoice.language)}</td>
                      <td className="p-2.5 text-right font-bold whitespace-nowrap">{formatCurrency(item.quantity * item.unitPrice, invoice.currency, invoice.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-end text-xs pt-2">
              <div className="text-left text-slate-600 dark:text-slate-400">
                {invoice.issuer.bankAccountNo && <p>{t.bankName}: {invoice.issuer.bankName} - {invoice.issuer.bankAccountNo}</p>}
              </div>
              <div className="text-right">
                <p className="text-base font-serif font-bold whitespace-nowrap">{t.grandTotal}: {formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}</p>
              </div>
            </div>
          </div>
        ) : isCardGridTiles ? (
          /* ------------------------------------------------------------- */
          /* FORMAT 5: MODULAR CARD GRID TILES                             */
          /* ------------------------------------------------------------- */
          <div className="space-y-5">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{invoice.issuer.name}</h1>
                <p className="text-xs text-slate-500">{invoice.issuer.email} • {invoice.issuer.phone}</p>
              </div>
              <div className="flex flex-col items-end space-y-1 text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">{t.invoiceTitle}</span>
                <h2 className="text-sm font-bold font-mono text-slate-900 whitespace-nowrap leading-tight tracking-wider">{invoice.number}</h2>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">{t.gridModules}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md shrink-0">{t.qty}: {item.quantity}</span>
                    </div>
                    {item.description && <p className="text-[10px] text-slate-500 line-clamp-2">{item.description}</p>}
                    <div className="flex justify-between items-center border-t border-slate-200/80 pt-2 text-xs">
                      <span className="text-slate-400 text-[10px] whitespace-nowrap">{formatCurrency(item.unitPrice, invoice.currency, invoice.language)} {t.pricePerUnit}</span>
                      <span className="font-mono font-bold text-indigo-600 whitespace-nowrap">{formatCurrency(item.quantity * item.unitPrice, invoice.currency, invoice.language)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <div className="text-xs text-slate-600">
                {invoice.issuer.bankAccountNo && <p>{t.accountNo}: <strong className="font-mono">{invoice.issuer.bankAccountNo}</strong> ({invoice.issuer.bankName})</p>}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-400">{t.grandTotal}</span>
                <div className="text-2xl font-extrabold font-mono text-indigo-600 whitespace-nowrap">{formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}</div>
              </div>
            </div>
          </div>
        ) : isCertifiedTax ? (
          /* ------------------------------------------------------------- */
          /* FORMAT 6: CERTIFIED OFFICIAL TAX INVOICE WITH BADGE           */
          /* ------------------------------------------------------------- */
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b-2 border-red-800 pb-3">
              <div>
                <h1 className="text-lg font-bold text-red-950 uppercase tracking-tight">{invoice.issuer.name}</h1>
                <p className="text-[11px] text-slate-600">{t.taxId}: <span className="font-mono font-bold">{cleanTaxId(invoice.issuer.taxId) || '01.382.901.4-012.000'}</span></p>
              </div>
              <div className="border-2 border-red-800 rounded-lg px-3 py-1 text-center bg-red-50 text-red-900 shrink-0">
                <span className="text-[9px] font-extrabold uppercase tracking-widest block">{t.officialDoc}</span>
                <span className="text-xs font-mono font-bold">{invoice.number}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 border border-slate-300 rounded-md bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{t.toClient}:</span>
                <p className="font-bold text-slate-900">{invoice.client.company || invoice.client.name}</p>
                <p className="text-[11px] text-slate-600">{invoice.client.address}</p>
              </div>
              <div className="text-right text-[11px] space-y-0.5">
                <p className="whitespace-nowrap">{t.issueDate}: <strong className="whitespace-nowrap">{formatDate(invoice.issueDate, invoice.language)}</strong></p>
                <p className="whitespace-nowrap">{t.dueDate}: <strong className="text-red-700 whitespace-nowrap">{formatDate(invoice.dueDate, invoice.language)}</strong></p>
              </div>
            </div>

            <table className="w-full text-left border border-slate-300 text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="p-2">{t.itemDescription}</th>
                  <th className="p-2 text-center">{t.qty}</th>
                  <th className="p-2 text-right">{t.price}</th>
                  <th className="p-2 text-right">{t.taxableSubtotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-semibold">{item.name}</td>
                    <td className="p-2 text-center font-mono">{item.quantity}</td>
                    <td className="p-2 text-right font-mono whitespace-nowrap">{formatCurrency(item.unitPrice, invoice.currency, invoice.language)}</td>
                    <td className="p-2 text-right font-mono font-bold whitespace-nowrap">{formatCurrency(item.quantity * item.unitPrice, invoice.currency, invoice.language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-end pt-2">
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p>{t.bankTransfer}: <strong>{invoice.issuer.bankName}</strong> ({invoice.issuer.bankAccountNo})</p>
                <p className="text-[10px] text-slate-400 italic">{t.electronicDocNote}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-900 whitespace-nowrap">{t.grandTotal}: <span className="font-mono text-base">{formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}</span></p>
              </div>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* DEFAULT & STANDARD TEMPLATES                                  */
          /* ------------------------------------------------------------- */
          <div className="space-y-4">
            {/* Top Header Row */}
            <div className="flex flex-row items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-2 max-w-[55%]">
                {invoice.issuer.logoUrl ? (
                  <img src={invoice.issuer.logoUrl} alt={invoice.issuer.name} className="h-12 max-w-[180px] object-contain rounded-lg" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-xs" style={{ backgroundColor: primaryColor }}>
                    {invoice.issuer.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">{invoice.issuer.name}</h1>
                  {invoice.issuer.ownerName && <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{invoice.issuer.ownerName}</p>}
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 space-y-0.5 leading-tight">
                  <p className="line-clamp-2">{invoice.issuer.address}</p>
                  <p>{invoice.issuer.email} {invoice.issuer.phone && `• ${invoice.issuer.phone}`}</p>
                  {invoice.issuer.taxId && <p>{t.taxId}: <span className="font-mono font-medium">{cleanTaxId(invoice.issuer.taxId)}</span></p>}
                </div>
              </div>

              <div className="text-right space-y-2 max-w-[42%] shrink-0 flex flex-col items-end">
                <div className="flex flex-col items-end space-y-1">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                    {t.invoiceTitle}
                  </span>
                  <h2 className="text-sm font-bold font-mono tracking-wider text-slate-800 dark:text-slate-200 whitespace-nowrap leading-tight">{invoice.number}</h2>
                </div>
                <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                  <p className="flex justify-end gap-2 items-center whitespace-nowrap">
                    <span className="text-slate-400 shrink-0">{t.issueDate}:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{formatDate(invoice.issueDate, invoice.language)}</span>
                  </p>
                  <p className="flex justify-end gap-2 items-center whitespace-nowrap">
                    <span className="text-slate-400 shrink-0">{t.dueDate}:</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">{formatDate(invoice.dueDate, invoice.language)}</span>
                  </p>
                  {invoice.poNumber && <p className="flex justify-end gap-2 items-center whitespace-nowrap"><span className="text-slate-400 shrink-0">{t.poNumber}:</span><span className="font-mono font-medium whitespace-nowrap">{invoice.poNumber}</span></p>}
                </div>
              </div>
            </div>

            {/* Client / Bill To Row */}
            <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.toClient}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{invoice.client.company || invoice.client.name}</h3>
                {invoice.client.company && <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Attn: {invoice.client.name}</p>}
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-1 space-y-0.5 leading-tight">
                  <p className="line-clamp-2">{invoice.client.address}</p>
                  <p>{invoice.client.email} {invoice.client.phone && `• ${invoice.client.phone}`}</p>
                  {invoice.client.taxId && <p>{t.taxId}: <span className="font-mono font-medium">{cleanTaxId(invoice.client.taxId)}</span></p>}
                </div>
              </div>

              <div className="flex flex-col justify-end text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.grandTotal}</span>
                <div className="text-2xl font-extrabold font-mono tracking-tight mt-0.5 whitespace-nowrap" style={{ color: primaryColor }}>
                  {formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.status}: <span className="font-bold uppercase">{invoice.status}</span></p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]" style={{ backgroundColor: `${primaryColor}0d` }}>
                    <th className={`${tableCellPadding} w-10`}>#</th>
                    <th className={tableCellPadding}>{t.itemDescription}</th>
                    <th className={`${tableCellPadding} text-center w-14`}>{t.qty}</th>
                    <th className={`${tableCellPadding} text-right w-24`}>{t.price}</th>
                    <th className={`${tableCellPadding} text-center w-20`}>{t.tax} / {t.discount}</th>
                    <th className={`${tableCellPadding} text-right w-28`}>{t.amount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {invoice.items.map((item, idx) => {
                    const base = item.quantity * item.unitPrice;
                    let disc = 0;
                    if (item.discountType === 'percent') {
                      disc = base * (item.discount / 100);
                    } else {
                      disc = item.discount || 0;
                    }
                    const lineTotal = Math.max(0, base - disc) * (1 + item.taxRate / 100);

                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 avoid-break">
                        <td className={`${tableCellPadding} text-slate-400 font-mono`}>{idx + 1}</td>
                        <td className={tableCellPadding}>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
                          {item.description && <div className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-pre-line mt-0.5">{item.description}</div>}
                        </td>
                        <td className={`${tableCellPadding} text-center font-mono`}>{item.quantity} {item.unit && <span className="text-[9px] text-slate-400">{item.unit}</span>}</td>
                        <td className={`${tableCellPadding} text-right font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap`}>{formatCurrency(item.unitPrice, invoice.currency, invoice.language)}</td>
                        <td className={`${tableCellPadding} text-center font-mono text-[10px]`}>
                          {item.taxRate > 0 && <span className="block text-emerald-600 dark:text-emerald-400">+{item.taxRate}%</span>}
                          {item.discount > 0 && <span className="block text-rose-600 dark:text-rose-400">-{item.discountType === 'percent' ? `${item.discount}%` : formatCurrency(item.discount, invoice.currency, invoice.language)}</span>}
                          {item.taxRate === 0 && item.discount === 0 && <span className="text-slate-400">-</span>}
                        </td>
                        <td className={`${tableCellPadding} text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap`}>{formatCurrency(lineTotal, invoice.currency, invoice.language)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-12 gap-4 pt-1 avoid-break">
              <div className="col-span-7 space-y-3 text-[11px] text-slate-600 dark:text-slate-400">
                {invoice.issuer.bankAccountNo && (
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-[10px] uppercase tracking-wider">{t.paymentDetails}</span>
                    <p><span className="text-slate-400">{t.bankName}:</span> <strong className="text-slate-800 dark:text-slate-200">{invoice.issuer.bankName}</strong></p>
                    <p><span className="text-slate-400">{t.accountNo}:</span> <strong className="font-mono text-slate-900 dark:text-white text-xs">{invoice.issuer.bankAccountNo}</strong></p>
                    <p><span className="text-slate-400">{t.accountName}:</span> {invoice.issuer.bankAccountName}</p>
                    {invoice.issuer.swiftCode && <p><span className="text-slate-400">{t.swiftCode}:</span> <span className="font-mono">{invoice.issuer.swiftCode}</span></p>}
                  </div>
                )}
                {invoice.notes && (
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase">{t.notes}</span>
                    <p className="mt-0.5 leading-snug text-slate-600 dark:text-slate-400 whitespace-pre-line">{invoice.notes}</p>
                  </div>
                )}
                {invoice.paymentTerms && (
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase">{t.paymentTerms}</span>
                    <p className="mt-0.5 leading-snug text-slate-500 dark:text-slate-400 italic">{invoice.paymentTerms}</p>
                  </div>
                )}
                {plan === 'paid' && Boolean(invoice.issuer.qrisUrl) && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs shrink-0">
                      {invoice.issuer.qrisUrl?.startsWith('data:image/') || invoice.issuer.qrisUrl?.startsWith('http') ? (
                        <img src={invoice.issuer.qrisUrl} alt="QRIS Payment" className="w-[65px] h-[65px] object-contain rounded-md" />
                      ) : (
                        <QRCodeSVG value={invoice.issuer.qrisUrl!} size={65} />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">{t.scanQrisPayment}</span>
                      <p className="text-[10px] text-slate-500 leading-tight">Scan via BCA Mobile, GoPay, OVO, ShopeePay, atau m-Banking.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 text-[11px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{t.subtotal}</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{formatCurrency(totals.subtotal, invoice.currency, invoice.language)}</span>
                  </div>
                  {totals.totalDiscount > 0 && (
                    <div className="flex justify-between text-rose-600 dark:text-rose-400">
                      <span>{t.discountTotal}</span>
                      <span className="font-mono font-semibold whitespace-nowrap">-{formatCurrency(totals.totalDiscount, invoice.currency, invoice.language)}</span>
                    </div>
                  )}
                  {totals.totalTax > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>{t.taxTotal} ({invoice.taxName})</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">+{formatCurrency(totals.totalTax, invoice.currency, invoice.language)}</span>
                    </div>
                  )}
                  {totals.shippingFee > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>{t.shipping}</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">+{formatCurrency(totals.shippingFee, invoice.currency, invoice.language)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-1.5 flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{t.grandTotal}</span>
                    <span className="font-extrabold font-mono text-lg whitespace-nowrap" style={{ color: primaryColor }}>{formatCurrency(totals.grandTotal, invoice.currency, invoice.language)}</span>
                  </div>
                </div>

                {theme.showSignature && (
                  <div className="text-right pt-1 space-y-0.5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Hormat Kami / Authorized Signature</p>
                    {invoice.issuer.signatureUrl ? (
                      <img src={invoice.issuer.signatureUrl} alt="Signature" className="h-12 ml-auto object-contain my-0.5" />
                    ) : (
                      <div className="h-10 border-b border-slate-300 dark:border-slate-700 w-36 ml-auto flex items-end justify-center">
                        <span className="text-[9px] text-slate-300 italic mb-0.5">[ Stamp / Sign ]</span>
                      </div>
                    )}
                    <p className="font-bold text-[11px] text-slate-800 dark:text-slate-200">{invoice.issuer.ownerName || invoice.issuer.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer info line - Watermark ONLY for Free users */}
        {plan === 'free' && (
          <div className="text-center text-[9px] text-slate-400 dark:text-slate-600 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
            Generated with Tagih Dong • Professional Invoice System
          </div>
        )}
      </div>
    </div>
  );
};
