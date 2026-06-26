-- Run once in Supabase SQL editor (Dashboard → SQL → New query)
-- Then set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in your deployment env.

create table if not exists public.demo_emoji_reactions (
  emoji_id text primary key,
  count bigint not null default 0 check (count >= 0)
);

insert into public.demo_emoji_reactions (emoji_id, count) values
  ('love', 0),
  ('fire', 0),
  ('cheer', 0),
  ('rocket', 0),
  ('crown', 0)
on conflict (emoji_id) do nothing;

alter table public.demo_emoji_reactions enable row level security;

create policy "Anyone can read demo reactions"
  on public.demo_emoji_reactions
  for select
  using (true);

create or replace function public.increment_demo_emoji_reaction(p_emoji_id text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  insert into public.demo_emoji_reactions (emoji_id, count)
  values (p_emoji_id, 1)
  on conflict (emoji_id)
  do update set count = public.demo_emoji_reactions.count + 1
  returning count into new_count;

  return new_count;
end;
$$;

grant execute on function public.increment_demo_emoji_reaction(text) to service_role;
