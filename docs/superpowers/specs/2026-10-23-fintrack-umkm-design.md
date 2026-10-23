# FinTrack UMKM Design Document

> **Spec source:** PRD.md  
> **Approach chosen:** MVP bertahap (phased MVP)  
> **Tech Stack:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS + Supabase (PostgreSQL, Auth, RLS) + Recharts + Zod + React Hook Form  
> **Target:** Web responsif / PWA  
> **Deploy:** Vercel

---

## 1. Intent & Why

Aplikasi pencatatan keuangan sederhana untuk pekerja lepas dan UMKM Indonesia. Fokus: **transaksi harian → kategori → dashboard ringkas → saldo real-time → laporan bulanan (PDF/CSV)**. Menggunakan Supabase menghilangkan perlu mengelola server auth/database sendiri, Vercel menghilangkan infra deploy. RLS (Row Level Security) memastikan isolasi data per user tanpa logika aplikasi tambahan.

---

## 2. Goals, Non-Goals, Anti-Goals

| Goals | Non-Goals | Anti-Goals |
|-------|-----------|------------|
| Pencatatan transaksi cepat (date, amount, desc, category) | Multi-user/team/role (ditunda) | Menggantikan akuntansi penuh (Jurnal, Neraca) |
| Dashboard: income, expense, net profit, grafik bulanan | Integrasi QuickBooks/Xero (ditunda) | Fitur investasi/portofolio saham |
| Kategori bawaan + custom kategori | Notifikasi push mobile (PWA push nanti) | Double-entry bookkeeping |
| Recurring transaction (bulanan) | Multi-currency (hanya IDR dulu) | Auto-categorization ML |
| Alert saldo minimum (threshold user) | Offline-first full (PWA cache read-only dulu) | Anggaran per kategori (ditunda) |
| Laporan bulanan PDF & CSV | Audit trail / changelog transaksi | Pajak otomatis |
| PWA installable, responsive mobile-first | Dark mode (bisa ditambah nanti) | - |

---

## 3. Constraints

| Constraint | Value |
|------------|-------|
| Framework | Next.js 14+ App Router |
| Language | TypeScript strict |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (email/password) |
| Security | RLS wajib semua tabel user-owned |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Validation | Zod schema (shared client/server) |
| Currency | IDR, locale `id-ID`, timezone `Asia/Jakarta` |
| Performance | Dashboard load < 3s, 10k transaksi lancar |
| PWA | Manifest + service worker (Workbox/next-pwa) |
| Testing | Vitest (unit kalkulasi), Playwright (E2E kritis) |
| Deploy | Vercel (auto dari main branch) |

---

## 4. Approaches Considered

| Approach | Trade-off | Decision |
|----------|-----------|----------|
| MVP bertahap (dipilih) | Validasi cepat, risiko rendah, feedback user nyata | ✅ |
| Semua fitur sekaligus | Time-to-market panjang, bug tersembunyi, scope creep | ❌ |
| Financial core dulu | Data stabil tapi UX kurang lengkap, dashboard ditunda | ❌ |

---

## 5. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js (Vercel)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  App Router  │  │ Server Actions│  │  API Routes      │  │
│  │  (RSC + Client)│  │ (mutations)  │  │ (webhooks, cron) │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │            │
│         ▼                 ▼                    ▼            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Supabase Client (browser & server)       │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                 │                    │            │
│         ▼                 ▼                    ▼            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Auth       │  │  PostgreSQL  │  │   Storage        │  │
│  │ (email/pass) │  │  + RLS       │  │  (PDF export)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Data flow:**
- **Read:** RSC memanggil Supabase langsung (dengan SSR/ISR) → render dashboard, laporan.
- **Write:** Client components → Server Actions → Supabase (RLS enforce) → revalidate path.
- **Auth:** Supabase Auth cookies (SSR-safe via `@supabase/ssr`).
- **Cron:** Vercel Cron → Supabase Edge Function / API route → cek recurring & low-balance alert.

---

## 6. Data Model (Supabase / PostgreSQL)

### `profiles` (extends `auth.users`)
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, FK → auth.users(id) |
| full_name | text | nullable |
| business_name | text | nullable |
| currency | text | default 'IDR' |
| timezone | text | default 'Asia/Jakarta' |
| low_balance_threshold | numeric | default 0, nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `categories`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → profiles(id), not null |
| name | text | not null |
| type | text | CHECK IN ('income','expense'), not null |
| icon | text | nullable (lucide icon name) |
| color | text | nullable (hex) |
| is_default | boolean | default false |
| created_at | timestamptz | default now() |

### `transactions`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → profiles(id), not null |
| category_id | uuid | FK → categories(id), nullable |
| date | date | not null |
| amount | numeric(18,2) | not null, CHECK > 0 |
| description | text | nullable |
| type | text | CHECK IN ('income','expense'), not null |
| is_recurring | boolean | default false |
| recurring_rule | jsonb | nullable (rrule string) |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### Indexes
- `transactions_user_id_date_idx` (user_id, date DESC)
- `transactions_user_id_category_id_idx` (user_id, category_id)
- `categories_user_id_type_idx` (user_id, type)

### RLS Policies (contoh)
```sql
-- profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- categories
CREATE POLICY "Users can CRUD own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);

-- transactions
CREATE POLICY "Users can CRUD own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);
```

---

## 7. Feature Phases

### Phase 1 — Core (MVP)
- [x] Auth: signup, login, logout, reset password
- [x] Profile: nama bisnis, threshold saldo minimum
- [x] Kategori: CRUD, default categories (income: Penjualan, Jasa, Lainnya; expense: Operasional, Marketing, Gaji, Sewa, Lainnya)
- [x] Transaksi: CRUD, validasi Zod, filter tanggal/kategori/type
- [x] Dashboard: ringkasan income/expense/net, chart bulanan (bar), pie kategori expense
- [x] Responsive layout, navigasi mobile-first

### Phase 2 — Recurring & Alerts
- [ ] Transaksi berulang: buat dengan `is_recurring=true`, `recurring_rule` (rrule: monthly)
- [ ] Cron harian (Vercel Cron) → generate transaksi recurring untuk hari ini
- [ ] Cek saldo real-time → jika < threshold → notifikasi in-app (toast + badge)
- [ ] Settings: atur threshold saldo minimum

### Phase 3 — Reports & PWA
- [ ] Laporan bulanan: filter bulan/tahun, tabel ringkas, grafik tren
- [ ] Export CSV (streaming response)
- [ ] Export PDF (@react-pdf/renderer: header, ringkasan, detail transaksi, footer)
- [ ] PWA: manifest, service worker, offline fallback (read-only cache dashboard)
- [ ] Install prompt, splash screen

---

## 8. UI/UX Key Decisions

| Area | Decision |
|------|----------|
| Layout | Sidebar collapsible (desktop), bottom nav (mobile < 640px) |
| Color | Primary: `#059669` (emerald-600), Expense: `#dc2626` (red-600), Income: `#16a34a` (green-600) |
| Typography | Inter (system font stack fallback) |
| Forms | Inline validation, toast feedback, keyboard-friendly |
| Currency input | `Intl.NumberFormat('id-ID', {style:'currency',currency:'IDR'})` display, raw number input |
| Date picker | Native `<input type="date">` + custom dropdown bulan/tahun untuk filter |
| Empty state | Ilustrasi sederhana + CTA "Tambah transaksi pertama" |
| Loading | Skeleton untuk dashboard, spinner untuk aksi mutasi |
| Error | Toast error + retry untuk network, inline untuk validasi |

---

## 9. Open Decisions (Builder Calls)

| Decision | Call | Reason |
|----------|------|--------|
| State management | React Context + Server Components (no global store) | Simple, RSC fetch sudah cukup |
| Date library | `date-fns` (lightweight, tree-shakable) | Hanya butuh format, addMonths, startOfMonth |
| PDF generation | `@react-pdf/renderer` (client-side) | Hindari serverless timeout, tidak butuh headless Chrome |
| CSV export | Native `ReadableStream` + `Response` | Zero dependency, streaming large dataset |
| Recurring engine | `rrule` library (RFC 5545) | Standar, handle edge case bulan pendek |
| Toast | `sonner` (lightweight, accessible) | Simple API, supports promise toast |
| Icons | `lucide-react` | Tree-shakable, konsisten |

---

## 10. What's Left to Builder

- Penamaan fungsi/internal variable (ikuti konvensi Next.js/TypeScript)
- Struktur folder detail (ikuti `app/(auth)/`, `app/(dashboard)/`, `components/`, `lib/`, `actions/`)
- Styling detail (spacing, radius, shadow) — ikuti Tailwind default, konsisten
- Error boundary placement
- Test coverage target (minimal kalkulasi saldo, filter, recurring logic)
- CI/CD: Vercel auto deploy, opsional GitHub Actions untuk typecheck+test

---

**Approval:** User approved phased MVP approach on 2026-10-23. Next step: invoke `superpowers:writing-plans` for implementation plan.