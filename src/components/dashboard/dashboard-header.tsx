'use client';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { PeriodFilter } from '@/components/dashboard/period-filter';

interface Category { id: string; name: string; type: 'income' | 'expense'; color?: string; }

export function DashboardHeader({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600">FinTrack Overview</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <TransactionForm categories={categories} />
        </div>
      </div>
      <PeriodFilter />
    </div>
  );
}