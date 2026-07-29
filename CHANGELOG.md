# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [1.0.0] - 2026-07-29

### Ditambahkan

#### Fitur Inti
- **Editor Invoice real-time** dengan live preview format A4
- **23+ template profesional**: Modern, Editorial, Corporate, Swiss Grid, Luxury Gold Leaf, Risograph, Minimal Mono, dll.
- **Nomor faktur otomatis** dengan format INV/YYYY/MM/NNN
- **Multi-mata uang**: IDR, USD, EUR, SGD, GBP, AUD, JPY
- **Kalkulasi otomatis**: Subtotal, PPN/Pajak (konfigurasi %), diskon (persen & nominal), biaya kirim
- **Status faktur**: Draft, Menunggu Pembayaran, Lunas, Jatuh Tempo
- **Ekspor PDF** presisi A4 tanpa watermark — siap cetak langsung

#### Engine Ink-Saver
- Template berbasis latar putih yang menghemat toner printer hingga 70%
- Perbandingan visual biaya tinta di landing page

#### Pembayaran QRIS
- Sisipkan barcode QRIS statis langsung ke dalam faktur
- Auto-cropper untuk menyesuaikan proporsi gambar QRIS

#### Multi-Profil Usaha
- Kelola banyak identitas bisnis dalam satu akun
- Saklar profil 1-klik
- Data klien, katalog, dan histori terpisah per profil

#### Tanda Tangan Digital
- Canvas tanda tangan langsung di browser
- Upload gambar tanda tangan dari file
- Otomatis tersimpan per profil

#### Manajemen Bisnis
- **CRM Klien**: Simpan dan kelola data pelanggan tetap
- **Katalog Produk/Jasa**: Database item reusable
- **Histori Faktur**: Riwayat lengkap semua invoice
- **Duplikasi Invoice**: Salin invoice lama untuk penagihan berulang

#### Admin Dashboard
- Ringkasan metrik (KPI) seluruh platform
- Manajemen User (CRUD): Tambah, edit, suspend, hapus pengguna
- Manajemen Invoice: Lihat, cari, filter, ekspor CSV
- Pengaturan sistem: Maintenance mode, Auto QRIS Engine, Ink-Saver default
- Akses terbatas untuk email admin (`99apps.id@gmail.com`, `support@99apps.id`)

#### UI & UX
- Landing page responsif dengan screenshot workspace asli
- Tema Gelap (Dark Mode) & Terang (Light Mode) dengan saklar
- Internasionalisasi: Bahasa Indonesia 🇮🇩 dan English 🇬🇧
- Kalkulator volume invoice interaktif
- FAQ section
- Anti-AI-slop design (tanpa emoji petir, roket, atau ikon AI)

#### Autentikasi
- Google OAuth 2.0 dengan verifikasi ID token di backend
- JWT dibatasi algoritma, issuer, audience, dan masa aktif 8 jam
- Persistensi token hanya selama sesi browser
- Validasi input API, rate limiting, CORS allowlist, dan security headers

### Tech Stack
- React 19 + TypeScript 6.0
- Vite 8.1
- Tailwind CSS 4.3
- Lucide React (icons)
- qrcode.react (QR code generation)
- canvas-confetti (animasi)
- OXLint (linting)
