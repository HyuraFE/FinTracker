'use client';
import { useState, useEffect } from 'react';
import { createTransaction, updateTransaction } from '@/app/actions/transactions';
import { toast } from 'sonner';

interface Category { id: string; name: string; type: 'income' | 'expense'; color?: string; }

export function TransactionForm({ categories, initialData, onClose }: {
  categories: Category[];
  initialData?: { id: string; date: string; amount: number; description?: string; type: 'income' | 'expense'; category_id?: string | null; } | null;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');
  const filteredCategories = categories.filter(c => c.type === selectedType);

  useEffect(() => { if (initialData) { setOpen(true); setSelectedType(initialData.type); } else { setOpen(false); } }, [initialData]);

  if (!open && !initialData) return (
    <button onClick={() => { setSelectedType('expense'); setOpen(true); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">+ Transaksi</button>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = initialData
      ? await updateTransaction(initialData.id, fd)
      : await createTransaction(fd);
    if (res.error) toast.error(typeof res.error === 'string' ? res.error : 'Validasi gagal');
    else { toast.success(initialData ? 'Transaksi diperbarui' : 'Transaksi ditambahkan'); setOpen(false); }
    setLoading(false);
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{initialData ? 'Edit Transaksi' : 'Transaksi Baru'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Tipe</label>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setSelectedType('expense')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedType === 'expense' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Pengeluaran</button>
              <button type="button" onClick={() => setSelectedType('income')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedType === 'income' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Pemasukan</button>
            </div>
          </div>
          <input type="hidden" name="type" value={selectedType} />
          <div>
            <label className="block text-xs font-semibold mb-1">Tanggal</label>
            <input name="date" type="date" defaultValue={initialData?.date || today} required className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Nominal (Rp)</label>
            <input name="amount" type="number" min="1" step="1000" defaultValue={initialData?.amount || ''} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Contoh: 50000" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Kategori</label>
            <select name="category_id" className="w-full px-3 py-2 border rounded-lg text-sm" required>
              <option value="">Pilih kategori</option>
              {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Catatan</label>
            <textarea name="description" rows={2} defaultValue={initialData?.description || ''} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Opsional" />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => { setOpen(false); onClose?.(); }} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
