create or replace function public.has_workspace_role(
  target_workspace_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = auth.uid()
      and role = any(allowed_roles)
  )
$$;

create or replace function public.is_conversation_member(target_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversation_members
    where conversation_id = target_conversation_id
      and user_id = auth.uid()
  )
$$;

create table if not exists public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role text not null default 'member'
    check (role in ('owner', 'manager', 'member', 'client')),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'expired', 'revoked')),
  invited_by uuid not null references public.profiles(id),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, email)
);

create table if not exists public.mentions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  mentioned_user_id uuid not null references public.profiles(id) on delete cascade,
  mentioned_by uuid not null references public.profiles(id) on delete cascade,
  entity_table text not null
    check (entity_table in ('messages', 'task_comments', 'card_comments')),
  entity_id uuid not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists workspace_invitations_workspace_idx
  on public.workspace_invitations (workspace_id, status);

create index if not exists conversation_members_user_idx
  on public.conversation_members (user_id, conversation_id);

create unique index if not exists conversation_members_unique_user_idx
  on public.conversation_members (conversation_id, user_id)
  where user_id is not null;

create unique index if not exists conversation_members_unique_member_idx
  on public.conversation_members (conversation_id, member_id)
  where member_id is not null;

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at desc)
  where deleted_at is null;

create index if not exists mentions_user_unread_idx
  on public.mentions (mentioned_user_id, created_at desc)
  where read_at is null;

alter table public.workspace_invitations enable row level security;
alter table public.mentions enable row level security;

drop policy if exists "workspace_invitations manager read" on public.workspace_invitations;
create policy "workspace_invitations manager read"
on public.workspace_invitations for select
using (public.has_workspace_role(workspace_id, array['owner', 'manager']));

drop policy if exists "workspace_invitations manager insert" on public.workspace_invitations;
create policy "workspace_invitations manager insert"
on public.workspace_invitations for insert
with check (
  public.has_workspace_role(workspace_id, array['owner', 'manager'])
  and invited_by = auth.uid()
);

drop policy if exists "workspace_invitations manager update" on public.workspace_invitations;
create policy "workspace_invitations manager update"
on public.workspace_invitations for update
using (public.has_workspace_role(workspace_id, array['owner', 'manager']))
with check (public.has_workspace_role(workspace_id, array['owner', 'manager']));

drop policy if exists "mentions participant read" on public.mentions;
create policy "mentions participant read"
on public.mentions for select
using (
  mentioned_user_id = auth.uid()
  or mentioned_by = auth.uid()
);

drop policy if exists "mentions workspace insert" on public.mentions;
create policy "mentions workspace insert"
on public.mentions for insert
with check (
  workspace_id in (select public.current_user_workspace_ids())
  and mentioned_by = auth.uid()
);

drop policy if exists "mentions recipient update" on public.mentions;
create policy "mentions recipient update"
on public.mentions for update
using (mentioned_user_id = auth.uid())
with check (mentioned_user_id = auth.uid());

drop policy if exists "workload_health_signals workspace read" on public.workload_health_signals;
drop policy if exists "workload_health_signals workspace insert" on public.workload_health_signals;
drop policy if exists "workload_health_signals workspace update" on public.workload_health_signals;

create policy "workload signals manager read"
on public.workload_health_signals for select
using (public.has_workspace_role(workspace_id, array['owner', 'manager']));

create policy "workload signals manager insert"
on public.workload_health_signals for insert
with check (public.has_workspace_role(workspace_id, array['owner', 'manager']));

create policy "workload signals manager update"
on public.workload_health_signals for update
using (public.has_workspace_role(workspace_id, array['owner', 'manager']))
with check (public.has_workspace_role(workspace_id, array['owner', 'manager']));

drop policy if exists "conversations workspace read" on public.conversations;
drop policy if exists "messages workspace read" on public.messages;
drop policy if exists "messages workspace insert" on public.messages;
drop policy if exists "messages workspace update" on public.messages;

create policy "conversations participant read"
on public.conversations for select
using (
  public.is_conversation_member(id)
  or (
    type = 'channel'
    and workspace_id in (select public.current_user_workspace_ids())
  )
);

create policy "messages participant read"
on public.messages for select
using (
  public.is_conversation_member(conversation_id)
  or exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.type = 'channel'
      and conversations.workspace_id in (select public.current_user_workspace_ids())
  )
);

create policy "messages participant insert"
on public.messages for insert
with check (
  created_by = auth.uid()
  and (
    public.is_conversation_member(conversation_id)
    or exists (
      select 1
      from public.conversations
      where conversations.id = messages.conversation_id
        and conversations.type = 'channel'
        and conversations.workspace_id in (select public.current_user_workspace_ids())
    )
  )
);

create policy "messages author update"
on public.messages for update
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop trigger if exists set_workspace_invitations_updated_at on public.workspace_invitations;
create trigger set_workspace_invitations_updated_at
before update on public.workspace_invitations
for each row execute function public.set_updated_at();
