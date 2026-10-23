'use client';
import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center max-w-md mx-auto my-12 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
        !
      </div>
      <h2 className="text-lg font-bold text-slate-900">Gagal Memuat Dashboard</h2>
      <p className="text-sm text-slate-500 mt-2">
        Terjadi kendala saat mengambil data keuangan. Silakan coba beberapa saat lagi.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
      >
        Coba Lagi
      </button>
    </div>
  );
}