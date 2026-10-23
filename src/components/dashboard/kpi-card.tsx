export function KpiCard({ label, value, tone = 'slate' }: { label: string; value: string; tone?: 'slate'|'green'|'red'|'emerald' }) {
  const colors = { slate: 'text-slate-900', green: 'text-green-600', red: 'text-red-600', emerald: 'text-emerald-600' };
  return <div className="bg-white rounded-xl border p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${colors[tone]}`}>{value}</p></div>;
}
