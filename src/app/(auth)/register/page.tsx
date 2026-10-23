'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/app/actions/auth';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await signUp(fd);
    if (res?.error) {
      const err = res.error as Record<string, string[]>;
      setErrors(err);
      if (err._form?.[0]) toast.error(err._form[0]);
    } else router.refresh();
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Buat Akun FinTrack</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Usaha</label>
            <input name="businessName" type="text" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password (min 6 karakter)</label>
            <input name="password" type="password" required minLength={6} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition">Daftar</button>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <a href="/login" className="text-emerald-600 hover:underline">Masuk</a></p>
      </form>
    </div>
  );
}
