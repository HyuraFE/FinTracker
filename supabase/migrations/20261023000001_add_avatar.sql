-- Migration: add avatar_url to profiles and setup storage bucket
alter table public.profiles add column if not exists avatar_url text;

-- Storage setup for avatars (public bucket)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Avatars are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'avatars');
