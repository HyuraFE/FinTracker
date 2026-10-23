'use server';

import { createServerClient } from '@/lib/supabase/server';
import { profileSchema } from '@/lib/validations/finance';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const parsed = profileSchema.safeParse({
    full_name: formData.get('full_name') || undefined,
    business_name: formData.get('business_name') || undefined,
    low_balance_threshold: formData.get('low_balance_threshold') || undefined,
  });

  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  // Also update auth metadata for display name
  if (parsed.data.full_name || parsed.data.business_name) {
    await supabase.auth.updateUser({
      data: {
        full_name: parsed.data.full_name || user.user_metadata?.full_name,
        business_name: parsed.data.business_name || user.user_metadata?.business_name,
      },
    });
  }

  redirect('/dashboard');
}

export async function uploadAvatar(formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const file = formData.get('avatar') as File;
  if (!file || file.size === 0) return { error: 'File tidak ditemukan' };

  if (file.size > 2 * 1024 * 1024) return { error: 'File maksimal 2MB' };
  if (!file.type.startsWith('image/')) return { error: 'File harus berupa gambar' };

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${user.id}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

  const { error: profileError } = await supabase.from('profiles').update({
    avatar_url: publicUrl,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id);

  if (profileError) return { error: profileError.message };

  return { success: true, avatarUrl: publicUrl };
}

export async function deleteAvatar() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  await supabase.storage.from('avatars').remove([`${user.id}/avatar.png`, `${user.id}/avatar.jpg`, `${user.id}/avatar.jpeg`, `${user.id}/avatar.webp`]);

  const { error } = await supabase.from('profiles').update({
    avatar_url: null,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id);

  if (error) return { error: error.message };

  return { success: true };
}