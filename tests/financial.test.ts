import { describe, it, expect } from 'vitest';
import { calculateBalance, groupTransactionsByMonth, groupExpensesByCategory, formatIDR } from '@/lib/financial';
import { TransactionSummary } from '@/types/finance';

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
