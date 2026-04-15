create table if not exists public.musicians (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique references public.profiles(id) on delete cascade,
  name        text not null,
  bio         text,
  genres      text[] default '{}',
  photo_url   text,
  rate        numeric not null,
  rate_type   text not null check (rate_type in ('per_event', 'hourly')),
  available   boolean default true not null,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

create table if not exists public.musician_media_links (
  id          uuid primary key default gen_random_uuid(),
  musician_id uuid not null references public.musicians(id) on delete cascade,
  type        text not null check (type in ('spotify', 'youtube', 'soundcloud')),
  url         text not null,
  label       text not null,
  sort_order  int default 0 not null
);

create table if not exists public.musician_social_links (
  id          uuid primary key default gen_random_uuid(),
  musician_id uuid not null references public.musicians(id) on delete cascade,
  platform    text not null,
  url         text not null,
  sort_order  int default 0 not null
);
