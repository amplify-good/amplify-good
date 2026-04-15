-- Seed application data only.
-- Demo auth users must be created separately via scripts/seed-demo-auth-users.js
-- so they are real Supabase Auth users and can sign in successfully.

-- We use fixed UUIDs so the seed is idempotent.
do $$
declare
  uid_musician   uuid := 'a0000001-0000-0000-0000-000000000001';
  uid_nonprofit  uuid := 'a0000002-0000-0000-0000-000000000002';
  uid_community1 uuid := 'a0000003-0000-0000-0000-000000000003';
  uid_community2 uuid := 'a0000004-0000-0000-0000-000000000004';

  -- musician IDs
  mid1 uuid := 'b0000001-0000-0000-0000-000000000001';
  mid2 uuid := 'b0000002-0000-0000-0000-000000000002';
  mid3 uuid := 'b0000003-0000-0000-0000-000000000003';
  mid4 uuid := 'b0000004-0000-0000-0000-000000000004';
  mid5 uuid := 'b0000005-0000-0000-0000-000000000005';

  -- nonprofit IDs
  nid1 uuid := 'c0000001-0000-0000-0000-000000000001';
  nid2 uuid := 'c0000002-0000-0000-0000-000000000002';
  nid3 uuid := 'c0000003-0000-0000-0000-000000000003';
  nid4 uuid := 'c0000004-0000-0000-0000-000000000004';
  nid5 uuid := 'c0000005-0000-0000-0000-000000000005';

  -- event IDs
  eid1 uuid := 'd0000001-0000-0000-0000-000000000001';
  eid2 uuid := 'd0000002-0000-0000-0000-000000000002';
  eid3 uuid := 'd0000003-0000-0000-0000-000000000003';
  eid4 uuid := 'd0000004-0000-0000-0000-000000000004';
  eid5 uuid := 'd0000005-0000-0000-0000-000000000005';
  eid6 uuid := 'd0000006-0000-0000-0000-000000000006';
  eid7 uuid := 'd0000007-0000-0000-0000-000000000007';

  -- booking IDs
  bid1 uuid := 'e0000001-0000-0000-0000-000000000001';
  bid2 uuid := 'e0000002-0000-0000-0000-000000000002';
  bid3 uuid := 'e0000003-0000-0000-0000-000000000003';
  bid4 uuid := 'e0000004-0000-0000-0000-000000000004';
  bid5 uuid := 'e0000005-0000-0000-0000-000000000005';
  bid6 uuid := 'e0000006-0000-0000-0000-000000000006';
  bid7 uuid := 'e0000007-0000-0000-0000-000000000007';
  bid8 uuid := 'e0000008-0000-0000-0000-000000000008';
  bid9 uuid := 'e0000009-0000-0000-0000-000000000009';

begin

  -- ── Musicians ─────────────────────────────────────────────────────────────
  insert into public.musicians (id, user_id, name, bio, genres, photo_url, rate, rate_type, available)
  values
    (mid1, uid_musician,  'Los Topo Chicos',          'Austin''s hottest Latin-fusion ensemble blending cumbia, son jarocho, and psychedelic rock. Born out of late-night jams on East 6th, Los Topo Chicos bring the kind of energy that turns strangers into dance partners.', array['Latin','Rock','Folk'],       '/images/icons/musician_profile_window_icon.png', 500, 'per_event', true),
    (mid2, null,          'Nia Waters',               'Jazz vocalist and pianist who grew up singing in her grandmother''s church in East Austin. Nia''s sound is a velvet collision of neo-soul, jazz standards, and original compositions about love, loss, and living in a city that keeps changing.', array['Jazz','R&B'],              '/images/icons/musician_profile_window_icon.png', 350, 'per_event', true),
    (mid3, null,          'Dusty Creek Revival',      'Four-piece Americana band that sounds like a Hill Country sunset feels. Fiddle-driven folk with a country heartbeat and lyrics that tell stories about Texas — the real Texas, not the postcard version.', array['Folk','Country','Blues'],   '/images/icons/musician_profile_window_icon.png', 400, 'per_event', true),
    (mid4, null,          'DJ Amara Sol',             'Electronic producer and DJ who fuses Afrobeats, house, and Austin''s underground electronic scene into sets that don''t let you stand still. Resident at Kingdom and regular at SXSW showcases.', array['Electronic','Hip-Hop'],    '/images/icons/musician_profile_window_icon.png',  75, 'hourly',    true),
    (mid5, null,          'Marcus & the Burning Oaks','Blues-rock power trio led by guitarist Marcus Coleman, whose playing has been compared to Gary Clark Jr. meets Hendrix. They''ve headlined the Continental Club and opened for Black Pumas. Raw, loud, and unapologetically Austin.', array['Blues','Rock'],            '/images/icons/musician_profile_window_icon.png', 600, 'per_event', true)
  on conflict (id) do nothing;

  -- Media links
  insert into public.musician_media_links (musician_id, type, url, label, sort_order)
  values
    (mid1, 'spotify',    'https://open.spotify.com/artist/example1', 'Cumbia del Barrio',    0),
    (mid1, 'youtube',    'https://youtube.com/watch?v=example1',     'Live at Mohawk',       1),
    (mid2, 'spotify',    'https://open.spotify.com/artist/example2', 'Riverside Sessions',   0),
    (mid2, 'soundcloud', 'https://soundcloud.com/niawaters/sunday',  'Sunday Morning',       1),
    (mid3, 'youtube',    'https://youtube.com/watch?v=example3',     'Porch Sessions Vol. 2',0),
    (mid3, 'spotify',    'https://open.spotify.com/artist/example3', 'Red Dirt Lullaby',     1),
    (mid4, 'soundcloud', 'https://soundcloud.com/amarasol/nightshift','Night Shift Mix',     0),
    (mid4, 'youtube',    'https://youtube.com/watch?v=example4',     'Kingdom Live Set',     1),
    (mid5, 'spotify',    'https://open.spotify.com/artist/example5', 'Thunderbird',          0),
    (mid5, 'youtube',    'https://youtube.com/watch?v=example5',     'Continental Club 2024',1)
  on conflict do nothing;

  -- Social links
  insert into public.musician_social_links (musician_id, platform, url, sort_order)
  values
    (mid1, 'instagram', 'https://instagram.com/lostopochicos',    0),
    (mid1, 'twitter',   'https://twitter.com/lostopochicos',      1),
    (mid2, 'instagram', 'https://instagram.com/niawaters',        0),
    (mid2, 'website',   'https://niawaters.com',                  1),
    (mid3, 'instagram', 'https://instagram.com/dustycreekrevival',0),
    (mid3, 'facebook',  'https://facebook.com/dustycreekrevival', 1),
    (mid4, 'instagram', 'https://instagram.com/djamarasol',       0),
    (mid4, 'tiktok',    'https://tiktok.com/@djamarasol',         1),
    (mid5, 'instagram', 'https://instagram.com/burningoaks',      0),
    (mid5, 'twitter',   'https://twitter.com/burningoaks',        1)
  on conflict do nothing;

  -- ── Nonprofits ────────────────────────────────────────────────────────────
  insert into public.nonprofits (id, user_id, name, bio, website, logo_url, contact_email, cause)
  values
    (nid1, uid_nonprofit, 'Austin Food Bank',               'Fighting hunger in Central Texas by distributing meals to families, seniors, and children in need. Last year we served over 50 million meals across 21 counties.',                                                      'https://austinfoodbank.org',   '/images/icons/hands_heart_window_icon.png', 'events@austinfoodbank.org', 'Healthcare'),
    (nid2, null,          'HAAM - Health Alliance for Austin Musicians', 'Providing access to affordable healthcare for Austin''s low-income, uninsured working musicians. Because you can''t make music if you can''t take care of yourself.',                               'https://myhaam.org',           '/images/icons/hands_heart_window_icon.png', 'events@myhaam.org',         'Arts & Culture'),
    (nid3, null,          'Austin Pets Alive!',             'No-kill animal rescue dedicated to saving Austin''s most at-risk shelter animals. We pioneered programs that have saved over 100,000 lives and made Austin the largest no-kill city in the nation.',                   'https://austinpetsalive.org',  '/images/icons/hands_heart_window_icon.png', 'events@austinpetsalive.org','Animal Rescue'),
    (nid4, null,          'Youth Arts Coalition ATX',       'Empowering underserved Austin youth through free music lessons, visual arts workshops, and performance opportunities. Every kid deserves a stage.',                                                                    'https://youtharts-atx.org',    '/images/icons/hands_heart_window_icon.png', 'info@youtharts-atx.org',    'Youth'),
    (nid5, null,          'Barton Springs Conservancy',     'Protecting and preserving Barton Springs and the Edwards Aquifer for future generations. Restoring the ecological heart of Austin through community science and advocacy.',                                            'https://bartonsprings.org',    '/images/icons/hands_heart_window_icon.png', 'events@bartonsprings.org',  'Environment')
  on conflict (id) do nothing;

  -- ── Events ────────────────────────────────────────────────────────────────
  insert into public.events (id, nonprofit_id, musician_id, name, date_time, venue, vibe, expected_attendance, genre_pref, description, short_description, cause, status, rsvp_count)
  values
    (eid1, nid1, mid2, 'Feed the City Gala',            '2026-06-14T18:00:00Z', 'The Driskill Hotel, 604 Brazos St',                  'Elegant evening gala with live music and a seated dinner',           250, 'Jazz',       'Austin Food Bank''s annual fundraiser bringing together donors, volunteers, and community leaders for an evening of fine dining, live jazz, and impact stories. Every dollar raised goes directly to fighting hunger in Central Texas.',    'Supporting Austin Food Bank''s fight against hunger in Central Texas.',               'Healthcare',     'upcoming',   187),
    (eid2, nid3, mid3, 'Paws & Play Block Party',       '2026-06-21T12:00:00Z', 'Republic Square Park, 422 Guadalupe St',             'Casual outdoor block party with adoptable animals',                  500, 'Folk',       'A family-friendly afternoon of live music, food trucks, and adorable adoptable pets. Come for the music, leave with a new best friend. All proceeds support Austin Pets Alive!''s rescue operations.',                                       'Supporting Austin Pets Alive!''s animal rescue and adoption programs.',              'Animal Rescue',  'upcoming',   324),
    (eid3, nid4, mid4, 'Youth Showcase: Next Gen ATX',  '2026-07-04T16:00:00Z', 'Mohawk Austin, 912 Red River St',                    'High-energy youth talent showcase with headliner',                   300, 'Hip-Hop',    'Young musicians from Youth Arts Coalition take the stage alongside a headlining act. This is their moment — come witness the next generation of Austin''s music scene and support the programs that made it possible.',                        'Supporting Youth Arts Coalition''s music programs for the next generation.',         'Youth',          'upcoming',   156),
    (eid4, nid5, null, 'Sunset on the Springs',         '2026-07-18T17:00:00Z', 'Zilker Botanical Garden, 2220 Barton Springs Rd',    'Relaxed sunset concert in the garden',                               200, 'Folk',       'An evening of acoustic music surrounded by nature at Zilker Botanical Garden. Enjoy local food vendors, craft beverages, and the sounds of Hill Country folk as the sun sets over Austin.',                                               'Supporting environmental conservation and green spaces across Austin.',               'Environment',    'upcoming',   89),
    (eid5, nid2, mid5, 'HAAM Benefit: Notes for Health', '2026-05-10T19:00:00Z', 'ACL Live at The Moody Theater, 310 W Willie Nelson Blvd', 'Concert-style benefit with multiple acts',                      400, 'Blues',      'An electrifying night of blues and rock at the Moody Theater, raising funds to keep Austin''s musicians healthy. Featuring Marcus & the Burning Oaks headlining with special guests.',                                                   'Supporting HAAM''s healthcare access for Austin''s working musicians.',               'Arts & Culture', 'upcoming',   378),
    (eid6, nid1, mid1, 'Summer Meals Kickoff Cookout',   '2026-08-02T11:00:00Z', 'Givens District Park, 3811 E 12th St',               'Family-friendly outdoor cookout with live Latin music',               350, 'Latin',      'Austin Food Bank''s summer meals program launch. Free food distribution, live music, kids'' activities, and community resources. Come eat, dance, and help us fight hunger all summer long.',                                          'Supporting Austin Food Bank''s summer meals program for kids in need.',              'Healthcare',     'upcoming',   142),
    (eid7, nid4, null, 'Back to School Benefit Concert', '2026-08-22T18:00:00Z', 'The Parish, 214 E 6th St',                           'High-energy all-ages concert with electronic and hip-hop',            250, 'Electronic', 'Raising funds for Youth Arts Coalition''s back-to-school music equipment drive. DJ sets, student showcases, and a headlining performance. All ages welcome.',                                                                           'Supporting Youth Arts Coalition''s back-to-school music equipment drive.',           'Youth',          'draft',      0)
  on conflict (id) do nothing;

  -- ── Bookings ──────────────────────────────────────────────────────────────
  insert into public.bookings (id, musician_id, community_member_id, event_name, event_date, location, duration, musician_rate, commission_amount, total_charged, status, message)
  values
    (bid1, mid1, uid_community1, 'Torres Family Reunion BBQ',      '2026-06-28T14:00:00Z', 'Mueller Lake Park Pavilion',               '3 hours', 500, 75,   575,   'confirmed',  'We''d love a mix of cumbia and classic rock for a multigenerational crowd. About 80 people, outdoor setting with a covered pavilion.'),
    (bid2, mid2, uid_community2, 'Chen-Williams Wedding Reception', '2026-05-03T17:00:00Z', 'Hotel Saint Cecilia, 112 Academy Dr',      '4 hours', 350, 52.5, 402.5, 'confirmed',  'Looking for elegant jazz and neo-soul for our wedding reception. Cocktail hour into dinner — about 120 guests, intimate garden setting.'),
    (bid3, mid5, 'a0000007-0000-0000-0000-000000000007', 'Launch Party: TechRise Demo Day',  '2026-07-12T19:00:00Z', 'Brazos Hall, 204 E 4th St',               '2 hours', 600, 90,   690,   'pending',    'High-energy blues-rock set for our startup demo day after-party. ~200 attendees, tech crowd that wants to let loose.'),
    (bid4, mid3, uid_community2, 'Hill Country Corporate Retreat',  '2026-06-07T15:00:00Z', 'Dripping Springs Ranch, Hwy 290',         '3 hours', 400, 60,   460,   'confirmed',  'Acoustic folk and country for an outdoor corporate retreat. Casual ranch setting, about 60 people, sunset session.'),
    (bid5, mid4, 'a0000007-0000-0000-0000-000000000007', 'SXSW Afterparty: Amplify After Dark', '2026-03-15T22:00:00Z', 'Kingdom, 5th & Red River',             '4 hours', 300, 45,   345,   'completed',  'High-energy DJ set for our SXSW afterparty. Full production setup, 300+ capacity, we want the place jumping.'),
    (bid6, mid1, 'a0000005-0000-0000-0000-000000000005', 'Quinceañera de Sofia',              '2026-04-19T18:00:00Z', 'Fiesta Gardens, 2101 Jesse E Segovia St','4 hours', 500, 75,   575,   'confirmed',  'Traditional and modern Latin music for a quinceañera celebration. About 150 guests, outdoor pavilion by the lake.'),
    (bid7, mid1, 'a0000006-0000-0000-0000-000000000006', 'Brewery Grand Opening',             '2026-07-05T16:00:00Z', 'East Side Brewing, 1201 E 6th St',        '3 hours', 500, 75,   575,   'pending',    'Looking for high-energy Latin fusion to kick off our grand opening. Food trucks, 200+ expected, outdoor beer garden.'),
    (bid8, mid2, uid_community1, 'Jazz Night at Springdale Social',  '2026-08-15T20:00:00Z', 'Springdale General, 1023 Springdale Rd',  '2 hours', 350, 52.5, 402.5, 'confirmed',  'Intimate jazz night for a small crowd. 40-50 people, indoor venue, cocktails and candles.'),
    (bid9, mid5, uid_community2, '40th Birthday Blowout',            '2026-09-20T19:00:00Z', 'Stubb''s BBQ, 801 Red River St',           '3 hours', 600, 90,   690,   'pending',    'Blues and rock for a milestone birthday party. About 100 guests, Stubb''s indoor stage, full band setup.')
  on conflict (id) do nothing;

  -- ── RSVPs ────────────────────────────────────────────────────────────────
  -- Seed real RSVP rows for demo users so the trigger-maintained counts are accurate.
  -- We insert rows, then reset rsvp_count to the actual row count per event.
  insert into public.rsvps (event_id, user_id)
  values
    -- Feed the City Gala (eid1)
    (eid1, uid_community1),
    (eid1, uid_community2),
    (eid1, 'a0000005-0000-0000-0000-000000000005'),
    -- Paws & Play Block Party (eid2)
    (eid2, uid_community1),
    (eid2, uid_community2),
    (eid2, 'a0000005-0000-0000-0000-000000000005'),
    (eid2, 'a0000006-0000-0000-0000-000000000006'),
    (eid2, 'a0000007-0000-0000-0000-000000000007'),
    -- Youth Showcase (eid3)
    (eid3, uid_community1),
    (eid3, 'a0000007-0000-0000-0000-000000000007'),
    -- Sunset on the Springs (eid4)
    (eid4, uid_community2),
    (eid4, 'a0000005-0000-0000-0000-000000000005'),
    -- HAAM Benefit (eid5)
    (eid5, uid_community1),
    (eid5, uid_community2),
    (eid5, 'a0000005-0000-0000-0000-000000000005'),
    (eid5, 'a0000006-0000-0000-0000-000000000006'),
    -- Summer Meals Kickoff (eid6)
    (eid6, uid_community1),
    (eid6, 'a0000006-0000-0000-0000-000000000006'),
    (eid6, 'a0000007-0000-0000-0000-000000000007')
  on conflict do nothing;

  -- Reset rsvp_count to match actual RSVP rows (trigger already incremented
  -- during the inserts above, but the events were seeded with hard-coded counts,
  -- so we reconcile here).
  update public.events e
  set rsvp_count = (select count(*) from public.rsvps r where r.event_id = e.id);

  -- ── Impact Pool Transactions ───────────────────────────────────────────────
  -- Seed completed booking commissions as inflows
  insert into public.impact_pool_transactions (booking_id, amount, type, description)
  values
    (bid2, 52.5, 'inflow',  'Commission from booking: Chen-Williams Wedding Reception'),
    (bid5, 45.0, 'inflow',  'Commission from booking: SXSW Afterparty: Amplify After Dark'),
    (bid6, 75.0, 'inflow',  'Commission from booking: Quinceañera de Sofia')
  on conflict do nothing;

  -- Seed outflows (disbursements to nonprofits) totaling $1,150 - $172.5 inflow = need more
  -- Total inflows in prototype: $1835, outflows: $1150, balance: $685
  -- Add additional historical inflows to match prototype totals
  insert into public.impact_pool_transactions (amount, type, description)
  values
    (200.0, 'inflow',  'Historical: Spring 2026 booking commissions batch'),
    (150.0, 'inflow',  'Historical: Winter 2025 booking commissions batch'),
    (300.0, 'inflow',  'Historical: Fall 2025 booking commissions batch'),
    (600.0, 'inflow',  'Historical: Summer 2025 booking commissions batch'),
    (215.0, 'inflow',  'Historical: SXSW 2025 commissions'),
    (200.0, 'outflow', 'Disbursement to Austin Food Bank — Q1 2026'),
    (250.0, 'outflow', 'Disbursement to HAAM — Q4 2025'),
    (350.0, 'outflow', 'Disbursement to Austin Pets Alive! — Q3 2025'),
    (350.0, 'outflow', 'Disbursement to Youth Arts Coalition — Q2 2025')
  on conflict do nothing;

end;
$$;
