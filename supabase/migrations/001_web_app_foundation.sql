create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null default 'Free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create or replace function public.current_user_workspace_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select workspace_id from public.workspace_members where user_id = auth.uid()
$$;

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  preferences jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  device_name text,
  platform text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  monthly_price numeric(10,2),
  yearly_price numeric(10,2),
  entitlements jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.plans (code, name, monthly_price, yearly_price, entitlements)
values
  ('free', 'Free', 0, 0, '{"boards":5,"ai":"trial"}'),
  ('flow', 'Flow', 7.99, 76.99, '{"boards":10,"freelance":true}'),
  ('bloom', 'Bloom', 15.99, 153.99, '{"boards":"unlimited","ai":"unlimited","freelance":true}'),
  ('team', 'Team', 14.99, 143.90, '{"team":true,"seats":50}')
on conflict (code) do update
set name = excluded.name,
    monthly_price = excluded.monthly_price,
    yearly_price = excluded.yearly_price,
    entitlements = excluded.entitlements;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_code text not null references public.plans(code),
  provider text not null default 'polar',
  provider_subscription_id text,
  status text not null default 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}',
  source text not null default 'plan',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, key)
);

create table if not exists public.polar_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  bucket text not null,
  object_key text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending',
  priority text,
  due_at timestamptz,
  mood text,
  created_by uuid references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.subtasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  title text not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  body text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  file_id uuid not null references public.files(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_history (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.task_reminders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  reminder_at timestamptz not null,
  status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  cover_file_id uuid references public.files(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.board_columns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.board_cards (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  column_id uuid references public.board_columns(id) on delete set null,
  title text not null,
  description text,
  position int not null default 0,
  assigned_to uuid references public.profiles(id),
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.card_comments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  card_id uuid not null references public.board_cards(id) on delete cascade,
  body text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.card_attachments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  card_id uuid not null references public.board_cards(id) on delete cascade,
  file_id uuid not null references public.files(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  display_name text not null,
  email text,
  role text not null default 'member',
  status text not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.member_reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  member_id uuid references public.team_members(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  metrics jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.performance_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  member_id uuid references public.team_members(id) on delete cascade,
  snapshot_at timestamptz not null default now(),
  metrics jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.workload_health_signals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  member_id uuid references public.team_members(id) on delete cascade,
  severity text not null default 'info',
  title text not null,
  detail text,
  private_to_manager boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  type text not null default 'direct',
  title text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  member_id uuid references public.team_members(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  body text,
  message_type text not null default 'text',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  message_id uuid not null references public.messages(id) on delete cascade,
  file_id uuid not null references public.files(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.voice_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  file_id uuid references public.files(id) on delete set null,
  duration_seconds int,
  transcript text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id),
  feature text not null,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  status text not null default 'completed',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.ai_outputs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id),
  feature text not null,
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.daily_recaps (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  recap_date date not null,
  summary text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, recap_date)
);

create table if not exists public.chief_of_staff_signals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  detail text,
  severity text not null default 'info',
  source_table text,
  source_id uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_plan_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id),
  plan_date date not null,
  output jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  email text,
  company text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  status text not null default 'active',
  budget numeric(10,2),
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.client_portals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.client_projects(id) on delete cascade,
  slug text not null unique,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.revisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.client_projects(id) on delete cascade,
  title text not null,
  status text not null default 'open',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.client_projects(id) on delete cascade,
  file_id uuid references public.files(id) on delete set null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.client_projects(id) on delete set null,
  invoice_number text,
  status text not null default 'draft',
  amount numeric(10,2) not null default 0,
  due_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.client_projects(id) on delete set null,
  title text not null,
  status text not null default 'draft',
  content jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.client_projects(id) on delete set null,
  title text not null,
  status text not null default 'draft',
  content jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_updated_by uuid references public.profiles(id),
  sync_version bigint not null default 1
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_table text,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles','workspaces','workspace_members','user_settings','devices','plans','subscriptions','entitlements',
    'files','tasks','subtasks','task_comments','task_attachments','task_history','task_reminders',
    'boards','board_columns','board_cards','card_comments','card_attachments',
    'team_members','member_reports','performance_snapshots','workload_health_signals',
    'conversations','conversation_members','messages','message_attachments','voice_messages',
    'ai_usage_events','ai_outputs','daily_recaps','chief_of_staff_signals','ai_plan_sessions',
    'clients','client_projects','client_portals','revisions','assets','invoices','contracts','proposals',
    'notifications','activity_log'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'user_settings','devices','subscriptions','entitlements','files','tasks','subtasks','task_comments',
    'task_attachments','task_history','task_reminders','boards','board_columns','board_cards','card_comments',
    'card_attachments','team_members','member_reports','performance_snapshots','workload_health_signals',
    'conversations','conversation_members','messages','message_attachments','voice_messages','ai_usage_events',
    'ai_outputs','daily_recaps','chief_of_staff_signals','ai_plan_sessions','clients','client_projects',
    'client_portals','revisions','assets','invoices','contracts','proposals','notifications','activity_log'
  ] loop
    execute format(
      'create policy "%1$I workspace read" on public.%1$I for select using (workspace_id in (select public.current_user_workspace_ids()))',
      table_name
    );
    execute format(
      'create policy "%1$I workspace insert" on public.%1$I for insert with check (workspace_id in (select public.current_user_workspace_ids()))',
      table_name
    );
    execute format(
      'create policy "%1$I workspace update" on public.%1$I for update using (workspace_id in (select public.current_user_workspace_ids())) with check (workspace_id in (select public.current_user_workspace_ids()))',
      table_name
    );
  end loop;
end $$;

create policy "profiles self read"
on public.profiles for select
using (id = auth.uid());

create policy "profiles self update"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "workspaces member read"
on public.workspaces for select
using (id in (select public.current_user_workspace_ids()));

create policy "workspace_members member read"
on public.workspace_members for select
using (workspace_id in (select public.current_user_workspace_ids()));

create policy "plans public read"
on public.plans for select
using (true);

create policy "polar events service only"
on public.polar_events for all
using (false)
with check (false);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles','workspaces','workspace_members','user_settings','devices','plans','subscriptions','entitlements',
    'files','tasks','subtasks','task_comments','task_attachments','task_reminders','boards','board_columns',
    'board_cards','card_comments','card_attachments','team_members','member_reports','workload_health_signals',
    'conversations','messages','voice_messages','ai_outputs','daily_recaps','chief_of_staff_signals',
    'ai_plan_sessions','clients','client_projects','client_portals','revisions','assets','invoices','contracts',
    'proposals','notifications'
  ] loop
    execute format('drop trigger if exists set_%1$I_updated_at on public.%1$I', table_name);
    execute format(
      'create trigger set_%1$I_updated_at before update on public.%1$I for each row execute function public.set_updated_at()',
      table_name
    );
  end loop;
end $$;
