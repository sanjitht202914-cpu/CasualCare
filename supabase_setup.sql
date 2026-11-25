-- Run once in Supabase SQL Editor. Private data is scoped to the signed-in user.
create table if not exists public.cc_medicines (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null, dosage text not null, timing text not null default '', frequency text not null default 'Once daily',
 purpose text not null default '', remaining_days integer not null default 0 check (remaining_days >= 0),
 taken_today boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.cc_milestones (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 title text not null, description text not null default '', day_label text not null default '', milestone_date text not null default '',
 active boolean not null default false, completed boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.cc_recovery_logs (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 mood text not null check (mood in ('good','fair','poor')),
 pain_level integer not null check (pain_level between 0 and 10), symptoms text not null default '',
 created_at timestamptz not null default now()
);
alter table public.cc_medicines enable row level security;
alter table public.cc_milestones enable row level security;
alter table public.cc_recovery_logs enable row level security;
create policy "Users manage own medicines" on public.cc_medicines for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "Users manage own milestones" on public.cc_milestones for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "Users manage own recovery logs" on public.cc_recovery_logs for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
grant select,insert,update,delete on public.cc_medicines,public.cc_milestones,public.cc_recovery_logs to authenticated;
