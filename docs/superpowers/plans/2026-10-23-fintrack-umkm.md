# FinTrack UMKM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web keuangan UMKM (FinTrack) berbasis Next.js App Router dan Supabase dengan fitur autentikasi, transaksi harian, kategori, dashboard finansial ringkas, dan mobile-first layout.

**Architecture:** Menggunakan Next.js App Router (React Server Components) untuk fetching data langsung dari Supabase PostgreSQL dengan proteksi Row Level Security (RLS). Server Actions digunakan untuk seluruh mutasi data dengan validasi schema Zod bersama di client dan server. Perhitungan finansial diisolasi dalam pure utility functions teruji unit test (Vitest) sebelum dikonsumsi oleh dashboard dan visualisasi Recharts.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Recharts, Zod, React Hook Form, Lucide React, Sonner, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-23-fintrack-umkm-design.md`

## Global Constraints

- Runtime & Framework: Next.js 14+ App Router, Node.js 18+
- Language: TypeScript strict mode (`strict: true` di `tsconfig.json`)
- Styling: Tailwind CSS mobile-first (breakpoint default: `sm: 640px`, `md: 768px`, `lg: 1024px`)
- Database: Supabase PostgreSQL dengan RLS di semua tabel
- Currency & Locale: Rupiah (`IDR`), locale `id-ID`, timezone default `Asia/Jakarta`
- Testing: Vitest untuk unit test pure functions kalkulasi finansial
- Deploy Target: Vercel

## Review Focus

1. **Format angka negatif atau nol pada input transaksi:** Input nominal harus menolak angka <= 0 atau string non-numerik sebelum sampai database (harus ditolak Zod schema dengan pesan ramah).
2. **Kalkulasi net profit dengan campuran income dan expense:** Pengurangan tidak boleh mengalami floating-point precision error (contoh: `0.1 + 0.2 = 0.30000000000000004`), gunakan konversi integer cents/sen atau pembulatan 2 desimal standar.
3. **Filter rentang tanggal transaksi:** Transaksi pada batas tanggal (awal hari 00:00:00 dan akhir hari 23:59:59 zona lokal) harus terhitung secara akurat tanpa pergeseran UTC.
4. **Hapus kategori yang masih memiliki transaksi terkait:** Foreign key cascade atau set null harus ditangani secara eksplisit agar tidak menyebabkan runtime crash pada UI transaksi.
5. **Akses data antar user (RLS isolation):** User A tidak boleh dapat membaca atau mengubah transaksi milik User B meskipun memanggil Server Action dengan ID transaksi milik User B.

---

### Task 1: Project Scaffolding & Setup Environment

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `next.config.js`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `.env.example`
- Create: `tests/setup.test.ts`

**Interfaces:**
- Produces: Project build runnable via `npm run build` and tests runnable via `npm run test`.

- [ ] **Step 1: Write initial test checking environment and test runner**

```typescript
// tests/setup.test.ts
import { describe, it, expect } from 'vitest';

describe('Environment Setup', () => {
  it('runs vitest correctly', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify test runner configuration works**

Run: `npx vitest run tests/setup.test.ts`
Expected: PASS or missing config if not yet set up.

- [ ] **Step 3: Setup Next.js, TypeScript, Tailwind CSS, and Vitest**

Inisialisasi `package.json`, install dependensi (`next`, `react`, `react-dom`, `typescript`, `@types/react`, `@types/node`, `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `zod`, `lucide-react`, `sonner`, `@supabase/supabase-js`, `@supabase/ssr`), buat config files (`tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `next.config.js`, `vitest.config.ts`, `.env.example`).

- [ ] **Step 4: Run test and typecheck to verify passes**

Run: `npx vitest run tests/setup.test.ts && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: initialize nextjs project with typescript, tailwind, and vitest"
```

---

### Task 2: Pure Financial Calculation Logic (TDD)

**Files:**
- Create: `src/lib/financial.ts`
- Create: `src/types/finance.ts`
- Test: `tests/financial.test.ts`

**Interfaces:**
- Produces:
  - `calculateBalance(transactions: TransactionSummary[]): { income: number; expense: number; netProfit: number }`
  - `groupTransactionsByMonth(transactions: TransactionSummary[]): MonthlyFinancialSummary[]`
  - `groupExpensesByCategory(transactions: TransactionSummary[]): CategoryExpenseSummary[]`
  - `formatIDR(amount: number): string`

- [ ] **Step 1: Write failing unit tests for financial calculations**

```typescript
// tests/financial.test.ts
import { describe, it, expect } from 'vitest';
import { calculateBalance, groupTransactionsByMonth, groupExpensesByCategory, formatIDR } from '../src/lib/financial';
import { TransactionSummary } from '../src/types/finance';

describe('Financial Calculations', () => {
  const sampleTransactions: TransactionSummary[] = [
    { id: '1', date: '2026-10-01', amount: 1500000, type: 'income', categoryName: 'Penjualan' },
    { id: '2', date: '2026-10-05', amount: 500000, type: 'expense', categoryName: 'Operasional' },
    { id: '3', date: '2026-10-10', amount: 200000, type: 'expense', categoryName: 'Marketing' },
    { id: '4', date: '2026-09-15', amount: 1000000, type: 'income', categoryName: 'Penjualan' },
  ];

  it('calculates total income, expense, and net profit correctly without floating point bugs', () => {
    const result = calculateBalance(sampleTransactions);
    expect(result.income).toBe(2500000);
    expect(result.expense).toBe(700000);
    expect(result.netProfit).toBe(1800000);
  });

  it('handles empty transaction list safely', () => {
    const result = calculateBalance([]);
    expect(result.income).toBe(0);
    expect(result.expense).toBe(0);
    expect(result.netProfit).toBe(0);
  });

  it('formats number to IDR currency correctly', () => {
    expect(formatIDR(1500000)).toMatch(/Rp\s?1\.500\.000/);
  });

  it('groups expenses by category accurately', () => {
    const expenses = groupExpensesByCategory(sampleTransactions);
    expect(expenses).toEqual([
      { categoryName: 'Operasional', total: 500000, percentage: 71.43 },
      { categoryName: 'Marketing', total: 200000, percentage: 28.57 }
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/financial.test.ts`
Expected: FAIL with "Cannot find module '../src/lib/financial'"

- [ ] **Step 3: Implement types and financial utility functions in `src/types/finance.ts` and `src/lib/financial.ts`**

Definisikan tipe `TransactionSummary`, `MonthlyFinancialSummary`, `CategoryExpenseSummary` pada `src/types/finance.ts`. Implementasikan fungsi kalkulasi di `src/lib/financial.ts` menggunakan pembulatan presisi desimal dan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/financial.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/finance.ts src/lib/financial.ts tests/financial.test.ts
git commit -m "feat: add financial calculation utilities with unit tests"
```

---

### Task 3: Database Schema & Supabase Client Setup

**Files:**
- Create: `supabase/migrations/20261023000000_init_fintrack.sql`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/middleware.ts`
- Test: `tests/schema-validation.test.ts`

**Interfaces:**
- Produces:
  - `createClient()` (browser client)
  - `createServerClient()` (server action & route client)
  - Database SQL schema matching design doc specs (profiles, categories, transactions, RLS).

- [ ] **Step 1: Write schema validation test (Zod schema checking data integrity)**

```typescript
// tests/schema-validation.test.ts
import { describe, it, expect } from 'vitest';
import { transactionSchema, categorySchema } from '../src/lib/validations/finance';

describe('Validation Schemas', () => {
  it('validates a valid transaction', () => {
    const validData = {
      date: '2026-10-23',
      amount: 50000,
      description: 'Beli kertas printer',
      type: 'expense' as const,
      category_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    const parsed = transactionSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it('rejects negative or zero amount', () => {
    const invalidZero = { date: '2026-10-23', amount: 0, type: 'expense' };
    const invalidNegative = { date: '2026-10-23', amount: -5000, type: 'expense' };
    expect(transactionSchema.safeParse(invalidZero).success).toBe(false);
    expect(transactionSchema.safeParse(invalidNegative).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/schema-validation.test.ts`
Expected: FAIL with "Cannot find module '../src/lib/validations/finance'"

- [ ] **Step 3: Implement validation schemas and Supabase setup files**

1. Tulis Zod schema di `src/lib/validations/finance.ts` (`transactionSchema`, `categorySchema`, `profileSchema`).
2. Tulis migrasi SQL lengkap di `supabase/migrations/20261023000000_init_fintrack.sql` (tabel `profiles`, `categories`, `transactions`, RLS policies, trigger auto-create profile saat signup, default categories).
3. Buat helper Supabase SSR di `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, dan `src/middleware.ts` untuk proteksi rute auth/dashboard.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/schema-validation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/ src/lib/supabase/ src/lib/validations/ src/middleware.ts tests/schema-validation.test.ts
git commit -m "feat: add supabase migration sql, auth middleware, and zod validation schemas"
```

---

### Task 4: Authentication & User Profile Module

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/app/(auth)/auth-form.tsx`
- Create: `src/app/actions/auth.ts`
- Create: `src/components/navbar.tsx`

**Interfaces:**
- Consumes: `src/lib/supabase/server.ts`
- Produces: Server actions `login(formData)`, `signup(formData)`, `logout()`

- [ ] **Step 1: Write unit test for auth form validation inputs**

```typescript
// tests/auth-validation.test.ts
import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../src/lib/validations/auth';

describe('Auth Validation Schemas', () => {
  it('validates email and password requirements', () => {
    expect(loginSchema.safeParse({ email: 'user@example.com', password: 'password123' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'invalid-email', password: '123' }).success).toBe(false);
  });

  it('requires business name on register', () => {
    const valid = { email: 'user@example.com', password: 'password123', businessName: 'Toko Makmur' };
    expect(registerSchema.safeParse(valid).success).toBe(true);
    const missingName = { email: 'user@example.com', password: 'password123', businessName: '' };
    expect(registerSchema.safeParse(missingName).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/auth-validation.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement auth validation, Server Actions, and UI pages**

1. Buat `src/lib/validations/auth.ts`.
2. Buat `src/app/actions/auth.ts` dengan Server Actions: `signInWithPassword`, `signUp` (termasuk simpan metadata nama bisnis), `signOut`.
3. Buat UI halaman Login dan Register yang responsif dan mobile-friendly dengan error handling menggunakan Sonner toast.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/auth-validation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/validations/auth.ts src/app/actions/auth.ts src/app/\(auth\)/ tests/auth-validation.test.ts
git commit -m "feat: implement authentication flow and pages"
```

---

### Task 5: Categories Management Module

**Files:**
- Create: `src/app/actions/categories.ts`
- Create: `src/app/(dashboard)/categories/page.tsx`
- Create: `src/components/categories/category-list.tsx`
- Create: `src/components/categories/category-modal.tsx`
- Test: `tests/categories.test.ts`

**Interfaces:**
- Consumes: `src/lib/supabase/server.ts`, `src/lib/validations/finance.ts`
- Produces: Server actions `getCategories()`, `createCategory(data)`, `deleteCategory(id)`

- [ ] **Step 1: Write mock test for category creation logic and type constraints**

```typescript
// tests/categories.test.ts
import { describe, it, expect } from 'vitest';
import { categorySchema } from '../src/lib/validations/finance';

describe('Category Validation', () => {
  it('allows valid category payload with income or expense type', () => {
    expect(categorySchema.safeParse({ name: 'Jasa Desain', type: 'income' }).success).toBe(true);
    expect(categorySchema.safeParse({ name: 'Bahan Baku', type: 'expense' }).success).toBe(true);
  });

  it('rejects invalid type or empty name', () => {
    expect(categorySchema.safeParse({ name: '', type: 'expense' }).success).toBe(false);
    expect(categorySchema.safeParse({ name: 'Valid', type: 'other' }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it passes/fails appropriately**

Run: `npx vitest run tests/categories.test.ts`
Expected: PASS (menggunakan schema dari Task 3).

- [ ] **Step 3: Implement Category Server Actions and UI**

1. Buat `src/app/actions/categories.ts` (`getCategories`, `createCategory`, `deleteCategory`).
2. Buat `CategoryList` dan modal tambah/edit kategori dengan pilihan icon/warna dan pemisahan tab Income vs Expense.
3. Handle error ketika user mencoba menghapus kategori default atau yang sedang digunakan.

- [ ] **Step 4: Typecheck and verify build integrity**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/actions/categories.ts src/app/\(dashboard\)/categories/ src/components/categories/ tests/categories.test.ts
git commit -m "feat: implement categories management"
```

---

### Task 6: Transaction Management Module (CRUD & Filtering)

**Files:**
- Create: `src/app/actions/transactions.ts`
- Create: `src/app/(dashboard)/transactions/page.tsx`
- Create: `src/components/transactions/transaction-form.tsx`
- Create: `src/components/transactions/transaction-table.tsx`
- Create: `src/components/transactions/transaction-filter.tsx`
- Test: `tests/transaction-filters.test.ts`

**Interfaces:**
- Consumes: `src/lib/supabase/server.ts`, `src/lib/validations/finance.ts`, `src/lib/financial.ts`
- Produces: Server actions `getTransactions(filters)`, `createTransaction(data)`, `updateTransaction(id, data)`, `deleteTransaction(id)`

- [ ] **Step 1: Write unit tests for transaction filter logic**

```typescript
// tests/transaction-filters.test.ts
import { describe, it, expect } from 'vitest';
import { filterTransactions } from '../src/lib/transaction-filter';
import { TransactionSummary } from '../src/types/finance';

describe('Transaction Filter Logic', () => {
  const data: TransactionSummary[] = [
    { id: '1', date: '2026-10-01', amount: 100000, type: 'income', categoryName: 'Gaji' },
    { id: '2', date: '2026-10-15', amount: 50000, type: 'expense', categoryName: 'Makan' },
    { id: '3', date: '2026-11-01', amount: 200000, type: 'income', categoryName: 'Bonus' },
  ];

  it('filters by date range correctly', () => {
    const filtered = filterTransactions(data, { startDate: '2026-10-01', endDate: '2026-10-31' });
    expect(filtered.length).toBe(2);
  });

  it('filters by type correctly', () => {
    const filtered = filterTransactions(data, { type: 'expense' });
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('2');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/transaction-filters.test.ts`
Expected: FAIL with "Cannot find module '../src/lib/transaction-filter'"

- [ ] **Step 3: Implement transaction filter helper, Server Actions, and UI components**

1. Buat `src/lib/transaction-filter.ts`.
2. Buat `src/app/actions/transactions.ts` dengan query database berindeks, pagination, dan filter (date, type, category).
3. Buat `TransactionForm` (modal/drawer responsif), `TransactionTable` (desktop table + mobile card view), dan filter bar.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/transaction-filters.test.ts && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/transaction-filter.ts src/app/actions/transactions.ts src/app/\(dashboard\)/transactions/ src/components/transactions/ tests/transaction-filters.test.ts
git commit -m "feat: implement transaction CRUD and filtering"
```

---

### Task 7: Financial Dashboard & Visual Charts

**Files:**
- Create: `src/app/(dashboard)/page.tsx`
- Create: `src/components/dashboard/kpi-card.tsx`
- Create: `src/components/dashboard/cashflow-chart.tsx`
- Create: `src/components/dashboard/expense-pie-chart.tsx`
- Create: `src/components/dashboard/recent-transactions.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/bottom-nav.tsx`
- Create: `src/components/layout/app-shell.tsx`

**Interfaces:**
- Consumes: `src/app/actions/transactions.ts`, `src/lib/financial.ts`, Recharts
- Produces: Dashboard utama responsif (KPI summary cards, Cashflow Bar Chart, Category Pie Chart, Recent Transactions list, navigation shell).

- [ ] **Step 1: Write test for dashboard aggregation pipeline**

```typescript
// tests/dashboard-pipeline.test.ts
import { describe, it, expect } from 'vitest';
import { calculateBalance, groupExpensesByCategory } from '../src/lib/financial';

describe('Dashboard Data Pipeline', () => {
  it('produces valid KPI and chart data structure', () => {
    const mockData = [
      { id: '1', date: '2026-10-01', amount: 5000000, type: 'income' as const, categoryName: 'Klien A' },
      { id: '2', date: '2026-10-02', amount: 1500000, type: 'expense' as const, categoryName: 'Hosting' },
    ];
    const kpi = calculateBalance(mockData);
    const expenses = groupExpensesByCategory(mockData);

    expect(kpi.netProfit).toBe(3500000);
    expect(expenses[0].categoryName).toBe('Hosting');
    expect(expenses[0].total).toBe(1500000);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/dashboard-pipeline.test.ts`
Expected: PASS

- [ ] **Step 3: Implement Dashboard components and responsive App Shell**

1. Buat `AppShell` dengan collapsible Sidebar di desktop dan Bottom Navigation di mobile (< 640px).
2. Buat `KPICard` dengan format Rupiah (Total Income, Total Expense, Net Profit, Saldo Real-time).
3. Buat `CashflowChart` menggunakan Recharts `BarChart` / `AreaChart` yang responsif (`ResponsiveContainer`).
4. Buat `ExpensePieChart` untuk visualisasi pengeluaran per kategori.
5. Susun di `src/app/(dashboard)/page.tsx` dengan Server Component streaming dan suspense skeletons.

- [ ] **Step 4: Typecheck and test build**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/\(dashboard\)/page.tsx src/components/dashboard/ src/components/layout/ tests/dashboard-pipeline.test.ts
git commit -m "feat: implement responsive financial dashboard and visualization charts"
```

---

### Task 8: Verification & Production Readiness Check

**Files:**
- Create: `tests/e2e-summary.test.ts`
- Modify: `README.md`

**Interfaces:**
- Produces: Complete verified core MVP and documentation for local run and Vercel deployment.

- [ ] **Step 1: Run complete test suite**

Run: `npx vitest run`
Expected: All unit tests PASS with 0 failures.

- [ ] **Step 2: Run production build check**

Run: `npm run build`
Expected: Build succeeds without TypeScript errors or missing imports.

- [ ] **Step 3: Write setup guide in README.md**

Dokumentasikan langkah setup environment Supabase (URL, anon key), menjalankan migrasi SQL, menjalankan server lokal (`npm run dev`), dan cara deploy ke Vercel.

- [ ] **Step 4: Final commit**

```bash
git add README.md tests/
git commit -m "docs: add setup and deployment guide for fintrack"
```
