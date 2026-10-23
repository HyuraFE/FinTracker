'use client';
import Link from 'next/link';
import { LayoutDashboard, Receipt, Tags, LogOut } from 'lucide-react';
import { signOut } from '@/app/actions/auth';

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-slate-900 text-white min-h-screen flex-col p-5">
      <div className="text-xl font-bold tracking-tight text-emerald-400 mb-10">FinTrack</div>
      <nav className="space-y-1 flex-1">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm"><LayoutDashboard size={18} /> Dashboard</Link>
        <Link href="/transactions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm"><Receipt size={18} /> Transaksi</Link>
        <Link href="/categories" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm"><Tags size={18} /> Kategori</Link>
      </nav>
      <form action={signOut}>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm w-full"><LogOut size={18} /> Keluar</button>
      </form>
    </aside>
  );
}
