import { TransactionSummary } from '@/types/finance';

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense';
  category_id?: string;
}

export function filterTransactions(
  transactions: TransactionSummary[],
  filters: TransactionFilters
): TransactionSummary[] {
  return transactions.filter((t) => {
    if (filters.startDate && t.date < filters.startDate) return false;
    if (filters.endDate && t.date > filters.endDate) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.category_id && t.categoryName !== filters.category_id) return false;
    return true;
  });
}