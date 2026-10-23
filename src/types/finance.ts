export type TransactionType = 'income' | 'expense';

export interface TransactionSummary {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: TransactionType;
  categoryName?: string;
  description?: string;
}

export interface MonthlyFinancialSummary {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  netProfit: number;
}

export interface CategoryExpenseSummary {
  categoryName: string;
  total: number;
  percentage: number;
}
