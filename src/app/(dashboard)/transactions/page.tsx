import { TransactionTable } from '@/components/transactions/transaction-table';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { TransactionFilter } from '@/components/transactions/transaction-filter';
import { getTransactions, TransactionFilters } from '@/app/actions/transactions';
import { getCategories } from '@/app/actions/categories';

export const revalidate = 0;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters: TransactionFilters = {
    startDate: params?.startDate,
    endDate: params?.endDate,
    type: params?.type as 'income' | 'expense' | undefined,
    category_id: params?.category_id,
    page: parseInt(params?.page || '1', 10),
    limit: 50,
  };

  const [transactionsResult, categories] = await Promise.all([
    getTransactions(filters),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-sm text-slate-500">Kelola semua pencatatan keuangan usaha</p>
        </div>
        <TransactionForm categories={categories || []} />
      </div>

      <TransactionFilter initialFilters={filters} categories={categories || []} />
      <TransactionTable
        transactions={transactionsResult.data || []}
        total={transactionsResult.count || 0}
        page={filters.page || 1}
        filters={filters}
        categories={categories || []}
      />
    </div>
  );
}
