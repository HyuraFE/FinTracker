import { createServerClient } from '@/lib/supabase/server';
import { ProfileForm } from '@/components/profile/profile-form';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function ProfilePage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, business_name, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600">Profil Akun</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Profil Usaha</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola identitas bisnis dan foto profil Anda.</p>
      </div>
      <ProfileForm profile={{
        id: user.id,
        full_name: profile?.full_name,
        business_name: profile?.business_name,
        avatar_url: profile?.avatar_url,
        email: user.email || '',
      }} />
    </div>
  );
}