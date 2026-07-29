import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Globe,
  Printer,
  ShieldCheck,
  QrCode,
  FileSpreadsheet,
  Heart,
  Sun,
  Moon,
  Calculator,
  Download,
  Building2,
  Coffee,
  Code2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLoginModal } from '../Auth/GoogleLoginModal';
import { SupportMeModal } from './SupportMeModal';
import type { Language, AppTheme } from '../../types';

interface LandingPageProps {
  onStartInvoice: () => void;
  language: Language;
  theme?: AppTheme;
  onThemeToggle?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartInvoice,
  language: initialLanguage,
  theme = 'light',
  onThemeToggle,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [lang, setLang] = useState<Language>(initialLanguage);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupportMeOpen, setIsSupportMeOpen] = useState(false);

  // Interactive Live Demo Tab State
  const [demoTab, setDemoTab] = useState<'freelance' | 'retail' | 'consultant'>('freelance');

  // Interactive Calculator State
  const [invoiceCount, setInvoiceCount] = useState<number>(25);

  const isDark = theme === 'dark';

  // Smart action trigger: enter workspace if authenticated, or open login modal if not
  const handleAction = () => {
    if (isAuthenticated && user) {
      onStartInvoice();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Demo Invoice Data Sets
  const demoInvoices = {
    freelance: {
      title: 'Studio Web Creative',
      client: 'PT Maju Bersama Tech',
      invNo: 'INV/2026/089',
      items: [
        { desc: 'Desain UI/UX & Prototipe Figma', qty: 1, price: 3500000 },
        { desc: 'Pengembangan Website React & Tailwind', qty: 1, price: 5000000 },
      ],
      tag: 'Digital Agency',
      icon: Code2,
    },
    retail: {
      title: 'Kopi Susu Nusantara',
      client: 'Acara Gathering Komunitas',
      invNo: 'INV/2026/142',
      items: [
        { desc: 'Kopi Susu Gula Aren (Botol 1L)', qty: 15, price: 75000 },
        { desc: 'Snack Box Pastry Kombinasi', qty: 30, price: 25000 },
      ],
      tag: 'Toko / Retail',
      icon: Coffee,
    },
    consultant: {
      title: 'Konsultan Pajak & Keuangan',
      client: 'CV Sinar Makmur',
      invNo: 'INV/2026/015',
      items: [
        { desc: 'Audit Laporan Keuangan Tahunan', qty: 1, price: 6500000 },
        { desc: 'Konsultasi Perencanaan Pajak Usaha', qty: 4, price: 1000000 },
      ],
      tag: 'Jasa Konsultan',
      icon: Building2,
    },
  };

  const activeDemo = demoInvoices[demoTab];
  const activeSubtotal = activeDemo.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const activeTax = Math.round(activeSubtotal * 0.11);
  const activeTotal = activeSubtotal + activeTax;

  // Calculate Savings Stats based on slider
  const inkSavedRp = (invoiceCount * 3500 * 12).toLocaleString('id-ID');
  const hoursSaved = Math.round(invoiceCount * 0.25 * 12);

  // Translations without AI emojis
  const t = {
    id: {
      announcement: '100% GRATIS • TANPA WATERMARK • BEBAS BIAYA BERLANGGANAN',
      heroHeadlinePrefix: 'Solusi Pembuat Invoice',
      heroHeadlineHighlight: 'Paling Cepat & Ramah Tinta',
      heroHeadlineSuffix: 'untuk Usaha Anda.',
      subTitle:
        'Dibuat khusus untuk UMKM, toko retail, & freelancer. Kirim faktur profesional dalam 10 detik, terima pembayaran QRIS instan, dan cetak PDF hemat tinta printer.',
      btnTryFree: 'Buat Invoice',
      btnWorkspace: 'Login/Daftar',
      badge1: '100% Free Forever',
      badge2: 'Hemat Tinta Printer',
      badge3: 'Multi-Profil & QRIS',
      bentoTag: 'Fitur Utama',
      bentoTitle: 'Didesain Khusus Agar Anda Terbayar Lebih Cepat',
      bentoSubtitle: 'Semua kemudahan penagihan yang dibutuhkan usaha Anda ada di sini.',
      bento1Title: 'Engine Kertas Ramah Tinta (Ink-Saver)',
      bento1Desc: 'Desain faktur bersih berbasis kertas A4 presisi tanpa latar warna gelap yang memboroskan toner printer hingga 70%.',
      bento2Title: 'Kode QRIS & Transfer Bank Instan',
      bento2Desc: 'Sediakan barcode QRIS statis bisnis Anda agar klien dapat langsung melakukan pembayaran dari m-Banking atau e-Wallet favorit.',
      bento3Title: 'Kelola Banyak Profil Usaha Dalam 1 Akun',
      bento3Desc: 'Mempunyai lebih dari satu toko atau usaha? Alihkan identitas faktur hanya dengan 1-klik tanpa perlu buat akun baru.',
      bento4Title: '100% Privasi & Ekspor PDF Presisi',
      bento4Desc: 'Data bisnis Anda tersimpan aman. Hasil ekspor PDF tampil tajam dan bebas dari watermark iklan apapun.',
      calcTitle: 'Hitung Penghematan Usaha Anda',
      calcSub: 'Geser jumlah faktur yang Anda terbitkan per bulan untuk melihat estimasi penghematan tinta & waktu.',
      calcLabel: 'Jumlah Invoice per Bulan:',
      calcRes1: 'Estimasi Hemat Tinta / Tahun',
      calcRes2: 'Estimasi Waktu Dihemat / Tahun',
    },
    en: {
      announcement: '100% FREE • ZERO WATERMARK • NO SUBSCRIPTION FEES',
      heroHeadlinePrefix: 'The Fastest &',
      heroHeadlineHighlight: 'Ink-Friendly Invoice Generator',
      heroHeadlineSuffix: 'for Your Business.',
      subTitle:
        'Built for SMBs, retail shops & freelancers. Issue professional invoices in 10 seconds, receive instant QRIS payments, and export ink-saving PDFs.',
      btnTryFree: 'Create Invoice',
      btnWorkspace: 'Login/Sign Up',
      badge1: '100% Free Forever',
      badge2: 'Ink-Saving Templates',
      badge3: 'Multi-Profile & QRIS',
      bentoTag: 'Core Features',
      bentoTitle: 'Engineered to Get You Paid 3x Faster',
      bentoSubtitle: 'Everything your business needs to issue clear, frictionless invoices.',
      bento1Title: 'Ink-Saver Paper Layout Engine',
      bento1Desc: 'Clean A4 print designs that save up to 70% printer toner compared to heavy dark templates.',
      bento2Title: 'Instant QRIS & Bank Transfer Barcodes',
      bento2Desc: 'Embed static QRIS barcodes directly into your invoice for instant m-Banking scans.',
      bento3Title: 'Multi-Business Profile Management',
      bento3Desc: 'Manage multiple brand or shop identities effortlessly under one single user account.',
      bento4Title: '100% Privacy & Pixel-Perfect PDF',
      bento4Desc: 'Your business data stays secure. Download crisp PDF files with zero promotional watermarks.',
      calcTitle: 'Estimate Your Business Savings',
      calcSub: 'Adjust your monthly invoice volume to calculate printer ink & time savings.',
      calcLabel: 'Invoices Issued Per Month:',
      calcRes1: 'Est. Ink Savings / Year',
      calcRes2: 'Est. Time Saved / Year',
    },
  }[lang];

  return (
    <div
      className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background Ambient Glows */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full blur-[120px] pointer-events-none ${
          isDark ? 'bg-indigo-600/20' : 'bg-indigo-500/15'
        }`}
      />
      <div
        className={`absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
          isDark ? 'bg-purple-600/15' : 'bg-purple-500/10'
        }`}
      />

      {/* Floating Announcement Bar */}
      <div
        className={`py-2 px-4 text-center text-xs font-black tracking-wide border-b transition-colors ${
          isDark ? 'bg-indigo-950/60 border-indigo-800/40 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
        }`}
      >
        <span>{t.announcement}</span>
      </div>

      {/* Navigation Header */}
      <nav
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
          isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white/85 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <FileCheck2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span
                className={`font-black text-xl tracking-tight flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Tagih Dong
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  100% FREE
                </span>
              </span>
              <p className={`text-[11px] font-medium hidden sm:block ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                Pembuat Invoice & Faktur Bisnis Profesional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Support Me Button */}
            <button
              type="button"
              onClick={() => setIsSupportMeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold text-rose-500 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition animate-pulse"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="hidden sm:inline">Support Me!</span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-bold transition ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-400'
              }`}
              title="Switch Language / Ganti Bahasa"
            >
              <Globe className="w-4 h-4 text-indigo-500" />
              <span className="uppercase">{lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
            </button>

            {/* Theme Switcher */}
            {onThemeToggle && (
              <button
                type="button"
                onClick={onThemeToggle}
                className={`p-1.5 sm:p-2 rounded-xl border text-xs font-bold transition ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-400'
                }`}
                title="Toggle Light / Dark Theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            )}

            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={onStartInvoice}
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/25 transition transform active:scale-95"
              >
                <span>{t.btnWorkspace}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAction}
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/25 transition transform active:scale-95"
              >
                <span>{t.btnTryFree}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Headline & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Aplikasi Faktur Bisnis Tanpa Biaya Berlangganan</span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t.heroHeadlinePrefix}{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                {t.heroHeadlineHighlight}
              </span>{' '}
              {t.heroHeadlineSuffix}
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.subTitle}
            </p>

            {/* Badges Pill Row */}
            <div className={`grid grid-cols-3 gap-2 text-xs font-extrabold pt-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              <div className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.badge1}</span>
              </div>
              <div className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.badge2}</span>
              </div>
              <div className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.badge3}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleAction}
                className="py-4 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
              >
                <FileCheck2 className="w-5 h-5" />
                <span>{t.btnTryFree}</span>
              </button>

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`py-4 px-6 rounded-2xl border font-bold text-sm transition flex items-center justify-center gap-2 ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  <span>Atau Masuk via Google</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: INTERACTIVE LIVE DEMO CARD */}
          <div className="lg:col-span-6">
            <div className="space-y-3">
              {/* Interactive Demo Type Tabs */}
              <div className={`flex items-center gap-2 p-1 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-200/80 border-slate-300/60'}`}>
                <button
                  type="button"
                  onClick={() => setDemoTab('freelance')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                    demoTab === 'freelance'
                      ? isDark ? 'bg-slate-900 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Web Freelance</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoTab('retail')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                    demoTab === 'retail'
                      ? isDark ? 'bg-slate-900 text-purple-400 shadow-sm' : 'bg-white text-purple-600 shadow-sm'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Kopi Shop Retail</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDemoTab('consultant')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                    demoTab === 'consultant'
                      ? isDark ? 'bg-slate-900 text-amber-400 shadow-sm' : 'bg-white text-amber-600 shadow-sm'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Jasa Konsultan</span>
                </button>
              </div>

              {/* Simulated Paper Invoice Sheet Card */}
              <div className="relative group rounded-3xl p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 shadow-2xl transition duration-300">
                <div className={`rounded-[22px] p-5 space-y-4 ${isDark ? 'bg-slate-950 text-white border border-slate-800' : 'bg-white text-slate-900 border border-slate-200'}`}>
                  {/* Card Header */}
                  <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg font-black flex items-center justify-center text-xs ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-500/15 text-indigo-600'}`}>
                        <activeDemo.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`font-extrabold text-sm leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeDemo.title}</h4>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No: {activeDemo.invNo}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      ✓ Status: Siap Kirim
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className={`text-xs space-y-0.5 p-2.5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ditagihkan Kepada:</span>
                    <span className={`font-extrabold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeDemo.client}</span>
                  </div>

                  {/* Items Mini Table */}
                  <div className="space-y-2 text-xs">
                    {activeDemo.items.map((item, idx) => (
                      <div key={idx} className={`flex items-center justify-between py-1.5 border-b border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                        <div>
                          <p className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.desc}</p>
                          <p className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{item.qty}x @ Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <span className={`font-extrabold font-mono text-sm ${isDark ? 'text-indigo-300' : 'text-slate-900'}`}>
                          Rp {(item.qty * item.price).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculation & QRIS Payment Row */}
                  <div className="pt-1 flex items-center justify-between gap-4">
                    <div className={`flex items-center gap-2 p-2 rounded-xl border ${isDark ? 'bg-indigo-950 border-indigo-800 text-indigo-200' : 'bg-indigo-50 border-indigo-100 text-indigo-900'}`}>
                      <QrCode className={`w-7 h-7 shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      <div>
                        <span className={`text-[10px] font-bold block ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>QRIS Statis Ready</span>
                        <span className={`text-[9px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>NMID: ID10254321...</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] uppercase block font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Tagihan (Inc. PPN)</span>
                      <span className={`font-black text-lg font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        Rp {activeTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`w-full py-2.5 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                      isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Buat Invoice Seperti Ini (Gratis)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID FEATURE SHOWCASE SECTION */}
      <section className={`py-20 border-t px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {t.bentoTag}
            </span>
            <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.bentoTitle}
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.bentoSubtitle}
            </p>
          </div>

          {/* Asymmetric Bento Box Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feature 1: Ink-Saver Engine (Large 2-Span Box) */}
            <div className={`lg:col-span-2 border rounded-3xl p-8 space-y-6 flex flex-col justify-between transition ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-3 max-w-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className={`font-black text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.bento1Title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.bento1Desc}</p>
              </div>

              {/* Ink Cost Comparison Visualization */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block">📊 Perbandingan Biaya Tinta Printer / 100 Lembar Cetak:</span>
                <div className="space-y-2 text-xs font-bold">
                  <div>
                    <div className="flex justify-between text-[11px] text-rose-500 dark:text-rose-400 mb-1">
                      <span>Template Latar Gelap Generik (Aplikasi Lain)</span>
                      <span>~ Rp 350.000 / cartridge</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="w-[85%] h-full bg-rose-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400 mb-1">
                      <span>Template Ramah Tinta (Tagih Dong)</span>
                      <span>~ Rp 85.000 / cartridge (Hemat 70%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="w-[25%] h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: QRIS Instant Payment */}
            <div className={`border rounded-3xl p-8 space-y-4 flex flex-col justify-between transition ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.bento2Title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.bento2Desc}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 rounded-2xl text-center">
                <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300">✓ Scan via GoPay, BCA, OVO, ShopeePay</span>
              </div>
            </div>

            {/* Feature 3: Multi-Profile Management */}
            <div className={`border rounded-3xl p-8 space-y-4 flex flex-col justify-between transition ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.bento3Title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.bento3Desc}</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-center">
                <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-300">✓ Saklar Profil Usaha 1-Klik</span>
              </div>
            </div>

            {/* Feature 4: Privacy & A4 PDF (2-Span Box) */}
            <div className={`lg:col-span-2 border rounded-3xl p-8 space-y-4 flex flex-col justify-between transition ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className={`font-black text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.bento4Title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.bento4Desc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-extrabold">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-center">
                  🔒 Lokal & Terenkripsi
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-center">
                  📄 Tanpa Watermark Iklan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SAVINGS CALCULATOR SECTION */}
      <section className={`py-16 border-t px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.calcTitle}
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.calcSub}
            </p>
          </div>

          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-extrabold">
                <label htmlFor="inv-slider" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-500" />
                  <span>{t.calcLabel}</span>
                </label>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-mono text-base">
                  {invoiceCount} Invoice / Bulan
                </span>
              </div>
              <input
                id="inv-slider"
                type="range"
                min="5"
                max="150"
                step="5"
                value={invoiceCount}
                onChange={(e) => setInvoiceCount(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">{t.calcRes1}</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  Rp {inkSavedRp}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 space-y-1">
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 block">{t.calcRes2}</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {hoursSaved} Jam Kerja
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className={`py-20 border-t px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1 text-amber-500 text-xs font-extrabold uppercase tracking-wider">
              <span>★★★★★</span>
              <span className={`ml-1 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Dipercaya Pelaku Usaha</span>
            </div>
            <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'id' ? 'Dipercaya oleh para pelaku UMKM & Freelancer' : 'Trusted by Thousands of SMBs & Freelancers'}
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {lang === 'id'
                ? 'Dengarkan pengalaman nyata pengguna Tagih Dong dalam mengelola tagihan bisnis.'
                : 'Real feedback from businesses using Tagih Dong.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`border rounded-3xl p-6 space-y-4 shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                ★★★★★
              </div>
              <p className={`text-xs leading-relaxed italic ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                "{lang === 'id'
                  ? 'Format kertasnya sangat ramah tinta! Sebelumnya saya sering kehabisan toner printer karena latar hitam dari aplikasi lain. Di Tagih Dong semuanya bersih dan hemat.'
                  : 'The paper layout is super ink-friendly! Tagih Dong keeps everything clean and economical.'}"
              </p>
              <div className={`pt-2 border-t flex items-center gap-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center text-xs border border-indigo-500/30">
                  BS
                </div>
                <div>
                  <h4 className={`font-extrabold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Budi Santoso</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Founder, PT Nusantara Digital</p>
                </div>
              </div>
            </div>

            <div className={`border rounded-3xl p-6 space-y-4 shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                ★★★★★
              </div>
              <p className={`text-xs leading-relaxed italic ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                "{lang === 'id'
                  ? 'Fitur QRIS langsung di invoice luar biasa membantu! Klien saya tinggal scan dari GoPay atau BCA Mobile, pembayaran langsung lunas tanpa tanya rekening lagi.'
                  : 'The instant QRIS barcode on the invoice is amazing! Clients scan and pay instantly.'}"
              </p>
              <div className={`pt-2 border-t flex items-center gap-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-black flex items-center justify-center text-xs border border-purple-500/30">
                  RW
                </div>
                <div>
                  <h4 className={`font-extrabold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Rina Wijaya</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">UI/UX Freelancer, Jakarta</p>
                </div>
              </div>
            </div>

            <div className={`border rounded-3xl p-6 space-y-4 shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                ★★★★★
              </div>
              <p className={`text-xs leading-relaxed italic ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                "{lang === 'id'
                  ? 'Kelola 3 profil toko online berbeda cuma pakai 1 akun Google. Luar biasa praktis dan 100% gratis tanpa watermark pengganggu!'
                  : 'Managing 3 online store profiles under 1 account is super practical with zero watermark!'}"
              </p>
              <div className={`pt-2 border-t flex items-center gap-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center text-xs border border-emerald-500/30">
                  HS
                </div>
                <div>
                  <h4 className={`font-extrabold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Hendra Setiawan</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Owner Toko Online, Surabaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className={`py-20 border-t px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'id' ? 'Pertanyaan Umum (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {lang === 'id'
                ? 'Jawaban praktis mengenai penggunaan Tagih Dong.'
                : 'Quick answers regarding Tagih Dong usage.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className={`border rounded-2xl p-5 space-y-2 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`font-extrabold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">Q:</span>
                {lang === 'id'
                  ? 'Apakah Tagih Dong benar-benar 100% Gratis?'
                  : 'Is Tagih Dong really 100% Free to use?'}
              </h3>
              <p className={`text-xs leading-relaxed pl-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {lang === 'id'
                  ? 'Ya! Seluruh fitur pembuatan faktur, tema ramah tinta, ekspor PDF, tanda tangan digital, dan QRIS dapat Anda gunakan 100% gratis tanpa biaya berlangganan tersembunyi.'
                  : 'Yes! All features including invoice creation, ink-friendly themes, PDF exports, digital signatures, and QRIS payments are 100% free with no hidden fees.'}
              </p>
            </div>

            <div className={`border rounded-2xl p-5 space-y-2 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`font-extrabold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">Q:</span>
                {lang === 'id'
                  ? 'Apakah hasil ekspor PDF bebas dari watermark?'
                  : 'Are PDF exports free from watermark logos?'}
              </h3>
              <p className={`text-xs leading-relaxed pl-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {lang === 'id'
                  ? 'Tentu saja! Berkas PDF invoice yang Anda unduh tampil bersih dan profesional tanpa watermark iklan aplikasi.'
                  : 'Absolutely! All downloaded PDF invoice documents are completely clean and professional without any promotional watermark logos.'}
              </p>
            </div>

            <div className={`border rounded-2xl p-5 space-y-2 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className={`font-extrabold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">Q:</span>
                {lang === 'id'
                  ? 'Bagaimana cara memasukkan QRIS pembayaran pada invoice?'
                  : 'How do I add a payment QRIS code to my invoice?'}
              </h3>
              <p className={`text-xs leading-relaxed pl-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {lang === 'id'
                  ? 'Cukup masuk ke form invoice, lalu unggah gambar QRIS atau masukkan URL QRIS bisnis Anda. Sistem kami secara otomatis memotong dan menampilkan kode QRIS resmi di kertas faktur.'
                  : 'Simply open the invoice form and upload your business QRIS image or enter its URL. Our built-in cropper automatically renders the official barcode on your invoice.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-8 border-t text-center text-xs ${isDark ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <p>&copy; {new Date().getFullYear()} Tagih Dong by 99apps.id. Hak Cipta Dilindungi Undang-Undang.</p>
      </footer>

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          onStartInvoice();
        }}
        language={lang}
      />

      {/* Support Me Modal */}
      <SupportMeModal
        isOpen={isSupportMeOpen}
        onClose={() => setIsSupportMeOpen(false)}
        language={lang}
      />
    </div>
  );
};
