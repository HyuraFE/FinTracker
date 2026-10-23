'use client';
import { deleteTransaction, updateTransaction } from '@/app/actions/transactions';
import { formatIDR } from '@/lib/financial';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category { id: string; name: string; type: string; color?: string; }
interface Transaction { id: string; date: string; amount: number; description?: string | null; type: 'income' | 'expense'; category_id?: string | null; category?: { name: string; color?: string } | null; }

export function TransactionTable({ transactions, total, page, filters, categories }: {
  transactions: Transaction[];
  total: number;
  page: number;
  filters: Record<string, any>;
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
    const res = await deleteTransaction(id);
    if (res.error) toast.error(typeof res.error === 'string' ? res.error : 'Gagal menghapus');
    else { toast.success('Transaksi dihapus'); router.refresh(); }
  }

  async function handleEdit(id: string, t: Transaction) {
    return { id, date: t.date, amount: t.amount, description: t.description, type: t.type, category_id: t.category_id };
  }

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border text-slate-400">
        Belum ada transaksi. Klik tombol "Transaksi Baru" untuk memulai.
      </div>
    );
  }

  const catMap = new Map(categories.map(c => [c.id, c]));
  const pages = Math.ceil(total / 50);

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left font-semibold text-slate-600">Tanggal</th>
              <th className="p-3 text-left font-semibold text-slate-600">Kategori</th>
              <th className="p-3 text-left font-semibold text-slate-600">Catatan</th>
              <th className="p-3 text-right font-semibold text-slate-600">Nominal</th>
              <th className="p-3 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map(t => {
              const cat = t.category_id ? catMap.get(t.category_id) : null;
              const isIncome = t.type === 'income';
              return (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-800 whitespace-nowrap">{new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="p-3">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color || (isIncome ? '#059669' : '#dc2626') }} />
                      <span>{cat?.name || '—'}</span>
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{t.description || '—'}</td>
                  <td className="p-3 text-right font-medium" style={{ color: isIncome ? '#059669' : '#dc2626' }}>
                    {isIncome ? '+' : '-'}{formatIDR(t.amount).replace('Rp', '').trim()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleEdit(t.id, t)} className="text-xs text-emerald-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-xs text-red-600 hover:underline">Hapus</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-slate-500">Halaman {page} dari {pages} • Total {total} data</p>
          <div className="flex space-x-1">
            {page > 1 && (
              <button onClick={() => router.push(`?${new URLSearchParams({ ...filters, page: String(page - 1) })}`)} className="px-3 py-1 text-sm border rounded hover:bg-slate-100">Sebelumnya</button>
            )}
            {page < pages && (
              <button onClick={() => router.push(`?${new URLSearchParams({ ...filters, page: String(page + 1) })}`)} className="px-3 py-1 text-sm border rounded hover:bg-slate-100">Selanjutnya</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
