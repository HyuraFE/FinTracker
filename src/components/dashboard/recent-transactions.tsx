import { formatIDR } from '@/lib/financial';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionItem {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  categoryName?: string;
}

export function RecentTransactions({ transactions }: { transactions: TransactionItem[] }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-8 shadow-sm text-center">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <ArrowUpRight size={24} />
        </div>
        <h3 className="font-semibold text-slate-800">Belum ada transaksi di periode ini</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Mulai catat pemasukan dan pengeluaran usaha untuk melihat analisis keuangan Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Transaksi Terbaru</h2>
          <p className="text-xs text-slate-400">5 transaksi terakhir pada periode ini</p>
        </div>
        <Link href="/transactions" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
          Lihat semua
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {transactions.slice(0, 5).map((t) => {
          const isIncome = t.type === 'income';
          return (
            <div key={t.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0 hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.description || t.categoryName || 'Transaksi'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-medium text-slate-500">{t.categoryName || 'Lainnya'}</span>
                  </div>
                </div>
              </div>
              <span className={`text-sm font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isIncome ? '+' : '-'}{formatIDR(t.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}