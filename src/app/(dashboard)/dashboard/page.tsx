import { getTransactions, TransactionFilters } from '@/app/actions/transactions';
import { getCategories } from '@/app/actions/categories';
import { calculateBalance, formatIDR, groupExpensesByCategory, groupTransactionsByMonth } from '@/lib/financial';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { CashflowChart } from '@/components/dashboard/cashflow-chart';
import { ExpensePieChart } from '@/components/dashboard/expense-pie-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export const revalidate = 0;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { month?: string; year?: string };
}) {
  const currentMonth = new Date().getMonth() + 1 + '';
  const currentYear = new Date().getFullYear() + '';

  const month = searchParams?.month || currentMonth;
  const year = searchParams?.year || currentYear;

  const filters: TransactionFilters = {
    month,
    year,
    limit: 10000,
  };

  const [result, categories] = await Promise.all([
    getTransactions(filters),
    getCategories(),
  ]);

  const transactions = (result.data || []).map((t: any) => ({
    id: t.id,
    date: t.date,
    amount: Number(t.amount),
    type: t.type,
    description: t.description || undefined,
    categoryName: t.category?.name || 'Lainnya',
  }));

  const summary = calculateBalance(transactions);
  const months = groupTransactionsByMonth(transactions);
  const expenses = groupExpensesByCategory(transactions);
  const balance = summary.netProfit;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardHeader categories={categories || []} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Saldo Bersih Periode Ini"
          value={formatIDR(balance)}
          hero={true}
          subtext={`Perhitungan pendapatan dikurangi pengeluaran periode ${month}/${year}`}
        />
        <KpiCard
          label="Pemasukan"
          value={formatIDR(summary.income)}
          tone="green"
          icon="income"
          subtext="Total transaksi masuk"
        />
        <KpiCard
          label="Pengeluaran"
          value={formatIDR(summary.expense)}
          tone="red"
          icon="expense"
          subtext="Total biaya operasional"
        />
        <KpiCard
          label="Net Profit"
          value={formatIDR(summary.netProfit)}
          tone={summary.netProfit >= 0 ? 'emerald' : 'red'}
          icon="profit"
          subtext={summary.netProfit >= 0 ? 'Surplus kas' : 'Defisit kas'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashflowChart data={months} />
        <ExpensePieChart data={expenses} />
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  );
}