'use client';
import { useState } from 'react';
import { createCategory } from '@/app/actions/categories';
import { toast } from 'sonner';

export function CategoryModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await createCategory(fd);
    if (res.error) {
      toast.error(typeof res.error === 'string' ? res.error : 'Validasi gagal');
    } else {
      toast.success('Kategori berhasil ditambahkan');
      setOpen(false);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
        + Tambah Kategori
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-bold">Kategori Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nama Kategori</label>
            <input name="name" required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Contoh: Operasional" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Tipe</label>
            <select name="type" className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
