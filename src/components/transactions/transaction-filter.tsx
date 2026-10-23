'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Category { id: string; name: string; type: string; }

const MONTHS = [
  { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' }, { value: '3', label: 'Maret' },
  { value: '4', label: 'April' }, { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' }, { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

export function TransactionFilter({ initialFilters, categories }: { initialFilters: Record<string, any>; categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [month, setMonth] = useState(initialFilters.month || new Date().getMonth() + 1 + '');
  const [year, setYear] = useState(initialFilters.year || new Date().getFullYear() + '');
  const [type, setType] = useState<'income' | 'expense' | ''>(initialFilters.type || '');
  const [category_id, setCategoryId] = useState(initialFilters.category_id || '');

  useEffect(() => {
    setMonth(initialFilters.month || '');
    setYear(initialFilters.year || '');
    setType(initialFilters.type || '');
    setCategoryId(initialFilters.category_id || '');
  }, [initialFilters]);

  function applyFilters() {
    const params = new URLSearchParams();
    if (month) params.set('month', month);
    if (year) params.set('year', year);
    if (type) params.set('type', type);
    if (category_id) params.set('category_id', category_id);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  }

  function resetFilters() {
    router.push('/transactions');
  }

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i) + '');
  const filteredCats = categories.filter(c => !type || c.type === type);

  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Bulan</label>
          <select value={month} onChange={e => setMonth(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Tahun</label>
          <select value={year} onChange={e => setYear(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Tipe</label>
          <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="">Semua</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Kategori</label>
          <select value={category_id} onChange={e => setCategoryId(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="">Semua</option>
            {filteredCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={applyFilters} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Terapkan</button>
        <button onClick={resetFilters} className="px-4 py-2 text-sm text-slate-600 border rounded-lg hover:bg-slate-100">Reset</button>
      </div>
    </div>
  );
}