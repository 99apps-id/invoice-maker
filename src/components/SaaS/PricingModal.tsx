import React, { useState } from 'react';
import { X, Check, Shield, Zap, Lock, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Language } from '../../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  lockedFeatureName?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  lockedFeatureName,
}) => {
  const { plan } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [upgradeMessage, setUpgradeMessage] = useState('');

  if (!isOpen) return null;

  const handleUpgrade = (tier: 'paid' | 'free') => {
    setUpgradeMessage(
      tier === 'paid'
        ? 'Pembayaran online belum tersedia. Hubungi support@99apps.id untuk aktivasi paket PRO.'
        : 'Perubahan paket harus dikonfirmasi oleh layanan akun.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        {/* Banner if triggered by locked feature */}
        {lockedFeatureName && (
          <div className="bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white px-6 py-2.5 text-xs font-extrabold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-300" />
              <span>Fitur Eksklusif PRO: {lockedFeatureName}</span>
            </div>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
              Khusus Paket Paid PRO
            </span>
          </div>
        )}

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500 animate-bounce" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Pilih Paket Tagih Dong
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Buka seluruh 24 tema kertas, bebas watermark, QRIS instan & tanda tangan digital.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billing Cycle Switch */}
        <div className="flex justify-center my-4 px-6">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Tahunan</span>
              <span className="bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
                Hemat 50%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 pt-2">
          {/* FREE TIER CARD */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  GRATIS (Free Tier)
                </h3>
                {plan === 'free' && (
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Paket Aktif
                  </span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-2xl font-black text-slate-900 dark:text-white">Rp 0</span>
                <span className="text-xs text-slate-400"> / selamanya</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>5 Tema Faktur Kertas Dasar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1 Tipografi Font Standar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cetak PDF Ramah Tinta Komputer</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="line-through">Watermark Tagih Dong di Footer</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="line-through">Fitur QRIS Statis</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="line-through">Tanda Tangan Digital Canvas</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleUpgrade('free')}
              disabled={plan === 'free'}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              {plan === 'free' ? 'Paket Aktif Saat Ini' : 'Ganti ke Paket Gratis'}
            </button>
          </div>

          {/* PAID PRO TIER CARD */}
          <div className="border-2 border-indigo-600 dark:border-indigo-500 rounded-2xl p-5 bg-gradient-to-b from-indigo-50/40 via-white to-purple-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 flex flex-col justify-between space-y-4 relative shadow-xl">
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>Rekomendasi</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-indigo-600 dark:text-indigo-400 text-base flex items-center gap-1.5">
                  <span>PAID PRO</span>
                  <Crown className="w-4 h-4 text-amber-500" />
                </h3>
                {plan === 'paid' && (
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Paket Aktif PRO
                  </span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {billingCycle === 'yearly' ? 'Rp 24.900' : 'Rp 49.000'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {billingCycle === 'yearly' ? ' / bulan (ditagih tahunan)' : ' / bulan'}
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Semua 24 Tema Faktur Kertas Unlocked</span>
                </li>
                <li className="flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Semua Font Premium Unlocked</span>
                </li>
                <li className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>BEBAS Watermark Tagih Dong (100% Bersih)</span>
                </li>
                <li className="flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Fitur Pembayaran QRIS Statis + Cropper</span>
                </li>
                <li className="flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tanda Tangan Digital Canvas / Upload</span>
                </li>
                <li className="flex items-center gap-2 font-medium text-slate-500">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dukungan Prioritas 24/7 via WhatsApp/Email</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleUpgrade('paid')}
              className="w-full py-3 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              {plan === 'paid' ? (
                'Paket PRO Aktif (Klik untuk Memperbarui)'
              ) : (
                'Hubungi Tim untuk Upgrade'
              )}
            </button>
            {upgradeMessage && (
              <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300" role="status">
                {upgradeMessage}
              </p>
            )}
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Garansi 30 hari uang kembali tanpa syarat</span>
          </div>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Support: support@99apps.id
          </span>
        </div>
      </div>
    </div>
  );
};
