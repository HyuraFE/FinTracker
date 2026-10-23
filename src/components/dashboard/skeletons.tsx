export function KpiCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm animate-pulse space-y-3">
      <div className="h-4 w-24 bg-slate-200 rounded" />
      <div className="h-8 w-32 bg-slate-200 rounded" />
    </div>
  );
}

export function ChartSkeleton({ height = 256 }: { height?: number }) {
  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm animate-pulse">
      <div className="h-5 w-36 bg-slate-200 rounded mb-4" />
      <div className="h-[256px] bg-slate-100 rounded" style={{ height }} />
    </div>
  );
}

export function RecentTransactionsSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-5 w-32 bg-slate-200 rounded" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 w-40 bg-slate-200 rounded mb-1" />
            <div className="h-3 w-24 bg-slate-200 rounded" />
          </div>
          <div className="h-5 w-20 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div>
        <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
        <div className="h-8 w-32 bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <RecentTransactionsSkeleton />
    </div>
  );
}