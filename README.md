<div align="center">

# 🧾 Tagih Dong

### Pembuat Invoice Bisnis Profesional — 100% Gratis

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Tagih Dong** adalah aplikasi web pembuat invoice bisnis profesional yang dirancang khusus untuk **UMKM**, **toko retail**, dan **freelancer** di Indonesia. Dibuat dengan fokus pada **kecepatan**, **hemat tinta printer**, dan **kemudahan penggunaan**.

[Lihat Demo](#demo) · [Mulai Menggunakan](#mulai-cepat) · [Fitur Lengkap](#fitur-utama) · [Dokumentasi Lengkap](#-dokumentasi-lengkap) · [Kontribusi](#kontribusi)

</div>

---

## 📚 Dokumentasi Lengkap

Untuk dokumentasi yang lebih mendalam, silakan lihat berkas panduan spesifik berikut:

- 🏗️ **[Arsitektur Sistem](./docs/ARCHITECTURE.md)** — Arsitektur hybrid client-first, hirarki komponen React, state management, dan Ink-Saver Engine.
- 📡 **[Spesifikasi REST API](./docs/API_DOCUMENTATION.md)** — Dokumentasi endpoint Express.js, autentikasi JWT & Google OAuth, serta format payload.
- 🗄️ **[Skema Basis Data PostgreSQL](./docs/DATABASE_SCHEMA.md)** — ERD, struktur tabel multi-tenant (`users`, `user_profiles`, `clients`, `catalog_items`, `invoices`), dan indeks performa.
- 📖 **[Panduan Pengguna](./docs/USER_GUIDE.md)** — Petunjuk langkah demi langkah pembuatan invoice, QRIS statis, tanda tangan digital, cetak A4, dan Admin Dashboard.
- 💻 **[Panduan Pengembangan & Deployment](./docs/DEVELOPMENT_AND_DEPLOYMENT.md)** — Prasyarat, setup environment lokal, linter OXLint, serta penggelaran ke Vercel / Nginx / PM2.


---

## 📸 Screenshot

| Landing Page (Light) | Workspace Editor (Light) | Admin Dashboard |
|:---:|:---:|:---:|
| Landing page responsif dengan demo interaktif | Editor invoice real-time dengan live preview A4 | Dashboard admin untuk manajemen user & invoice |

---

## ✨ Fitur Utama

### 🧾 Pembuatan Invoice
- **Editor visual real-time** dengan pratinjau langsung (*live preview*) format A4
- **23+ template profesional** termasuk Modern, Corporate, Swiss Grid, Luxury Gold Leaf, dll.
- **Nomor invoice otomatis** dengan format kustom (INV/YYYY/MM/NNN)
- **Multi-mata uang**: IDR, USD, EUR, SGD, GBP, AUD, JPY
- **Kalkulasi otomatis**: Subtotal, PPN/Pajak, diskon (persen & nominal), biaya kirim
- **Status invoice**: Draft, Menunggu Pembayaran, Lunas, Jatuh Tempo
- **Ekspor PDF** presisi A4 tanpa watermark — siap cetak langsung

### 🖨️ Engine Kertas Ramah Tinta (Ink-Saver)
- Template bersih berbasis **latar putih** yang menghemat toner printer hingga **70%**
- Optimasi khusus untuk pencetakan dokumen fisik di UMKM & toko retail

### 📱 Pembayaran QRIS Instan
- Sisipkan **barcode QRIS statis** bisnis Anda langsung ke dalam invoice
- Klien cukup scan dari GoPay, BCA Mobile, OVO, ShopeePay, atau e-Wallet lainnya
- Auto-cropper untuk menyesuaikan proporsi gambar QRIS yang diunggah

### 👥 Multi-Profil Usaha
- Kelola **banyak identitas bisnis** dalam satu akun
- Saklar profil 1-klik tanpa perlu membuat akun terpisah
- Setiap profil memiliki data klien, katalog, dan histori tersendiri

### ✍️ Tanda Tangan Digital
- Canvas tanda tangan langsung di browser
- Upload gambar tanda tangan dari file
- Otomatis tersimpan per profil usaha

### 📊 Manajemen Bisnis
- **CRM Klien**: Simpan dan kelola data pelanggan tetap
- **Katalog Produk/Jasa**: Database item yang bisa di-reuse ke invoice baru
- **Riwayat Invoice**: Riwayat lengkap semua invoice yang pernah dibuat
- **Duplikasi Invoice**: Salin invoice lama untuk penagihan berulang

### 🛡️ Admin Dashboard (Super Admin)
- **Ringkasan metrik**: Total user, total invoice, omzet tagihan, profil aktif
- **Manajemen User (CRUD)**: Tambah, edit, suspend, dan hapus pengguna
- **Manajemen Invoice**: Lihat, cari, filter, dan ekspor CSV seluruh invoice
- **Pengaturan sistem**: Maintenance mode, Auto QRIS Engine, Ink-Saver default
- **Akses terbatas** hanya untuk email admin yang terdaftar

### 🌐 Internasionalisasi
- Bahasa Indonesia 🇮🇩 dan English 🇬🇧
- Saklar bahasa instan tanpa reload halaman

### 🎨 Tema Gelap & Terang
- Mode Gelap (*Dark Mode*) dan Terang (*Light Mode*)
- Saklar tema di header, tersinkronisasi antara Landing Page dan Workspace
- Persisten via `localStorage`

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend Framework** | React 19 + TypeScript 6.0 |
| **Build Tool** | Vite 8.1 |
| **Styling** | Tailwind CSS 4.3 |
| **Icons** | Lucide React |
| **QR Code** | qrcode.react |
| **Animations** | canvas-confetti |
| **Linting** | OXLint |
| **Auth** | Google OAuth 2.0 (client-side) |

---

## 🚀 Mulai Cepat

### Prasyarat

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/99apps-id/invoice-maker.git
cd tagih-dong

# 2. Install dependencies
npm install

# 3. Salin file environment (opsional, untuk Google OAuth)
cp .env.example .env

# 4. Jalankan development server
npm run dev
```

Buka browser di `http://localhost:5173` — selesai! 🎉

### Build Produksi

```bash
# Build untuk production
npm run build

# Preview hasil build
npm run preview
```

---

## 📁 Struktur Proyek

```
tagih-dong/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── Auth/               # Google login modal, user settings
│   │   ├── Catalog/            # Katalog produk/jasa (ItemCatalogManager)
│   │   ├── Clients/            # CRM klien (ClientManager)
│   │   ├── Dashboard/          # Histori invoice (InvoiceList)
│   │   ├── InvoiceEditor/      # Form editor invoice (InvoiceForm)
│   │   ├── InvoicePreview/     # Live preview & cetak (InvoicePaper, SignatureCanvas)
│   │   ├── Profiles/           # Profil multi-usaha (ProfileManager)
│   │   ├── SaaS/               # Landing page, Admin dashboard, Pricing, Support
│   │   ├── UI/                 # Komponen UI reusable
│   │   ├── Header.tsx          # Header utama workspace
│   │   └── Navigation.tsx      # Tab navigasi workspace
│   ├── constants/
│   │   └── templates.ts        # Definisi 23+ template invoice
│   ├── context/
│   │   └── AuthContext.tsx      # Auth provider (Google OAuth + Demo Mode)
│   ├── i18n/
│   │   └── translations.ts     # Terjemahan ID/EN
│   ├── styles/                 # Style tambahan
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   ├── formatters.ts       # Format angka, tanggal, nomor invoice
│   │   └── storage.ts          # LocalStorage persistence layer
│   ├── App.tsx                 # Root application component
│   ├── index.css               # Global CSS + Tailwind v4 config
│   └── main.tsx                # Entry point
├── server/                     # Backend API (opsional)
├── .env.example                # Template environment variables
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite configuration
└── README.md                   # Dokumentasi ini
```

---

## ⚙️ Environment Variables

Salin `.env.example` menjadi `.env` dan sesuaikan:

```env
# Google OAuth Client ID (untuk login via Google)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Backend API URL (opsional, untuk persistensi server-side)
VITE_API_URL=http://localhost:3001
```

> **Catatan:** Aplikasi dapat berjalan sepenuhnya di mode *client-side* tanpa backend. Semua data disimpan di `localStorage` browser pengguna.

---

## 🔐 Admin Access

Halaman Admin Dashboard hanya dapat diakses oleh pengguna dengan email berikut:

| Email | Role |
|---|---|
| `99apps.id@gmail.com` | Super Admin |
| `support@99apps.id` | Super Admin |

Admin memiliki akses ke:
- **Ringkasan Metrik** — KPI overview seluruh platform
- **Manajemen User** — CRUD pengguna (tambah, edit, suspend, hapus)
- **Manajemen Invoice** — Lihat, filter, dan ekspor CSV seluruh invoice dari semua user
- **Pengaturan Sistem** — Maintenance mode, auto QRIS engine, ink-saver default

---

## 📋 NPM Scripts

| Script | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan development server (hot reload) |
| `npm run build` | Build TypeScript + Vite untuk produksi |
| `npm run preview` | Preview hasil build produksi secara lokal |
| `npm run lint` | Jalankan OXLint untuk cek kualitas kode |

---

## 🤝 Kontribusi

Kontribusi sangat dihargai! Silakan ikuti langkah berikut:

1. **Fork** repository ini
2. Buat **branch fitur baru** (`git checkout -b fitur/fitur-keren`)
3. **Commit** perubahan Anda (`git commit -m 'Tambah fitur keren'`)
4. **Push** ke branch (`git push origin fitur/fitur-keren`)
5. Buat **Pull Request**

### Panduan Kontribusi

- Gunakan **TypeScript** untuk semua file baru
- Ikuti konvensi penamaan komponen yang sudah ada (PascalCase)
- Pastikan `npm run build` berhasil tanpa error sebelum membuat PR
- Tambahkan terjemahan ID & EN untuk setiap string baru di `translations.ts`
- Gunakan Tailwind CSS utility classes, hindari inline styles

---

## 📜 Changelog

Lihat [CHANGELOG.md](./CHANGELOG.md) untuk riwayat lengkap perubahan.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — lihat file [LICENSE](./LICENSE) untuk detail.

---

## 💖 Dukung Pengembang

Jika Tagih Dong membantu bisnis Anda, pertimbangkan untuk mendukung pengembang:

- ⭐ **Star** repository ini di GitHub
- 🐛 **Laporkan bug** melalui GitHub Issues
- 💡 **Usulkan fitur** baru melalui GitHub Discussions
- ☕ **Donasi** melalui tombol "Support Me!" di dalam aplikasi

---

<div align="center">

**Dibuat dengan ❤️ oleh [99apps.id](https://99apps.id)**

© 2026 Tagih Dong. Hak Cipta Dilindungi Undang-Undang.

</div>
