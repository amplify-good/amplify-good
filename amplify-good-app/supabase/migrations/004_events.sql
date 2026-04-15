create table if not exists public.events (
  id                  uuid primary key default gen_random_uuid(),
  nonprofit_id        uuid not null references public.nonprofits(id) on delete cascade,
  musician_id         uuid references public.musicians(id) on delete set null,
  name                text not null,
  date_time           timestamptz not null,
  venue               text not null,
  vibe                text,
  expected_attendance int,
  genre_pref          text,
  description         text,
  short_description   text,
  cause               text,
  status              text not null check (status in ('upcoming', 'completed', 'draft')) default 'draft',
  rsvp_count          int default 0 not null,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);
