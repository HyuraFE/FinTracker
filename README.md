# FinTrack UMKM

Aplikasi web responsif untuk pencatatan keuangan pekerja lepas dan UMKM Indonesia.

## Fitur Core MVP

- Autentikasi email/password via Supabase Auth
- Pencatatan transaksi pemasukan/pengeluaran
- Kategori bawaan dan kategori custom
- Filter transaksi berdasarkan periode, tipe, dan kategori
- Dashboard saldo, pemasukan, pengeluaran, net profit, grafik arus kas, dan distribusi pengeluaran
- Isolasi data per pengguna menggunakan Supabase Row Level Security

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase PostgreSQL + Auth + RLS
- Recharts
- Zod
- Vercel

## Setup lokal

### 1. Siapkan project Supabase

1. Buat project di [Supabase](https://supabase.com).
2. Buka **SQL Editor**, jalankan isi file:

   ```sql
   supabase/migrations/20261023000000_init_fintrack.sql
   ```

3. Dari **Project Settings → API**, salin Project URL dan anon key.
4. Pada **Authentication → URL Configuration**, tambahkan:
   - `http://localhost:3000`
   - URL deployment Vercel setelah tersedia.

### 2. Konfigurasi environment

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

`SUPABASE_SERVICE_ROLE_KEY` tidak dibutuhkan untuk Core MVP. Jangan pernah expose service role key ke browser atau variable `NEXT_PUBLIC_*`.

### 3. Install dan jalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Verifikasi

```bash
npm test
npm run build
```

## Deploy ke Vercel

1. Push project ke GitHub/GitLab/Bitbucket.
2. Import repository dari [Vercel](https://vercel.com/new).
3. Tambahkan Environment Variables untuk `Production`, `Preview`, dan `Development`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. Tambahkan URL Vercel pada Supabase **Authentication → URL Configuration**.

Vercel mendeteksi Next.js otomatis. Build command: `npm run build`.

## Catatan keamanan

- Semua tabel user-owned mengaktifkan RLS.
- Server Actions mengambil user dari Supabase session, bukan dari input browser.
- Transaksi memakai nominal positif; tipe income/expense menentukan arus dana.
- Jangan lewati atau nonaktifkan RLS di production.
