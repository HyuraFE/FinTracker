import { describe, it, expect } from 'vitest';
import { calculateBalance, formatIDR, groupExpensesByCategory, groupTransactionsByMonth } from '@/lib/financial';
import { filterTransactions } from '@/lib/transaction-filter';
import { transactionSchema, categorySchema, profileSchema } from '@/lib/validations/finance';
import { loginSchema, registerSchema } from '@/lib/validations/auth';
import { TransactionSummary } from '@/types/finance';

describe('FinTrack Core MVP Integration & Business Logic Suite', () => {
  it('covers full transaction validation, filtering and aggregation lifecycle', () => {
    // 1. Validation test
    const txInput = {
      date: '2026-10-23',
      amount: 750000,
      description: 'Penjualan Kopi 50 pack',
      type: 'income' as const,
      category_id: '123e4567-e89b-12d3-a456-426614174000',
    };
    expect(transactionSchema.safeParse(txInput).success).toBe(true);

    // 2. Filter test
    const dataset: TransactionSummary[] = [
      { id: '1', date: '2026-10-20', amount: 500000, type: 'income', categoryName: 'Penjualan' },
      { id: '2', date: '2026-10-21', amount: 120000, type: 'expense', categoryName: 'Operasional' },
      { id: '3', date: '2026-10-22', amount: 80000, type: 'expense', categoryName: 'Marketing' },
    ];
    const expenseOnly = filterTransactions(dataset, { type: 'expense' });
    expect(expenseOnly).toHaveLength(2);

    // 3. Calculation & Net Profit
    const summary = calculateBalance(dataset);
    expect(summary.income).toBe(500000);
    expect(summary.expense).toBe(200000);
    expect(summary.netProfit).toBe(300000);

    // 4. Formatting
    expect(formatIDR(summary.netProfit)).toMatch(/Rp\s?300\.000/);

    // 5. Monthly & Category breakdown
    const monthly = groupTransactionsByMonth(dataset);
    expect(monthly).toHaveLength(1);
    expect(monthly[0].month).toBe('2026-10');

    const expenses = groupExpensesByCategory(dataset);
    expect(expenses).toHaveLength(2);
    expect(expenses[0].categoryName).toBe('Operasional');
    expect(expenses[0].percentage).toBe(60);
  });
});
