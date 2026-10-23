'use client';
import Link from 'next/link';
import { LayoutDashboard, Receipt, Tags } from 'lucide-react';
export function BottomNav() {
  return <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t h-16 flex items-center justify-around"><Link href="/dashboard" className="flex flex-col items-center gap-1 text-xs text-slate-600"><LayoutDashboard size={19} />Dashboard</Link><Link href="/transactions" className="flex flex-col items-center gap-1 text-xs text-slate-600"><Receipt size={19} />Transaksi</Link><Link href="/categories" className="flex flex-col items-center gap-1 text-xs text-slate-600"><Tags size={19} />Kategori</Link></nav>;
}
