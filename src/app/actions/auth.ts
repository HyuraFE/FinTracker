'use server';

import { createServerClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema } from '@/lib/validations/auth';
import { redirect } from 'next/navigation';

export async function signInWithPassword(formData: FormData) {
  const supabase = createServerClient();
  const raw = { email: formData.get('email'), password: formData.get('password') };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: { _form: [error.message] } };
  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const supabase = createServerClient();
  const raw = { email: formData.get('email'), password: formData.get('password'), businessName: formData.get('businessName') };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { business_name: parsed.data.businessName } },
  });
  if (error) return { error: { _form: [error.message] } };
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}