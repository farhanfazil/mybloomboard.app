-- Anonymous usage counts for the live web demo (/api/demo-events).
-- One row per day per event name; no visitor ids or personal data.
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.demo_event_counts (
  day date not null default current_date,
  event text not null check (char_length(event) <= 60),
  count bigint not null default 0 check (count >= 0),
  primary key (day, event)
);

-- No policies: only the service role (the website's API route) can read or write.
alter table public.demo_event_counts enable row level security;

create or replace function public.increment_demo_events(p_events jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.demo_event_counts (day, event, count)
  select current_date, key, least(greatest(value::bigint, 0), 50)
  from jsonb_each_text(p_events)
  where key ~ '^[a-z_]+:[a-z0-9_]{1,40}$'
  on conflict (day, event)
  do update set count = public.demo_event_counts.count + excluded.count;
end;
$$;

revoke all on function public.increment_demo_events(jsonb) from public, anon, authenticated;
grant execute on function public.increment_demo_events(jsonb) to service_role;

-- Handy views of the numbers:
--   select event, sum(count) from demo_event_counts group by event order by 2 desc;
--   select * from demo_event_counts where event like 'download:%' order by day desc;
