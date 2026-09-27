-- One row per live-demo visit (/api/demo-visit): where the visitor came from,
-- what they said they are here for, which parts they opened, what they searched
-- for and what they asked Bloom. No names, emails, IPs or cookies; the id is a
-- random per-tab value. Read on /demo-insights.
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.demo_visits (
  id uuid primary key,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seconds int not null default 0 check (seconds >= 0),
  actions int not null default 0 check (actions >= 0),
  entry text check (char_length(entry) <= 40),
  source text check (char_length(source) <= 120),
  utm_source text check (char_length(utm_source) <= 80),
  utm_medium text check (char_length(utm_medium) <= 80),
  utm_campaign text check (char_length(utm_campaign) <= 80),
  device text check (char_length(device) <= 20),
  country text check (char_length(country) <= 4),
  interest text check (char_length(interest) <= 40),
  workspaces text[] not null default '{}',
  features text[] not null default '{}',
  searches text[] not null default '{}',
  bloom_asks text[] not null default '{}',
  gates text[] not null default '{}',
  downloaded boolean not null default false,
  download_source text check (char_length(download_source) <= 40)
);

create index if not exists demo_visits_started_at_idx on public.demo_visits (started_at desc);

-- No policies: only the service role (the website's API route) can read or write.
alter table public.demo_visits enable row level security;

-- The browser sends its whole visit each time; the API route has already
-- validated and trimmed every field.
create or replace function public.upsert_demo_visit(p jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.demo_visits as v (
    id, seconds, actions, entry, source, utm_source, utm_medium, utm_campaign, device, country,
    interest, workspaces, features, searches, bloom_asks, gates, downloaded, download_source
  ) values (
    (p->>'id')::uuid,
    coalesce((p->>'seconds')::int, 0),
    coalesce((p->>'actions')::int, 0),
    p->>'entry', p->>'source', p->>'utm_source', p->>'utm_medium', p->>'utm_campaign',
    p->>'device', p->>'country', p->>'interest',
    coalesce(array(select jsonb_array_elements_text(p->'workspaces')), '{}'),
    coalesce(array(select jsonb_array_elements_text(p->'features')), '{}'),
    coalesce(array(select jsonb_array_elements_text(p->'searches')), '{}'),
    coalesce(array(select jsonb_array_elements_text(p->'bloom_asks')), '{}'),
    coalesce(array(select jsonb_array_elements_text(p->'gates')), '{}'),
    coalesce((p->>'downloaded')::boolean, false),
    p->>'download_source'
  )
  on conflict (id) do update set
    updated_at = now(),
    seconds = greatest(v.seconds, excluded.seconds),
    actions = greatest(v.actions, excluded.actions),
    source = coalesce(v.source, excluded.source),
    utm_source = coalesce(v.utm_source, excluded.utm_source),
    utm_medium = coalesce(v.utm_medium, excluded.utm_medium),
    utm_campaign = coalesce(v.utm_campaign, excluded.utm_campaign),
    device = coalesce(excluded.device, v.device),
    country = coalesce(v.country, excluded.country),
    interest = coalesce(excluded.interest, v.interest),
    workspaces = excluded.workspaces,
    features = excluded.features,
    searches = excluded.searches,
    bloom_asks = excluded.bloom_asks,
    gates = excluded.gates,
    downloaded = v.downloaded or excluded.downloaded,
    download_source = coalesce(v.download_source, excluded.download_source);

  -- Keep a year of visits.
  if random() < 0.01 then
    delete from public.demo_visits where started_at < now() - interval '365 days';
  end if;
end;
$$;

revoke all on function public.upsert_demo_visit(jsonb) from public, anon, authenticated;
grant execute on function public.upsert_demo_visit(jsonb) to service_role;
