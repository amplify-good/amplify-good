create table if not exists public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  musician_id         uuid not null references public.musicians(id),
  community_member_id uuid not null references public.profiles(id),
  event_name          text not null,
  event_date          timestamptz not null,
  location            text,
  duration            text,
  musician_rate       numeric not null,
  commission_amount   numeric not null,
  total_charged       numeric not null,
  status              text not null check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  message             text,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);
