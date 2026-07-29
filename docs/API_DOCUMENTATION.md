# 📡 Spesifikasi REST API Server Tagih Dong

Dokumen ini berisi spesifikasi teknis lengkap untuk REST API Server aplikasi **Tagih Dong**. Backend dibangun menggunakan Node.js, Express.js, TypeScript, dan PostgreSQL.

---

## 🌐 Base URL & Konfigurasi

| Parameter | Nilai Development | Nilai Production |
|---|---|---|
| **Base URL** | `http://localhost:3001` | `https://api.tagihdong.id` (Contoh Domain) |
| **Content-Type** | `application/json` | `application/json` |
| **Payload Limit** | `10 MB` | `10 MB` |
| **Global Rate Limit** | 300 request / 15 menit per IP | 300 request / 15 menit per IP |
| **Auth Rate Limit** | 30 request / 15 menit per IP | 30 request / 15 menit per IP |

---

## 🔑 Autentikasi & Keamanan (JWT & Bearer Token)

Sebagian besar endpoint memerlukan token **JWT (JSON Web Token)** di header HTTP request:

```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

Sesi JWT berlaku selama **7 hari** sejak diterbitkan melalui endpoint `/api/auth/google`.

---

## 🏥 Health Check Endpoint

### `GET /api/health`
Mengecek status kesehatan server API dan koneksi basis data PostgreSQL.

- **Header**: Tidak memerlukan autentikasi.
- **Response Sukses (200 OK)**:
```json
{
  "status": "ok",
  "service": "Tagih Dong PostgreSQL API Server",
  "database": "connected",
  "timestamp": "2026-07-29T15:00:00.000Z"
}
```

---

## 🔐 Endpoint Autentikasi (`/api/auth`)

### `POST /api/auth/google`
Verifikasi kredensial Google OAuth 2.0, pendaftaran otomatis user baru, pembuatan profil bisnis default, serta penerbitan token JWT.

- **Request Body**:
```json
{
  "credential": "GOOGLE_ID_TOKEN_STRING",
  "userInfo": {
    "sub": "109876543210987654321",
    "email": "user@example.com",
    "name": "Budi Santoso",
    "picture": "https://lh3.googleusercontent.com/a/..."
  }
}
```

- **Response Sukses (200 OK)**:
```json
{
  "success": true,
  "isNewUser": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "email": "user@example.com",
    "name": "Budi Santoso",
    "picture": "https://lh3.googleusercontent.com/a/...",
    "role": "user"
  },
  "profiles": [
    {
      "id": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
      "user_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "name": "Budi Santoso Studio",
      "is_default": true
    }
  ]
}
```

### `GET /api/auth/me`
Mengambil informasi pengguna yang sedang login dan daftar profil bisnis miliknya.

- **Header**: `Authorization: Bearer <JWT>`
- **Response Sukses (200 OK)**:
```json
{
  "user": {
    "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "email": "user@example.com",
    "name": "Budi Santoso",
    "picture": "https://...",
    "role": "user"
  },
  "profiles": [...]
}
```

### `PUT /api/auth/me`
Memperbarui nama dan foto profil pengguna.

- **Header**: `Authorization: Bearer <JWT>`
- **Request Body**:
```json
{
  "name": "Budi Santoso (Updated)",
  "picture": "https://..."
}
```

---

## 🧾 Endpoint Invoice (`/api/invoices`)

Semua endpoint invoice membutuhkan token JWT.

### `GET /api/invoices`
Mengambil semua daftar invoice milik pengguna terautentikasi (diurutkan dari yang terbaru).

- **Header**: `Authorization: Bearer <JWT>`
- **Response Sukses (200 OK)**:
```json
[
  {
    "id": "inv-2026-001",
    "profileId": "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    "number": "INV/2026/07/001",
    "issueDate": "2026-07-29",
    "dueDate": "2026-08-12",
    "poNumber": "PO-9921",
    "status": "pending",
    "language": "id",
    "currency": "IDR",
    "issuer": { "name": "Budi Studio", "email": "info@budi.id" },
    "client": { "name": "PT Jaya Abadi", "email": "finance@jayaabadi.co.id" },
    "taxName": "PPN",
    "shippingFee": 25000,
    "notes": "Terima kasih atas kerja samanya.",
    "paymentTerms": "Pembayaran via Transfer BCA / QRIS.",
    "theme": { "id": "modern", "primaryColor": "#06B6D4" },
    "items": [
      {
        "id": "item-1",
        "name": "Desain Maskot & Branding",
        "description": "2 Konsep awal + Revisi 3x",
        "quantity": 1,
        "unitPrice": 1500000,
        "unit": "paket",
        "taxRate": 11,
        "discount": 0,
        "discountType": "percent"
      }
    ]
  }
]
```

### `POST /api/invoices`
Membuat invoice baru atau memperbarui invoice yang sudah ada (*Upsert*).

- **Header**: `Authorization: Bearer <JWT>`
- **Request Body**: Sama seperti objek invoice tunggal pada contoh GET di atas.
- **Response Sukses (200 OK)**:
```json
{
  "success": true,
  "id": "inv-2026-001"
}
```

### `DELETE /api/invoices/:id`
Menghapus invoice berdasarkan ID.

- **Header**: `Authorization: Bearer <JWT>`
- **Response Sukses (200 OK)**:
```json
{ "success": true }
```

---

## 👥 Endpoint Klien CRM (`/api/clients`)

### `GET /api/clients`
Mengambil daftar klien pelanggan tetap milik pengguna.

### `POST /api/clients`
Membuat atau mengedit data klien.

### `DELETE /api/clients/:id`
Menghapus data klien dari CRM.

---

## 📦 Endpoint Katalog Produk & Jasa (`/api/catalog`)

### `GET /api/catalog`
Mengambil daftar item katalog (produk/jasa).

### `POST /api/catalog`
Menambah atau memperbarui item katalog.

### `DELETE /api/catalog/:id`
Menghapus item dari katalog.

---

## 🏢 Endpoint Profil Bisnis (`/api/profiles`)

### `GET /api/profiles`
Mengambil semua identitas usaha/profil bisnis pengguna.

### `POST /api/profiles`
Membuat profil usaha baru.

### `PUT /api/profiles/:id`
Memperbarui detail profil usaha (Nama usaha, Logo, QRIS URL, Rekening Bank, Tanda Tangan).

### `DELETE /api/profiles/:id`
Menghapus profil usaha.

---

## 🛑 Handling Error Status Code

| HTTP Code | Arti | Penyebab Umum |
|---|---|---|
| **400 Bad Request** | Request tidak valid | Format JSON salah atau payload wajib tidak diisi |
| **401 Unauthorized** | Tidak terautentikasi | Header `Authorization` kosong atau hilang |
| **403 Forbidden** | Terlarang / Akses Ditolak | Token kadaluarsa/invalid, atau bukan Super Admin |
| **404 Not Found** | Data tidak ditemukan | Resource ID tidak cocok di database |
| **429 Too Many Requests** | Rate Limit Terlampaui | Jumlah request melebihi batas (300 req / 15m) |
| **500 Internal Error** | Error Server | Masalah koneksi basis data atau exception internal |
