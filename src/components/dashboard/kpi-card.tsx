import { LucideIcon, Wallet, ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  tone?: 'slate' | 'green' | 'red' | 'emerald';
  hero?: boolean;
  subtext?: string;
  icon?: 'wallet' | 'income' | 'expense' | 'profit';
}

const ICONS = {
  wallet: Wallet,
  income: ArrowUpRight,
  expense: ArrowDownRight,
  profit: TrendingUp,
};

export function KpiCard({
  label,
  value,
  tone = 'slate',
  hero = false,
  subtext,
  icon,
}: KpiCardProps) {
  const IconComponent = icon ? ICONS[icon] : null;

  if (hero) {
    return (
      <div className="col-span-full md:col-span-2 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-emerald-700/50 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase font-semibold tracking-wider text-emerald-200">{label}</p>
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
            <Wallet size={20} />
          </div>
        </div>
        <div>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">{value}</p>
          {subtext && <p className="text-xs text-emerald-200/80 mt-2 font-medium">{subtext}</p>}
        </div>
      </div>
    );
  }

  const toneStyles = {
    slate: 'bg-white border-slate-200 text-slate-900',
    green: 'bg-white border-emerald-100 text-emerald-600',
    red: 'bg-white border-rose-100 text-rose-600',
    emerald: 'bg-white border-emerald-100 text-emerald-700',
  };

  const badgeStyles = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between ${toneStyles[tone]}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {IconComponent && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${badgeStyles[tone]}`}>
            <IconComponent size={16} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}