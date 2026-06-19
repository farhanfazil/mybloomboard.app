create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
  display_name text;
begin
  display_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(coalesce(new.email, 'Bloomboard User'), '@', 1)
  );

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    display_name,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name),
      avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

  if not exists (
    select 1 from public.workspace_members where user_id = new.id
  ) then
    insert into public.workspaces (name, owner_id, last_updated_by)
    values (display_name || '''s Workspace', new.id, new.id)
    returning id into new_workspace_id;

    insert into public.workspace_members (workspace_id, user_id, role)
    values (new_workspace_id, new.id, 'owner');
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.ensure_user_workspace()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_workspace_id uuid;
  current_user auth.users%rowtype;
  display_name text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select workspace_id
  into existing_workspace_id
  from public.workspace_members
  where user_id = auth.uid()
  order by created_at
  limit 1;

  if existing_workspace_id is not null then
    return existing_workspace_id;
  end if;

  select *
  into current_user
  from auth.users
  where id = auth.uid();

  display_name := coalesce(
    current_user.raw_user_meta_data ->> 'full_name',
    current_user.raw_user_meta_data ->> 'name',
    split_part(coalesce(current_user.email, 'Bloomboard User'), '@', 1)
  );

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    current_user.id,
    current_user.email,
    display_name,
    current_user.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.workspaces (name, owner_id, last_updated_by)
  values (display_name || '''s Workspace', current_user.id, current_user.id)
  returning id into existing_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (existing_workspace_id, current_user.id, 'owner');

  return existing_workspace_id;
end;
$$;

grant execute on function public.ensure_user_workspace() to authenticated;

alter table public.tasks
  add column if not exists project text not null default 'Personal',
  add column if not exists due_label text not null default 'Today',
  add column if not exists accent text not null default 'border-l-blue-400';

alter table public.boards
  add column if not exists category text not null default 'Uncategorized',
  add column if not exists card_count int not null default 0,
  add column if not exists progress int not null default 0,
  add column if not exists accent text not null default 'from-blue-500/25 to-cyan-300/5';

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  schedule text not null default 'Today',
  kind text not null default 'Reminder',
  completed boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

alter table public.reminders enable row level security;

drop policy if exists "reminders workspace read" on public.reminders;
create policy "reminders workspace read"
on public.reminders for select
using (workspace_id in (select public.current_user_workspace_ids()));

drop policy if exists "reminders workspace insert" on public.reminders;
create policy "reminders workspace insert"
on public.reminders for insert
with check (workspace_id in (select public.current_user_workspace_ids()));

drop policy if exists "reminders workspace update" on public.reminders;
create policy "reminders workspace update"
on public.reminders for update
using (workspace_id in (select public.current_user_workspace_ids()))
with check (workspace_id in (select public.current_user_workspace_ids()));

drop trigger if exists set_reminders_updated_at on public.reminders;
create trigger set_reminders_updated_at
before update on public.reminders
for each row execute function public.set_updated_at();

insert into public.profiles (id, email, full_name, avatar_url)
select
  users.id,
  users.email,
  coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name',
    split_part(coalesce(users.email, 'Bloomboard User'), '@', 1)
  ),
  users.raw_user_meta_data ->> 'avatar_url'
from auth.users as users
on conflict (id) do nothing;
