'use client';
import { useState } from 'react';
import { deleteCategory } from '@/app/actions/categories';
import { toast } from 'sonner';

export function CategoryList({ initialCategories }: { initialCategories: any[] }) {
  const [tab, setTab] = useState<'income' | 'expense'>('expense');
  const filtered = initialCategories.filter((c) => c.type === tab);

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    const res = await deleteCategory(id);
    if (res.error) toast.error(typeof res.error === 'string' ? res.error : 'Gagal menghapus kategori');
    else toast.success('Kategori berhasil dihapus');
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setTab('expense')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition ${
            tab === 'expense' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Pengeluaran
        </button>
        <button
          onClick={() => setTab('income')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition ${
            tab === 'income' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border text-slate-400">
            Belum ada kategori {tab === 'income' ? 'pemasukan' : 'pengeluaran'}.
          </div>
        ) : (
          filtered.map((cat) => (
            <div key={cat.id} className="p-4 bg-white rounded-xl border flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || (cat.type === 'income' ? '#059669' : '#dc2626') }} />
                <span className="font-medium text-slate-800">{cat.name}</span>
              </div>
              {!cat.is_default && (
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Hapus
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
