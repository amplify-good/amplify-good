-- Reset demo data so auth users can be recreated through the Supabase Auth API.
-- Intended only for the demo/staging project.

truncate table
  public.impact_pool_transactions,
  public.bookings,
  public.rsvps,
  public.events,
  public.musician_media_links,
  public.musician_social_links,
  public.musicians,
  public.nonprofits
restart identity cascade;

delete from public.profiles
where id in (
  'ffffffff-ffff-ffff-ffff-fffffffffff2'
);

delete from auth.identities
where user_id in (
  'a0000001-0000-0000-0000-000000000001',
  'a0000002-0000-0000-0000-000000000002',
  'a0000003-0000-0000-0000-000000000003',
  'a0000004-0000-0000-0000-000000000004',
  'a0000005-0000-0000-0000-000000000005',
  'a0000006-0000-0000-0000-000000000006',
  'a0000007-0000-0000-0000-000000000007',
  'ffffffff-ffff-ffff-ffff-fffffffffff2'
);

delete from auth.users
where id in (
  'a0000001-0000-0000-0000-000000000001',
  'a0000002-0000-0000-0000-000000000002',
  'a0000003-0000-0000-0000-000000000003',
  'a0000004-0000-0000-0000-000000000004',
  'a0000005-0000-0000-0000-000000000005',
  'a0000006-0000-0000-0000-000000000006',
  'a0000007-0000-0000-0000-000000000007',
  'ffffffff-ffff-ffff-ffff-fffffffffff2'
);
