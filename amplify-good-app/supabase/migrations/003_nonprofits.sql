create table if not exists public.nonprofits (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique references public.profiles(id) on delete cascade,
  name          text not null,
  bio           text,
  website       text,
  logo_url      text,
  contact_email text,
  cause         text,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
