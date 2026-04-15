-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.musicians enable row level security;
alter table public.musician_media_links enable row level security;
alter table public.musician_social_links enable row level security;
alter table public.nonprofits enable row level security;
alter table public.events enable row level security;
alter table public.rsvps enable row level security;
alter table public.bookings enable row level security;
alter table public.impact_pool_transactions enable row level security;

-- ── profiles ────────────────────────────────────────────────────────────────
create policy "profiles_select_any_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ── musicians ───────────────────────────────────────────────────────────────
create policy "musicians_select_public"
  on public.musicians for select
  using (true);

create policy "musicians_insert_own"
  on public.musicians for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "musicians_update_own"
  on public.musicians for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── musician_media_links ────────────────────────────────────────────────────
create policy "media_links_select_public"
  on public.musician_media_links for select
  using (true);

create policy "media_links_manage_own"
  on public.musician_media_links for all
  to authenticated
  using (
    musician_id in (
      select id from public.musicians where user_id = auth.uid()
    )
  );

-- ── musician_social_links ───────────────────────────────────────────────────
create policy "social_links_select_public"
  on public.musician_social_links for select
  using (true);

create policy "social_links_manage_own"
  on public.musician_social_links for all
  to authenticated
  using (
    musician_id in (
      select id from public.musicians where user_id = auth.uid()
    )
  );

-- ── nonprofits ──────────────────────────────────────────────────────────────
create policy "nonprofits_select_public"
  on public.nonprofits for select
  using (true);

create policy "nonprofits_insert_own"
  on public.nonprofits for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "nonprofits_update_own"
  on public.nonprofits for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── events ──────────────────────────────────────────────────────────────────
-- Public can see non-draft events; nonprofit owner sees their drafts
create policy "events_select_public"
  on public.events for select
  using (
    status <> 'draft'
    or nonprofit_id in (
      select id from public.nonprofits where user_id = auth.uid()
    )
  );

create policy "events_insert_nonprofit"
  on public.events for insert
  to authenticated
  with check (
    nonprofit_id in (
      select id from public.nonprofits where user_id = auth.uid()
    )
  );

create policy "events_update_own_nonprofit"
  on public.events for update
  to authenticated
  using (
    nonprofit_id in (
      select id from public.nonprofits where user_id = auth.uid()
    )
  );

create policy "events_delete_own_draft"
  on public.events for delete
  to authenticated
  using (
    status = 'draft'
    and nonprofit_id in (
      select id from public.nonprofits where user_id = auth.uid()
    )
  );

-- ── rsvps ───────────────────────────────────────────────────────────────────
create policy "rsvps_select_own_or_nonprofit"
  on public.rsvps for select
  to authenticated
  using (
    user_id = auth.uid()
    or event_id in (
      select id from public.events where nonprofit_id in (
        select id from public.nonprofits where user_id = auth.uid()
      )
    )
  );

create policy "rsvps_insert_community"
  on public.rsvps for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "rsvps_delete_own"
  on public.rsvps for delete
  to authenticated
  using (user_id = auth.uid());

-- ── bookings ────────────────────────────────────────────────────────────────
-- Musician sees their bookings; community member sees their own bookings
create policy "bookings_select_own"
  on public.bookings for select
  to authenticated
  using (
    community_member_id = auth.uid()
    or musician_id in (
      select id from public.musicians where user_id = auth.uid()
    )
  );

create policy "bookings_insert_community"
  on public.bookings for insert
  to authenticated
  with check (community_member_id = auth.uid());

-- Musician can update status (accept/decline); community member can cancel
create policy "bookings_update_status"
  on public.bookings for update
  to authenticated
  using (
    community_member_id = auth.uid()
    or musician_id in (
      select id from public.musicians where user_id = auth.uid()
    )
  );

-- ── impact_pool_transactions ────────────────────────────────────────────────
create policy "impact_transactions_select_authenticated"
  on public.impact_pool_transactions for select
  to authenticated
  using (true);

-- Only service role can insert/update/delete (done via triggers)
-- No insert/update/delete policies for authenticated users
