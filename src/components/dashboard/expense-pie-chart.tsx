'use client';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatIDR } from '@/lib/financial';
const COLORS = ['#dc2626','#f97316','#eab308','#8b5cf6','#64748b','#06b6d4'];
export function ExpensePieChart({ data }: { data: { categoryName: string; total: number }[] }) { return <div className="bg-white rounded-xl border p-5 shadow-sm"><h2 className="font-semibold mb-4">Pengeluaran per Kategori</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="total" nameKey="categoryName" cx="50%" cy="50%" outerRadius={85}>{data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => formatIDR(v)} /><Legend wrapperStyle={{fontSize: '12px'}} /></PieChart></ResponsiveContainer></div></div>; }
