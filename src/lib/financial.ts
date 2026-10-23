import { TransactionSummary, MonthlyFinancialSummary, CategoryExpenseSummary } from '../types/finance';

export function calculateBalance(transactions: TransactionSummary[]): { income: number; expense: number; netProfit: number } {
  let incomeCents = 0;
  let expenseCents = 0;

  for (const t of transactions) {
    const cents = Math.round(t.amount * 100);
    if (t.type === 'income') {
      incomeCents += cents;
    } else if (t.type === 'expense') {
      expenseCents += cents;
    }
  }

  const income = incomeCents / 100;
  const expense = expenseCents / 100;
  const netProfit = (incomeCents - expenseCents) / 100;

  return { income, expense, netProfit };
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function groupExpensesByCategory(transactions: TransactionSummary[]): CategoryExpenseSummary[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  let totalExpenseCents = 0;
  const map = new Map<string, number>();

  for (const t of expenses) {
    const name = t.categoryName || 'Lainnya';
    const cents = Math.round(t.amount * 100);
    totalExpenseCents += cents;
    map.set(name, (map.get(name) || 0) + cents);
  }

  if (totalExpenseCents === 0) return [];

  const result: CategoryExpenseSummary[] = [];
  for (const [categoryName, cents] of Array.from(map.entries())) {
    const total = cents / 100;
    const percentage = Number(((cents / totalExpenseCents) * 100).toFixed(2));
    result.push({ categoryName, total, percentage });
  }

  return result.sort((a, b) => b.total - a.total);
}

export function groupTransactionsByMonth(transactions: TransactionSummary[]): MonthlyFinancialSummary[] {
  const map = new Map<string, { incomeCents: number; expenseCents: number }>();

  for (const t of transactions) {
    const month = t.date.slice(0, 7); // 'YYYY-MM'
    const entry = map.get(month) || { incomeCents: 0, expenseCents: 0 };
    const cents = Math.round(t.amount * 100);
    if (t.type === 'income') {
      entry.incomeCents += cents;
    } else {
      entry.expenseCents += cents;
    }
    map.set(month, entry);
  }

  const result: MonthlyFinancialSummary[] = [];
  const sortedMonths = Array.from(map.keys()).sort();

  for (const month of sortedMonths) {
    const entry = map.get(month)!;
    result.push({
      month,
      income: entry.incomeCents / 100,
      expense: entry.expenseCents / 100,
      netProfit: (entry.incomeCents - entry.expenseCents) / 100,
    });
  }

  return result;
}
