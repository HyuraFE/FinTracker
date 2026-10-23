'use client';
import { useState, useRef } from 'react';
import { updateProfile, uploadAvatar, deleteAvatar } from '@/app/actions/profile';
import { toast } from 'sonner';
import { Camera, Trash2, Building2, User, Save } from 'lucide-react';

interface ProfileData {
  id: string;
  full_name?: string | null;
  business_name?: string | null;
  avatar_url?: string | null;
  email?: string;
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 2MB');
      return;
    }

    setAvatarLoading(true);
    const fd = new FormData();
    fd.append('avatar', file);

    const res = await uploadAvatar(fd);
    if (res.error) {
      toast.error(typeof res.error === 'string' ? res.error : 'Gagal upload foto profil');
    } else {
      toast.success('Foto profil diperbarui');
      if (res.avatarUrl) setAvatarUrl(res.avatarUrl);
    }
    setAvatarLoading(false);
  }

  async function handleDeleteAvatar() {
    if (!confirm('Hapus foto profil?')) return;
    setAvatarLoading(true);
    const res = await deleteAvatar();
    if (res.error) toast.error(typeof res.error === 'string' ? res.error : 'Gagal menghapus foto');
    else {
      toast.success('Foto profil dihapus');
      setAvatarUrl(null);
    }
    setAvatarLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateProfile(fd);
    if (res?.error) {
      toast.error(typeof res.error === 'string' ? res.error : 'Validasi gagal');
    } else {
      toast.success('Profil berhasil diperbarui');
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8 space-y-8">
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Foto Profil & Logo Usaha</h2>
        <p className="text-xs text-slate-500 mb-4">Gunakan logo usaha atau foto diri untuk mempersonalisasi akun</p>

        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full border-2 border-emerald-500/20 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-emerald-600">
                {profile.business_name?.[0]?.toUpperCase() || profile.full_name?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
            {avatarLoading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
                ...
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              disabled={avatarLoading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 transition"
            >
              <Camera size={14} /> Ganti Foto
            </button>
            {avatarUrl && (
              <button
                type="button"
                disabled={avatarLoading}
                onClick={handleDeleteAvatar}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5 transition"
              >
                <Trash2 size={14} /> Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            disabled
            defaultValue={profile.email}
            className="w-full px-3 py-2 border rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
          />
          <span className="text-[10px] text-slate-400">Email akun tidak dapat diubah di sini</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Usaha / Bisnis</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 size={16} />
            </div>
            <input
              name="business_name"
              required
              defaultValue={profile.business_name || ''}
              placeholder="Contoh: Kedai Kopi Makmur"
              className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pemilik (Opsional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User size={16} />
            </div>
            <input
              name="full_name"
              defaultValue={profile.full_name || ''}
              placeholder="Contoh: Budi Santoso"
              className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}