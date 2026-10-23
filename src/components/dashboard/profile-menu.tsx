'use client';
import { useState, useRef, useEffect } from 'react';
import { signOut } from '@/app/actions/auth';
import { User, LogOut, Settings, Building2 } from 'lucide-react';

export function ProfileMenu({
  userName,
  businessName,
  avatarUrl,
}: {
  userName?: string;
  businessName?: string;
  avatarUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-slate-50 transition"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full border border-emerald-500/20 bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-sm overflow-hidden shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            businessName?.[0]?.toUpperCase() || userName?.[0]?.toUpperCase() || 'U'
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-medium text-slate-800">{businessName || 'Usaha'}</p>
          <p className="text-[10px] text-slate-400">{userName || 'Pengguna'}</p>
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold text-slate-900">{businessName || 'Nama Usaha'}</p>
            <p className="text-xs text-slate-500 truncate">{userName || 'email@domain.com'}</p>
          </div>
          <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <Settings size={16} /> Pengaturan
          </a>
          <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <Building2 size={16} /> Profil Usaha
          </a>
          <hr className="my-1" />
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-2 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
              <LogOut size={16} /> Keluar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}