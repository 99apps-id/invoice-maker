# Panduan Kontribusi — Tagih Dong

Terima kasih atas ketertarikan Anda untuk berkontribusi pada **Tagih Dong**! 🎉

Dokumen ini berisi panduan dan aturan yang perlu diikuti saat berkontribusi pada proyek ini.

---

## 📋 Daftar Isi

- [Kode Etik](#kode-etik)
- [Cara Berkontribusi](#cara-berkontribusi)
- [Setup Lingkungan Pengembangan](#setup-lingkungan-pengembangan)
- [Struktur Branch](#struktur-branch)
- [Konvensi Kode](#konvensi-kode)
- [Commit Message](#commit-message)
- [Pull Request](#pull-request)
- [Melaporkan Bug](#melaporkan-bug)
- [Mengusulkan Fitur](#mengusulkan-fitur)

---

## 🤝 Kode Etik

- Bersikap sopan, inklusif, dan menghargai semua kontributor
- Fokus pada kualitas kode dan pengalaman pengguna
- Berikan feedback yang konstruktif pada Pull Request orang lain

---

## 🚀 Cara Berkontribusi

### 1. Fork & Clone

```bash
# Fork repository via GitHub UI, lalu:
git clone https://github.com/<username-anda>/tagih-dong.git
cd tagih-dong
npm install
npm run dev
```

### 2. Buat Branch Baru

```bash
git checkout -b fitur/nama-fitur
# atau
git checkout -b fix/nama-bug
```

### 3. Kerjakan Perubahan

- Pastikan kode Anda mengikuti [konvensi kode](#konvensi-kode)
- Tambahkan terjemahan ID & EN jika ada string baru
- Pastikan `npm run build` berhasil tanpa error

### 4. Commit & Push

```bash
git add .
git commit -m "feat: tambah fitur keren"
git push origin fitur/nama-fitur
```

### 5. Buat Pull Request

- Buka repository asli di GitHub
- Klik "New Pull Request"
- Jelaskan perubahan yang Anda buat dengan detail

---

## 🛠️ Setup Lingkungan Pengembangan

### Prasyarat

| Tool | Versi Minimum |
|---|---|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |

### Instalasi

```bash
npm install
cp .env.example .env  # Opsional
npm run dev            # Buka http://localhost:5173
```

### Script yang Tersedia

| Script | Deskripsi |
|---|---|
| `npm run dev` | Development server dengan hot reload |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview build produksi lokal |
| `npm run lint` | Jalankan OXLint |

---

## 🌿 Struktur Branch

| Branch | Tujuan |
|---|---|
| `main` | Branch produksi stabil |
| `develop` | Branch pengembangan aktif |
| `fitur/*` | Branch fitur baru |
| `fix/*` | Branch perbaikan bug |
| `docs/*` | Branch dokumentasi |

---

## 📝 Konvensi Kode

### TypeScript

- Semua file baru **wajib** menggunakan TypeScript (`.tsx` / `.ts`)
- Definisikan tipe di `src/types/index.ts` untuk tipe yang digunakan di banyak komponen
- Gunakan `interface` untuk props komponen, `type` untuk union/alias

### React Components

- Gunakan **functional components** dengan hooks
- Penamaan komponen: **PascalCase** (`InvoiceForm.tsx`)
- Satu komponen utama per file
- Props interface dideklarasikan di atas komponen

### Styling

- Gunakan **Tailwind CSS utility classes**
- Hindari inline styles (`style={{}}`)
- Dukung Dark Mode dengan class `dark:` atau kondisi `isDark` eksplisit
- Gunakan variabel warna konsisten: `indigo`, `purple`, `emerald`, `slate`

### Internasionalisasi

- Semua string yang tampil ke pengguna **wajib** diterjemahkan
- Tambahkan key baru di **kedua** bahasa (`id` dan `en`) di `src/i18n/translations.ts`
- Gunakan `getTranslation(language)` untuk mengakses terjemahan

### File & Folder

```
src/components/
├── NamaFitur/           # Folder per domain fitur
│   ├── NamaKomponen.tsx # Komponen utama
│   └── SubKomponen.tsx  # Sub-komponen
```

---

## 💬 Commit Message

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipe>: <deskripsi singkat>

[body opsional]

[footer opsional]
```

### Tipe yang Digunakan

| Tipe | Deskripsi |
|---|---|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `docs` | Perubahan dokumentasi |
| `style` | Perubahan styling (tanpa mengubah logika) |
| `refactor` | Refaktor kode (tanpa menambah fitur atau fix bug) |
| `perf` | Peningkatan performa |
| `test` | Menambah atau memperbaiki test |
| `chore` | Maintenance (dependencies, config, dll.) |

### Contoh

```bash
feat: tambah fitur ekspor CSV di admin dashboard
fix: perbaiki kontras teks label di dark mode
docs: perbarui README dengan panduan instalasi
style: rapikan spacing di komponen Header
```

---

## 🔀 Pull Request

### Checklist Sebelum Submit PR

- [ ] `npm run build` berhasil tanpa error
- [ ] `npm run lint` tidak menampilkan warning kritis
- [ ] Terjemahan ID & EN ditambahkan untuk string baru
- [ ] Dark mode diuji dan terlihat kontras
- [ ] Tidak ada `console.log` yang tertinggal
- [ ] Deskripsi PR menjelaskan **apa** dan **mengapa**

### Template PR

```markdown
## Deskripsi

Jelaskan perubahan yang Anda buat.

## Tipe Perubahan

- [ ] Fitur baru
- [ ] Perbaikan bug
- [ ] Perubahan breaking
- [ ] Dokumentasi
- [ ] Refaktor

## Screenshot (jika ada)

Lampirkan screenshot sebelum & sesudah untuk perubahan UI.

## Checklist

- [ ] Build berhasil
- [ ] Lint clean
- [ ] Terjemahan lengkap
- [ ] Dark mode diuji
```

---

## 🐛 Melaporkan Bug

Gunakan [GitHub Issues](../../issues) dengan template berikut:

```markdown
## Deskripsi Bug

Jelaskan bug secara singkat.

## Langkah Reproduksi

1. Buka halaman '...'
2. Klik tombol '...'
3. Lihat error

## Perilaku yang Diharapkan

Jelaskan apa yang seharusnya terjadi.

## Screenshot

Lampirkan screenshot jika relevan.

## Lingkungan

- OS: [Windows / macOS / Linux]
- Browser: [Chrome / Firefox / Safari]
- Versi Node.js: [contoh: 20.x]
```

---

## 💡 Mengusulkan Fitur

Gunakan [GitHub Discussions](../../discussions) atau Issues dengan label `enhancement`:

```markdown
## Deskripsi Fitur

Jelaskan fitur yang diusulkan.

## Motivasi

Mengapa fitur ini dibutuhkan?

## Solusi yang Diusulkan

Bagaimana menurut Anda fitur ini sebaiknya diimplementasikan?

## Alternatif

Adakah pendekatan alternatif yang sudah dipertimbangkan?
```

---

## 📄 Lisensi

Dengan berkontribusi pada Tagih Dong, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah [MIT License](./LICENSE).

---

Terima kasih telah membantu menjadikan **Tagih Dong** lebih baik! 🙏
