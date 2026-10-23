'use server';

import { createServerClient } from '@/lib/supabase/server';
import { categorySchema } from '@/lib/validations/finance';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return [];
  return data;
}

export async function createCategory(formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    icon: formData.get('icon') || undefined,
    color: formData.get('color') || undefined,
  });

  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.from('categories').insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath('/categories');
  revalidatePath('/transactions');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/categories');
  revalidatePath('/transactions');
  return { success: true };
}
