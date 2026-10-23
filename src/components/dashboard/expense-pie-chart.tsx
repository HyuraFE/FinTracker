'use client';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatIDR } from '@/lib/financial';

const COLORS = ['#e11d48', '#f97316', '#eab308', '#8b5cf6', '#64748b', '#06b6d4'];

export function ExpensePieChart({ data }: { data: { categoryName: string; total: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between h-80">
        <div>
          <h2 className="text-base font-bold text-slate-900">Pengeluaran per Kategori</h2>
          <p className="text-xs text-slate-400">Distribusi biaya usaha</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Belum ada pengeluaran di periode ini
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">Pengeluaran per Kategori</h2>
        <p className="text-xs text-slate-400">Distribusi biaya usaha</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="categoryName" cx="50%" cy="44%" outerRadius={76} innerRadius={42} paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
            </Pie>
            <Tooltip formatter={(v: number) => [formatIDR(v), '']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}