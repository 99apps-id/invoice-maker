# 💻 Panduan Pengembangan & Penggelaran (Development & Deployment)

Dokumen ini memberikan petunjuk teknis lengkap bagi pengembang (*developer*) dan pengelola sistem (*system administrator*) untuk menyiapkan lingkungan pengembangan lokal, menjalankan pengujian kode, serta melakukan penggelaran (*deployment*) ke server produksi.

---

## 🛠️ Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terpasang perangkat lunak berikut:

| Perangkat Lunak | Versi Minimal | Keterangan |
|---|---|---|
| **Node.js** | `v18.x` atau lebih baru | Runtime JavaScript/TypeScript |
| **npm** | `v9.x` atau lebih baru | Package manager |
| **Git** | `v2.x` | Version control system |
| **PostgreSQL** (Opsional) | `v15.x` atau lebih baru | Wajib jika ingin menjalankan Backend REST API Server |

---

## 🚀 Setup Lingkungan Pengembangan Lokal

### 1. Clone Repository & Install Dependencies

```bash
# Clone repository dari GitHub
git clone https://github.com/99apps-id/invoice-maker.git
cd invoice-maker

# Install dependensi Frontend
npm install

# Install dependensi Backend (jika menggunakan server backend)
cd server
npm install
cd ..
```

---

## ⚙️ Konfigurasi Variabel Lingkungan (`.env`)

Salin file `.env.example` menjadi `.env` di direktori akar proyek:

```bash
cp .env.example .env
```

Sesuaikan isi file `.env`:

```env
# ========================================================
# FRONTEND CONFIGURATION (Vite)
# ========================================================

# Client ID Google OAuth 2.0 (Dapatkan dari Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# URL Endpoint Backend API Server
VITE_API_URL=http://localhost:3001

# ========================================================
# BACKEND API SERVER CONFIGURATION
# ========================================================

# Port Jalur Server Node.js
PORT=3001

# Node Environment
NODE_ENV=development

# Kunci Rahasia JWT (Wajib diisi dengan string acak yang kuat)
JWT_SECRET=super-secret-jwt-key-tagih-dong-2026-indonesia

# Kebijakan Origin CORS (Dipisahkan koma)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Koneksi Database PostgreSQL
PGHOST=localhost
PGPORT=5432
PGDATABASE=tagihdong_db
PGUSER=postgres
PGPASSWORD=your-postgres-password

# Konfigurasi SMTP Email (Nodemailer Transactional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=support@99apps.id
SMTP_PASS=your-app-password
EMAIL_FROM="Tagih Dong <support@99apps.id>"
```

---

## 📜 Perintah NPM (NPM Scripts)

### Frontend Workspace Scripts (Di Root Project)

```bash
# Menjalankan Vite Development Server (Hot Reload)
npm run dev

# Kompilasi TypeScript & Build Aset Produksi Vite
npm run build

# Menjalankan OXLint untuk mengecek kualitas dan potensi bug kode
npm run lint

# Menjalankan server preview lokal untuk hasil build produksi
npm run preview
```

### Backend Server Scripts (Di Direktori `server/`)

```bash
cd server

# Menjalankan server backend dengan TSX (Development Mode)
npm run dev

# Menjalankan server backend dengan Node.js (Production Mode)
npm start
```

---

## 🔍 Kualitas Kode & Linting (OXLint)

Tagih Dong menggunakan **OXLint** untuk memastikan kualitas kode JavaScript/TypeScript yang cepat dan efisien.

```bash
# Cek linting di seluruh file proyek
npm run lint
```

Aturan linter dikonfigurasi pada file [.oxlintrc.json](file:///c:/Project/invoice-maker/.oxlintrc.json).

---

## 🌐 Panduan Deployment Produksi

### A. Deployment Frontend (Vercel / Netlify / Cloudflare Pages)

Aplikasi frontend Tagih Dong bersifat *Single Page Application (SPA)* berbasis Vite.

1. **Vercel / Netlify Setup**:
   - Hubungkan repository GitHub ke platform Vercel/Netlify.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Tambahkan `VITE_GOOGLE_CLIENT_ID` dan `VITE_API_URL`.

2. **Nginx Web Server Setup (VPS Self-Hosted)**:
   File konfigurasi Nginx untuk SPA React:
   ```nginx
   server {
       listen 80;
       server_name tagihdong.id www.tagihdong.id;
       root /var/www/tagih-dong/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass http://127.0.0.1:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

### B. Deployment Backend REST API Server (Node.js + PM2)

1. Pastikan database PostgreSQL di server sudah dibuat:
   ```bash
   createdb tagihdong_db
   ```
2. Jalankan skema basis data dari file [schema.sql](file:///c:/Project/invoice-maker/server/schema.sql):
   ```bash
   psql -U postgres -d tagihdong_db -f server/schema.sql
   ```
3. Guanakan **PM2** untuk memantau proses server Express:
   ```bash
   npm install -g pm2
   cd server
   pm2 start index.ts --name "tagihdong-api" --interpreter ./node_modules/.bin/tsx
   pm2 save
   pm2 startup
   ```

---

## 🛡️ Checklist Keamanan Produksi

- [x] Ganti `JWT_SECRET` dengan string acak berpanjang minimal 32 karakter di server produksi.
- [x] Pastikan `ALLOWED_ORIGINS` hanya berisi domain resmi frontend (misal: `https://tagihdong.id`).
- [x] Pasang SSL Certificate (HTTPS) menggunakan Let's Encrypt / Certbot.
- [x] Batasi port PostgreSQL (5432) agar tidak terbuka untuk akses publik luar (`bind 127.0.0.1`).
