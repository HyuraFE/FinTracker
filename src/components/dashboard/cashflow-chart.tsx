'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatIDR } from '@/lib/financial';

export function CashflowChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between h-80">
        <div>
          <h2 className="text-base font-bold text-slate-900">Arus Kas Bulanan</h2>
          <p className="text-xs text-slate-400">Tren pemasukan dan pengeluaran</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Belum ada data grafik di periode ini
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">Arus Kas Bulanan</h2>
        <p className="text-xs text-slate-400">Perbandingan pemasukan vs pengeluaran</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" tickLine={false} />
            <YAxis
              fontSize={11}
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}jt`;
                if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`;
                return `${v}`;
              }}
            />
            <Tooltip
              formatter={(v: number) => [formatIDR(v), '']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }} iconType="circle" />
            <Bar dataKey="income" name="Pemasukan" fill="#059669" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Pengeluaran" fill="#e11d48" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}