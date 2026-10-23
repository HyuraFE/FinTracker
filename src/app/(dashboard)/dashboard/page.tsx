import { getTransactions } from '@/app/actions/transactions';
import { calculateBalance, formatIDR, groupExpensesByCategory, groupTransactionsByMonth } from '@/lib/financial';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { CashflowChart } from '@/components/dashboard/cashflow-chart';
import { ExpensePieChart } from '@/components/dashboard/expense-pie-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export const revalidate = 0;

export default async function DashboardPage() {
  const result = await getTransactions({ limit: 10000 });
  const transactions = (result.data || []).map((t: any) => ({ id: t.id, date: t.date, amount: Number(t.amount), type: t.type, description: t.description || undefined, categoryName: t.category?.name || 'Lainnya' }));
  const summary = calculateBalance(transactions);
  const months = groupTransactionsByMonth(transactions);
  const expenses = groupExpensesByCategory(transactions);
  const balance = summary.netProfit;

  return <div className="max-w-7xl mx-auto space-y-6"><div><p className="text-sm text-slate-500">Ringkasan keuangan</p><h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"><KpiCard label="Saldo Saat Ini" value={formatIDR(balance)} tone="emerald" /><KpiCard label="Total Pemasukan" value={formatIDR(summary.income)} tone="green" /><KpiCard label="Total Pengeluaran" value={formatIDR(summary.expense)} tone="red" /><KpiCard label="Net Profit" value={formatIDR(summary.netProfit)} tone={summary.netProfit >= 0 ? 'green' : 'red'} /></div><div className="grid lg:grid-cols-2 gap-4"><CashflowChart data={months} /><ExpensePieChart data={expenses} /></div><RecentTransactions transactions={transactions} /></div>;
}
