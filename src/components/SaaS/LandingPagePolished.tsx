import React, { useState } from 'react';
import {
  ArrowRight, Check, ChevronRight, FileCheck2,
  Globe, Heart, Moon, Printer, QrCode, ShieldCheck, Sun,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { AppTheme, Language } from '../../types';
import { GoogleLoginModal } from '../Auth/GoogleLoginModal';
import { SupportMeModal } from './SupportMeModal';
import './LandingPage.css';

interface Props {
  onStartInvoice: () => void;
  language: Language;
  theme?: AppTheme;
  onThemeToggle?: () => void;
}

export const LandingPagePolished: React.FC<Props> = ({
  onStartInvoice, language: initialLanguage, theme = 'light', onThemeToggle,
}) => {
  const { isAuthenticated } = useAuth();
  const [language, setLanguage] = useState(initialLanguage);
  const [monthly, setMonthly] = useState(25);
  const [authOpen, setAuthOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const isDark = theme === 'dark';
  const isEnglish = language === 'en';
  const action = () => isAuthenticated ? onStartInvoice() : setAuthOpen(true);

  const copy = isEnglish ? {
    descriptor: 'Invoicing for Indonesian businesses',
    eyebrow: 'Clear invoices. Calmer follow-ups.',
    title: 'Create, send, and archive invoices without the busywork.',
    intro: 'Tagih Dong helps freelancers and small businesses prepare professional invoices, add QRIS, and print ink-conscious PDFs.',
    primary: isAuthenticated ? 'Continue to workspace' : 'Create your first invoice',
    secondary: 'View invoice example',
    capabilities: 'Everything you need to invoice with clarity.',
    capabilitiesBody: 'Enter business details once, reuse them, and export when the invoice is ready.',
    workflow: 'From work details to PDF in one flow.',
    calculator: 'Estimate your admin volume',
    calculatorBody: 'See how many invoices your business prepares over a year.',
    faq: 'Before you begin',
  } : {
    descriptor: 'Teman bikin invoice usaha',
    eyebrow: 'Biar urusan nagih jadi lebih gampang.',
    title: 'Bikin invoice rapi, tanpa bikin pusing.',
    intro: 'Cukup isi detail jualan atau pekerjaanmu. Tagih Dong bantu rapikan invoice, tambahkan QRIS, dan siapkan PDF yang enak dilihat pelanggan.',
    primary: isAuthenticated ? 'Lanjut bikin invoice' : 'Buat invoice sekarang',
    secondary: 'Lihat tampilannya',
    capabilities: 'Yang kamu butuhkan, sudah ada di sini.',
    capabilitiesBody: 'Simpan data usaha sekali, pakai lagi kapan saja, lalu cetak saat invoice sudah siap.',
    workflow: 'Isi sebentar, invoice langsung siap.',
    calculator: 'Sebulan bikin berapa invoice?',
    calculatorBody: 'Geser angkanya untuk melihat perkiraan jumlah invoice usahamu selama setahun.',
    faq: 'Masih penasaran?',
  };

  return (
    <div className={`td-landing ${isDark ? 'is-dark' : ''}`}>
      <header className="td-nav">
        <a href="#top" className="td-brand" aria-label="Tagih Dong — beranda">
          <span className="td-brand-mark"><FileCheck2 /></span>
          <span><strong>Tagih Dong</strong><small>{copy.descriptor}</small></span>
        </a>
        <div className="td-nav-actions">
          <button className="td-icon-button td-support" type="button" onClick={() => setSupportOpen(true)}><Heart /><span>{isEnglish ? 'Support' : 'Dukung proyek'}</span></button>
          <button className="td-icon-button" type="button" onClick={() => setLanguage(isEnglish ? 'id' : 'en')} aria-label="Ganti bahasa"><Globe /><span>{language.toUpperCase()}</span></button>
          {onThemeToggle && <button className="td-icon-button td-theme" type="button" onClick={onThemeToggle} aria-label={isDark ? 'Tema terang' : 'Tema gelap'}>{isDark ? <Sun /> : <Moon />}</button>}
          <button className="td-button td-button-compact" type="button" onClick={action}>{isAuthenticated ? 'Workspace' : (isEnglish ? 'Start free' : 'Mulai gratis')}<ArrowRight /></button>
        </div>
      </header>

      <main id="top">
        <section className="td-hero">
          <div className="td-hero-copy">
            <p className="td-kicker">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="td-lead">{copy.intro}</p>
            <div className="td-hero-actions">
              <button className="td-button" type="button" onClick={action}>{copy.primary}<ArrowRight /></button>
              <a className="td-text-link" href="#contoh">{copy.secondary}<ChevronRight /></a>
            </div>
            <ul className="td-proof-list">
              {['Gratis tanpa watermark', 'Bisa untuk beberapa usaha', 'Siap cetak A4'].map(item => <li key={item}><Check />{item}</li>)}
            </ul>
          </div>

          <div className="td-demo-wrap" id="contoh">
            <div className="td-demo-heading">
              <span>{isEnglish ? 'Actual workspace' : 'Tampilan workspace asli'}</span>
              <span>EDITOR + PREVIEW</span>
            </div>
            <figure className="td-product-shot">
              <div className="td-product-shot-scroll" tabIndex={0} aria-label="Screenshot workspace Tagih Dong, dapat digeser horizontal pada layar kecil">
                <img
                  src="/hero-screenshot.png"
                  alt="Workspace Tagih Dong dengan editor data invoice di sebelah kiri dan pratinjau invoice A4 di sebelah kanan"
                  width="1024"
                  height="600"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <figcaption>
                {isEnglish
                  ? 'Edit invoice details and review the A4 result side by side.'
                  : 'Isi datanya di kiri, cek hasil invoice-nya langsung di kanan.'}
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="td-capabilities">
          <div className="td-section-heading"><h2>{copy.capabilities}</h2><p>{copy.capabilitiesBody}</p></div>
          <div className="td-feature-list">
            <article><span>01</span><Printer /><h3>Hasil cetak tetap rapi</h3><p>Lihat hasil invoice sambil mengisi. Jadi, kamu tahu persis apa yang akan diterima pelanggan.</p></article>
            <article><span>02</span><QrCode /><h3>Pelanggan lebih gampang bayar</h3><p>Tambahkan rekening bank atau QRIS langsung di invoice. Tidak perlu kirim info pembayaran terpisah.</p></article>
            <article><span>03</span><ShieldCheck /><h3>Tidak perlu isi dari awal lagi</h3><p>Simpan data usaha, barang, jasa, dan pelanggan untuk dipakai lagi di invoice berikutnya.</p></article>
          </div>
        </section>

        <section className="td-workflow">
          <h2>{copy.workflow}</h2>
          <ol>
            {[['Isi detail tagihan', 'Pilih pelanggan, tanggal, lalu masukkan barang atau jasa yang ditagih.'], ['Cek hasilnya', 'Invoice langsung berubah mengikuti data yang kamu isi.'], ['Simpan atau cetak', 'Kalau sudah pas, simpan invoice atau unduh sebagai PDF.']].map(([title, body], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}
          </ol>
        </section>

        <section className="td-calculator">
          <div><h2>{copy.calculator}</h2><p>{copy.calculatorBody}</p></div>
          <div className="td-calculator-control">
            <label htmlFor="monthly-invoices"><strong>{monthly}</strong><span>invoice / bulan</span></label>
            <input id="monthly-invoices" type="range" min="5" max="150" step="5" value={monthly} onChange={event => setMonthly(Number(event.target.value))} />
            <p><strong>{monthly * 12}</strong> invoice / tahun</p>
          </div>
        </section>

        <section className="td-faq">
          <h2>{copy.faq}</h2>
          <div>
            <details><summary>Benar-benar gratis?</summary><p>Iya. Kamu bisa membuat dan mencetak invoice tanpa watermark promosi.</p></details>
            <details><summary>Bisa pakai QRIS usaha sendiri?</summary><p>Bisa. Tinggal unggah gambar QRIS milik usahamu dari pengaturan profil.</p></details>
            <details><summary>Data usaha saya tersimpan di mana?</summary><p>Data bisa tersimpan di perangkat dan disinkronkan ke akun, sesuai pengaturan server yang digunakan.</p></details>
          </div>
        </section>
      </main>

      <footer className="td-footer"><div className="td-brand"><span className="td-brand-mark"><FileCheck2 /></span><span><strong>Tagih Dong</strong><small>Invoice rapi untuk usaha yang terus bergerak.</small></span></div><span>© 2026 99apps.id</span></footer>
      <GoogleLoginModal isOpen={authOpen} onClose={() => setAuthOpen(false)} language={language} />
      <SupportMeModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} language={language} />
    </div>
  );
};
