create table if not exists public.rsvps (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(event_id, user_id)
);

-- Trigger to keep events.rsvp_count in sync
create or replace function public.update_rsvp_count()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    update public.events set rsvp_count = rsvp_count + 1 where id = new.event_id;
  elsif (tg_op = 'DELETE') then
    update public.events set rsvp_count = greatest(rsvp_count - 1, 0) where id = old.event_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_rsvp_change on public.rsvps;
create trigger on_rsvp_change
  after insert or delete on public.rsvps
  for each row execute procedure public.update_rsvp_count();
