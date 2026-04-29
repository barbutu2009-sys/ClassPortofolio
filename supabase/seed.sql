-- Create projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video', 'link')),
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security
alter table projects enable row level security;

-- Create policies
-- Public can read projects
create policy "Allow public read access"
on projects for select
to public
using (true);

-- Public can insert projects
create policy "Allow public insert access"
on projects for insert
to public
with check (true);

-- Disable updates and deletes for public
create policy "Disable public updates"
on projects for update
to public
using (false);

create policy "Disable public deletes"
on projects for delete
to public
using (false);

-- Create index for performance
create index if not exists projects_created_at_idx on projects (created_at desc);
