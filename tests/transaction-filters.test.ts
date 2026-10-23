import { describe, it, expect } from 'vitest';
import { filterTransactions } from '@/lib/transaction-filter';
import { TransactionSummary } from '@/types/finance';

describe('Transaction Filter Logic', () => {
  const data: TransactionSummary[] = [
    { id: '1', date: '2026-10-01', amount: 100000, type: 'income', categoryName: 'Gaji' },
    { id: '2', date: '2026-10-15', amount: 50000, type: 'expense', categoryName: 'Makan' },
    { id: '3', date: '2026-11-01', amount: 200000, type: 'income', categoryName: 'Bonus' },
  ];
  it('filters by date range correctly', () => expect(filterTransactions(data, { startDate: '2026-10-01', endDate: '2026-10-31' })).toHaveLength(2));
  it('filters by type correctly', () => { const filtered = filterTransactions(data, { type: 'expense' }); expect(filtered).toHaveLength(1); expect(filtered[0].id).toBe('2'); });
});
