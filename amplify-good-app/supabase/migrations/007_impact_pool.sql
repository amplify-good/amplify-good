create table if not exists public.impact_pool_transactions (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references public.bookings(id) on delete set null,
  amount      numeric not null,
  type        text not null check (type in ('inflow', 'outflow')),
  description text,
  created_at  timestamptz default now() not null
);

-- View for dashboard summary
create or replace view public.impact_pool_summary as
select
  coalesce(sum(case when type = 'inflow'  then amount else 0 end), 0) as total_inflows,
  coalesce(sum(case when type = 'outflow' then amount else 0 end), 0) as total_outflows,
  coalesce(sum(case when type = 'inflow'  then amount else 0 end), 0)
  - coalesce(sum(case when type = 'outflow' then amount else 0 end), 0) as balance
from public.impact_pool_transactions;

-- Trigger: when booking transitions to 'completed', auto-insert impact inflow
create or replace function public.handle_booking_completed()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and (old.status is null or old.status <> 'completed') then
    insert into public.impact_pool_transactions (booking_id, amount, type, description)
    values (
      new.id,
      new.commission_amount,
      'inflow',
      'Commission from booking: ' || new.event_name
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_booking_completed on public.bookings;
create trigger on_booking_completed
  after insert or update of status on public.bookings
  for each row execute procedure public.handle_booking_completed();
