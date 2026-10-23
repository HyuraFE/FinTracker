-- FinTrack UMKM initial schema
-- Run in Supabase SQL Editor (CLI or Dashboard)

create extension if not exists "uuid-ossp";

-- profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  business_name text,
  currency text not null default 'IDR',
  timezone text not null default 'Asia/Jakarta',
  low_balance_threshold numeric(18,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income','expense')),
  icon text,
  color text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- transactions
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  date date not null,
  amount numeric(18,2) not null check (amount > 0),
  description text,
  type text not null check (type in ('income','expense')),
  is_recurring boolean not null default false,
  recurring_rule jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- indexes
create index if not exists transactions_user_id_date_idx on public.transactions (user_id, date desc);
create index if not exists transactions_user_id_category_id_idx on public.transactions (user_id, category_id);
create index if not exists categories_user_id_type_idx on public.categories (user_id, type);

-- RLS enable
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- policies: profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- policies: categories
create policy "Users can CRUD own categories" on public.categories
  for all using (auth.uid() = user_id);

-- policies: transactions
create policy "Users can CRUD own transactions" on public.transactions
  for all using (auth.uid() = user_id);

-- trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, business_name)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'business_name');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- default categories seeding (per user, will be inserted via app logic on first login)
-- You can add seed data here or let the app handle it.