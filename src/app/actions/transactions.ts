'use server';

import { createServerClient } from '@/lib/supabase/server';
import { transactionSchema } from '@/lib/validations/finance';
import { revalidatePath } from 'next/cache';

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense';
  category_id?: string;
  page?: number;
  limit?: number;
}

export async function getTransactions(filters: TransactionFilters = {}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], count: 0 };

  let query = supabase
    .from('transactions')
    .select('*, category:categories(name, color)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters.startDate) query = query.gte('date', filters.startDate);
  if (filters.endDate) query = query.lte('date', filters.endDate);
  if (filters.type) query = query.eq('type', filters.type);
  if (filters.category_id) query = query.eq('category_id', filters.category_id);

  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) return { data: [], count: 0, error: error.message };
  return { data: data || [], count: count || 0 };
}

export async function createTransaction(formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const parsed = transactionSchema.safeParse({
    date: formData.get('date'),
    amount: formData.get('amount'),
    description: formData.get('description') || undefined,
    type: formData.get('type'),
    category_id: formData.get('category_id') || undefined,
  });

  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.from('transactions').insert({ ...parsed.data, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { success: true };
}

export async function updateTransaction(id: string, formData: FormData) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const parsed = transactionSchema.safeParse({
    date: formData.get('date'),
    amount: formData.get('amount'),
    description: formData.get('description') || undefined,
    type: formData.get('type'),
    category_id: formData.get('category_id') || undefined,
  });

  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase
    .from('transactions')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { success: true };
}