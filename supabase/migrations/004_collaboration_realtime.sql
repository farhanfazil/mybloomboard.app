do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end
$$;

create index if not exists team_members_workspace_active_idx
  on public.team_members (workspace_id, created_at)
  where deleted_at is null;

create index if not exists conversations_workspace_active_idx
  on public.conversations (workspace_id, created_at)
  where deleted_at is null;
