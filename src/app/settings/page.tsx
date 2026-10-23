import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Shield, Bell, ChevronRight, AlertTriangle } from 'lucide-react';

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600">Pengaturan</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Pengaturan Akun</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola preferensi dan keamanan akun Anda.</p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Profil & Identitas
          </h2>
          <Link
            href="/profile"
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-emerald-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <User size={16} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Profil Usaha</p>
                <p className="text-xs text-slate-500">Nama usaha, logo, dan nama pemilik</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        </section>

        <section className="space-y-4 border-t pt-6">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Keamanan
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600">
                <Shield size={16} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Email Akun</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Terverifikasi</span>
          </div>
        </section>

        <section className="space-y-4 border-t pt-6">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Zona Akun
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Status Akun</p>
                <p className="text-xs text-slate-500">Akun FinTrack UMKM aktif</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}