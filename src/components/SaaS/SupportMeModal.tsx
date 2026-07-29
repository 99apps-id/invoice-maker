import React, { useState } from 'react';
import { X, Heart, Copy, CheckCircle2, QrCode } from 'lucide-react';
import type { Language } from '../../types';

interface SupportMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const SupportMeModal: React.FC<SupportMeModalProps> = ({
  isOpen,
  onClose,
  language = 'id',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyNmid = () => {
    navigator.clipboard.writeText('ID102543215223');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = {
    id: {
      badge: 'Support Me • Dukung Pengembang',
      title: 'Dukung Tagih Dong Tetap Gratis! ☕',
      description:
        'Seluruh fitur pembuat invoice profesional di platform ini disediakan 100% GRATIS tanpa biaya berlangganan. Jika Tagih Dong membantu kelancaran bisnis Anda, dukung pengembang melalui donasi sukarela!',
      scanHeader: 'Scan QRIS Resmi Donasi Tagih Dong',
      compatibleWith:
        'Bisa di-scan via GoPay, OVO, ShopeePay, DANA, BCA Mobile, Mandiri, BRI, BNI, LinkAja & semua aplikasi m-Banking.',
      presetTitle: 'Pilihan Apresiasi Sukarela:',
      presetCoffee: '1 Kopi',
      presetLunch: 'Makan Siang',
      presetSponsor: 'Sponsor Utama',
      presetVoluntary: 'Sukarela',
      closeBtn: 'Selesai & Lanjutkan Buat Invoice',
      copyTitle: 'Salin NMID',
    },
    en: {
      badge: 'Support Me • Support The Developer',
      title: 'Support Tagih Dong to Stay Free! ❤️',
      description:
        'All professional invoice creation features are provided 100% FREE without any subscription fees. If Tagih Dong helps your business grow, consider supporting the developer via voluntary donations!',
      scanHeader: 'Scan Official Tagih Dong Donation QRIS',
      compatibleWith:
        'Scannable via GoPay, OVO, ShopeePay, DANA, BCA Mobile, Mandiri, BRI, BNI, LinkAja & all Mobile Banking apps.',
      presetTitle: 'Voluntary Support Tiers:',
      presetCoffee: '1 Coffee',
      presetLunch: '1 Lunch',
      presetSponsor: 'Main Sponsor',
      presetVoluntary: 'Voluntary',
      closeBtn: 'Done & Continue Creating Invoices',
      copyTitle: 'Copy NMID',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header Ribbon Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-tr from-rose-500/20 to-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Badge */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-extrabold">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {t.description}
          </p>
        </div>

        {/* Donation QRIS Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
            <QrCode className="w-4 h-4 text-indigo-500" />
            <span>{t.scanHeader}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-md inline-block mx-auto max-w-[240px]">
            <img
              src="/donation-qris.jpg"
              alt="QRIS Donasi NESA DIGITAL SOLUTION"
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>

          <div className="space-y-1">
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              NESA DIGITAL SOLUTION
            </h4>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <span>NMID: ID102543215223</span>
              <button
                type="button"
                onClick={handleCopyNmid}
                className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-indigo-500 hover:text-white transition text-[10px]"
                title={t.copyTitle}
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </p>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            {t.compatibleWith}
          </p>
        </div>

        {/* Suggested Nominal Badges */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block text-center uppercase tracking-wider">
            {t.presetTitle}
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <span className="block text-amber-500">{t.presetCoffee}</span>
              <span className="text-[11px] font-mono font-normal">Rp 15.000</span>
            </div>
            <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <span className="block text-amber-500">{t.presetLunch}</span>
              <span className="text-[11px] font-mono font-normal">Rp 35.000</span>
            </div>
            <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <span className="block font-black">{t.presetSponsor}</span>
              <span className="text-[11px] font-mono font-normal">{t.presetVoluntary}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
