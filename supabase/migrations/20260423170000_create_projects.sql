create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video', 'link')),
  thumbnail_url text,
  created_at timestamp with time zone not null default now()
);

create index if not exists projects_created_at_idx
on public.projects (created_at desc);

alter table public.projects enable row level security;

drop policy if exists "public can read projects" on public.projects;
create policy "public can read projects"
on public.projects
for select
to anon
using (true);

drop policy if exists "public can insert projects" on public.projects;
create policy "public can insert projects"
on public.projects
for insert
to anon
with check (true);
