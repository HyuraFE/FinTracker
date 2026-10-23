'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const MONTHS = [
  { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' }, { value: '3', label: 'Maret' },
  { value: '4', label: 'April' }, { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' }, { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

export function PeriodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [month, setMonth] = useState(searchParams.get('month') || new Date().getMonth() + 1 + '');
  const [year, setYear] = useState(searchParams.get('year') || new Date().getFullYear() + '');

  useEffect(() => {
    const params = new URLSearchParams();
    if (month) params.set('month', month);
    if (year) params.set('year', year);
    router.push(`/dashboard?${params.toString()}`);
  }, [month, year, router]);

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i) + '');

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border p-4 shadow-sm">
      <span className="text-sm font-semibold text-slate-700">Periode:</span>
      <select value={month} onChange={e => setMonth(e.target.value)} className="w-40 px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
        {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <select value={year} onChange={e => setYear(e.target.value)} className="w-28 px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <span className="ml-auto text-xs text-slate-400">Data otomatis diperbarui saat periode berubah</span>
    </div>
  );
}