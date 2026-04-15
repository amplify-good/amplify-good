/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const contents = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separator = line.indexOf('=')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

const projectRoot = process.cwd()
loadEnvFile(path.join(projectRoot, '.env.local'))
loadEnvFile(path.join(projectRoot, '.env'))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check .env.local.'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const IDS = {
  uidMusician: 'a0000001-0000-0000-0000-000000000001',
  uidNonprofit: 'a0000002-0000-0000-0000-000000000002',
  uidCommunity1: 'a0000003-0000-0000-0000-000000000003',
  uidCommunity2: 'a0000004-0000-0000-0000-000000000004',
  uidCommunity3: 'a0000005-0000-0000-0000-000000000005',
  uidCommunity4: 'a0000006-0000-0000-0000-000000000006',
  uidCommunity5: 'a0000007-0000-0000-0000-000000000007',
  mid1: 'b0000001-0000-0000-0000-000000000001',
  mid2: 'b0000002-0000-0000-0000-000000000002',
  mid3: 'b0000003-0000-0000-0000-000000000003',
  mid4: 'b0000004-0000-0000-0000-000000000004',
  mid5: 'b0000005-0000-0000-0000-000000000005',
  nid1: 'c0000001-0000-0000-0000-000000000001',
  nid2: 'c0000002-0000-0000-0000-000000000002',
  nid3: 'c0000003-0000-0000-0000-000000000003',
  nid4: 'c0000004-0000-0000-0000-000000000004',
  nid5: 'c0000005-0000-0000-0000-000000000005',
  eid1: 'd0000001-0000-0000-0000-000000000001',
  eid2: 'd0000002-0000-0000-0000-000000000002',
  eid3: 'd0000003-0000-0000-0000-000000000003',
  eid4: 'd0000004-0000-0000-0000-000000000004',
  eid5: 'd0000005-0000-0000-0000-000000000005',
  eid6: 'd0000006-0000-0000-0000-000000000006',
  eid7: 'd0000007-0000-0000-0000-000000000007',
  bid1: 'e0000001-0000-0000-0000-000000000001',
  bid2: 'e0000002-0000-0000-0000-000000000002',
  bid3: 'e0000003-0000-0000-0000-000000000003',
  bid4: 'e0000004-0000-0000-0000-000000000004',
  bid5: 'e0000005-0000-0000-0000-000000000005',
  bid6: 'e0000006-0000-0000-0000-000000000006',
  bid7: 'e0000007-0000-0000-0000-000000000007',
  bid8: 'e0000008-0000-0000-0000-000000000008',
  bid9: 'e0000009-0000-0000-0000-000000000009',
}

async function upsert(table, rows, conflict = 'id') {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflict })
  if (error) throw new Error(`${table}: ${error.message}`)
  console.log(`Seeded ${table}`)
}

async function insert(table, rows) {
  const { error } = await supabase.from(table).insert(rows)
  if (error) throw new Error(`${table}: ${error.message}`)
  console.log(`Seeded ${table}`)
}

async function main() {
  await upsert('musicians', [
    {
      id: IDS.mid1,
      user_id: IDS.uidMusician,
      name: 'Los Topo Chicos',
      bio: "Austin's hottest Latin-fusion ensemble blending cumbia, son jarocho, and psychedelic rock. Born out of late-night jams on East 6th, Los Topo Chicos bring the kind of energy that turns strangers into dance partners.",
      genres: ['Latin', 'Rock', 'Folk'],
      photo_url: '/images/icons/musician_profile_window_icon.png',
      rate: 500,
      rate_type: 'per_event',
      available: true,
    },
    {
      id: IDS.mid2,
      user_id: null,
      name: 'Nia Waters',
      bio: "Jazz vocalist and pianist who grew up singing in her grandmother's church in East Austin. Nia's sound is a velvet collision of neo-soul, jazz standards, and original compositions about love, loss, and living in a city that keeps changing.",
      genres: ['Jazz', 'R&B'],
      photo_url: '/images/icons/musician_profile_window_icon.png',
      rate: 350,
      rate_type: 'per_event',
      available: true,
    },
    {
      id: IDS.mid3,
      user_id: null,
      name: 'Dusty Creek Revival',
      bio: "Four-piece Americana band that sounds like a Hill Country sunset feels. Fiddle-driven folk with a country heartbeat and lyrics that tell stories about Texas — the real Texas, not the postcard version.",
      genres: ['Folk', 'Country', 'Blues'],
      photo_url: '/images/icons/musician_profile_window_icon.png',
      rate: 400,
      rate_type: 'per_event',
      available: true,
    },
    {
      id: IDS.mid4,
      user_id: null,
      name: 'DJ Amara Sol',
      bio: "Electronic producer and DJ who fuses Afrobeats, house, and Austin's underground electronic scene into sets that don't let you stand still. Resident at Kingdom and regular at SXSW showcases.",
      genres: ['Electronic', 'Hip-Hop'],
      photo_url: '/images/icons/musician_profile_window_icon.png',
      rate: 75,
      rate_type: 'hourly',
      available: true,
    },
    {
      id: IDS.mid5,
      user_id: null,
      name: 'Marcus & the Burning Oaks',
      bio: "Blues-rock power trio led by guitarist Marcus Coleman, whose playing has been compared to Gary Clark Jr. meets Hendrix. They've headlined the Continental Club and opened for Black Pumas. Raw, loud, and unapologetically Austin.",
      genres: ['Blues', 'Rock'],
      photo_url: '/images/icons/musician_profile_window_icon.png',
      rate: 600,
      rate_type: 'per_event',
      available: true,
    },
  ])

  await insert(
    'musician_media_links',
    [
      { musician_id: IDS.mid1, type: 'spotify', url: 'https://open.spotify.com/artist/example1', label: 'Cumbia del Barrio', sort_order: 0 },
      { musician_id: IDS.mid1, type: 'youtube', url: 'https://youtube.com/watch?v=example1', label: 'Live at Mohawk', sort_order: 1 },
      { musician_id: IDS.mid2, type: 'spotify', url: 'https://open.spotify.com/artist/example2', label: 'Riverside Sessions', sort_order: 0 },
      { musician_id: IDS.mid2, type: 'soundcloud', url: 'https://soundcloud.com/niawaters/sunday', label: 'Sunday Morning', sort_order: 1 },
      { musician_id: IDS.mid3, type: 'youtube', url: 'https://youtube.com/watch?v=example3', label: 'Porch Sessions Vol. 2', sort_order: 0 },
      { musician_id: IDS.mid3, type: 'spotify', url: 'https://open.spotify.com/artist/example3', label: 'Red Dirt Lullaby', sort_order: 1 },
      { musician_id: IDS.mid4, type: 'soundcloud', url: 'https://soundcloud.com/amarasol/nightshift', label: 'Night Shift Mix', sort_order: 0 },
      { musician_id: IDS.mid4, type: 'youtube', url: 'https://youtube.com/watch?v=example4', label: 'Kingdom Live Set', sort_order: 1 },
      { musician_id: IDS.mid5, type: 'spotify', url: 'https://open.spotify.com/artist/example5', label: 'Thunderbird', sort_order: 0 },
      { musician_id: IDS.mid5, type: 'youtube', url: 'https://youtube.com/watch?v=example5', label: 'Continental Club 2024', sort_order: 1 },
    ]
  )

  await insert(
    'musician_social_links',
    [
      { musician_id: IDS.mid1, platform: 'instagram', url: 'https://instagram.com/lostopochicos', sort_order: 0 },
      { musician_id: IDS.mid1, platform: 'twitter', url: 'https://twitter.com/lostopochicos', sort_order: 1 },
      { musician_id: IDS.mid2, platform: 'instagram', url: 'https://instagram.com/niawaters', sort_order: 0 },
      { musician_id: IDS.mid2, platform: 'website', url: 'https://niawaters.com', sort_order: 1 },
      { musician_id: IDS.mid3, platform: 'instagram', url: 'https://instagram.com/dustycreekrevival', sort_order: 0 },
      { musician_id: IDS.mid3, platform: 'facebook', url: 'https://facebook.com/dustycreekrevival', sort_order: 1 },
      { musician_id: IDS.mid4, platform: 'instagram', url: 'https://instagram.com/djamarasol', sort_order: 0 },
      { musician_id: IDS.mid4, platform: 'tiktok', url: 'https://tiktok.com/@djamarasol', sort_order: 1 },
      { musician_id: IDS.mid5, platform: 'instagram', url: 'https://instagram.com/burningoaks', sort_order: 0 },
      { musician_id: IDS.mid5, platform: 'twitter', url: 'https://twitter.com/burningoaks', sort_order: 1 },
    ]
  )

  await upsert('nonprofits', [
    {
      id: IDS.nid1,
      user_id: IDS.uidNonprofit,
      name: 'Austin Food Bank',
      bio: 'Fighting hunger in Central Texas by distributing meals to families, seniors, and children in need. Last year we served over 50 million meals across 21 counties.',
      website: 'https://austinfoodbank.org',
      logo_url: '/images/icons/hands_heart_window_icon.png',
      contact_email: 'events@austinfoodbank.org',
      cause: 'Healthcare',
    },
    {
      id: IDS.nid2,
      user_id: null,
      name: 'HAAM - Health Alliance for Austin Musicians',
      bio: "Providing access to affordable healthcare for Austin's low-income, uninsured working musicians. Because you can't make music if you can't take care of yourself.",
      website: 'https://myhaam.org',
      logo_url: '/images/icons/hands_heart_window_icon.png',
      contact_email: 'events@myhaam.org',
      cause: 'Arts & Culture',
    },
    {
      id: IDS.nid3,
      user_id: null,
      name: 'Austin Pets Alive!',
      bio: "No-kill animal rescue dedicated to saving Austin's most at-risk shelter animals. We pioneered programs that have saved over 100,000 lives and made Austin the largest no-kill city in the nation.",
      website: 'https://austinpetsalive.org',
      logo_url: '/images/icons/hands_heart_window_icon.png',
      contact_email: 'events@austinpetsalive.org',
      cause: 'Animal Rescue',
    },
    {
      id: IDS.nid4,
      user_id: null,
      name: 'Youth Arts Coalition ATX',
      bio: 'Empowering underserved Austin youth through free music lessons, visual arts workshops, and performance opportunities. Every kid deserves a stage.',
      website: 'https://youtharts-atx.org',
      logo_url: '/images/icons/hands_heart_window_icon.png',
      contact_email: 'info@youtharts-atx.org',
      cause: 'Youth',
    },
    {
      id: IDS.nid5,
      user_id: null,
      name: 'Barton Springs Conservancy',
      bio: "Protecting and preserving Barton Springs and the Edwards Aquifer for future generations. Restoring the ecological heart of Austin through community science and advocacy.",
      website: 'https://bartonsprings.org',
      logo_url: '/images/icons/hands_heart_window_icon.png',
      contact_email: 'events@bartonsprings.org',
      cause: 'Environment',
    },
  ])

  await upsert('events', [
    {
      id: IDS.eid1,
      nonprofit_id: IDS.nid1,
      musician_id: IDS.mid2,
      name: 'Feed the City Gala',
      date_time: '2026-06-14T18:00:00Z',
      venue: 'The Driskill Hotel, 604 Brazos St',
      vibe: 'Elegant evening gala with live music and a seated dinner',
      expected_attendance: 250,
      genre_pref: 'Jazz',
      description: "Austin Food Bank's annual fundraiser bringing together donors, volunteers, and community leaders for an evening of fine dining, live jazz, and impact stories. Every dollar raised goes directly to fighting hunger in Central Texas.",
      short_description: "Supporting Austin Food Bank's fight against hunger in Central Texas.",
      cause: 'Healthcare',
      status: 'upcoming',
      rsvp_count: 187,
    },
    {
      id: IDS.eid2,
      nonprofit_id: IDS.nid3,
      musician_id: IDS.mid3,
      name: 'Paws & Play Block Party',
      date_time: '2026-06-21T12:00:00Z',
      venue: 'Republic Square Park, 422 Guadalupe St',
      vibe: 'Casual outdoor block party with adoptable animals',
      expected_attendance: 500,
      genre_pref: 'Folk',
      description: "A family-friendly afternoon of live music, food trucks, and adorable adoptable pets. Come for the music, leave with a new best friend. All proceeds support Austin Pets Alive!'s rescue operations.",
      short_description: "Supporting Austin Pets Alive!'s animal rescue and adoption programs.",
      cause: 'Animal Rescue',
      status: 'upcoming',
      rsvp_count: 324,
    },
    {
      id: IDS.eid3,
      nonprofit_id: IDS.nid4,
      musician_id: IDS.mid4,
      name: 'Youth Showcase: Next Gen ATX',
      date_time: '2026-07-04T16:00:00Z',
      venue: 'Mohawk Austin, 912 Red River St',
      vibe: 'High-energy youth talent showcase with headliner',
      expected_attendance: 300,
      genre_pref: 'Hip-Hop',
      description: "Young musicians from Youth Arts Coalition take the stage alongside a headlining act. This is their moment — come witness the next generation of Austin's music scene and support the programs that made it possible.",
      short_description: "Supporting Youth Arts Coalition's music programs for the next generation.",
      cause: 'Youth',
      status: 'upcoming',
      rsvp_count: 156,
    },
    {
      id: IDS.eid4,
      nonprofit_id: IDS.nid5,
      musician_id: null,
      name: 'Sunset on the Springs',
      date_time: '2026-07-18T17:00:00Z',
      venue: 'Zilker Botanical Garden, 2220 Barton Springs Rd',
      vibe: 'Relaxed sunset concert in the garden',
      expected_attendance: 200,
      genre_pref: 'Folk',
      description: 'An evening of acoustic music surrounded by nature at Zilker Botanical Garden. Enjoy local food vendors, craft beverages, and the sounds of Hill Country folk as the sun sets over Austin.',
      short_description: 'Supporting environmental conservation and green spaces across Austin.',
      cause: 'Environment',
      status: 'upcoming',
      rsvp_count: 89,
    },
    {
      id: IDS.eid5,
      nonprofit_id: IDS.nid2,
      musician_id: IDS.mid5,
      name: 'HAAM Benefit: Notes for Health',
      date_time: '2026-05-10T19:00:00Z',
      venue: 'ACL Live at The Moody Theater, 310 W Willie Nelson Blvd',
      vibe: 'Concert-style benefit with multiple acts',
      expected_attendance: 400,
      genre_pref: 'Blues',
      description: "An electrifying night of blues and rock at the Moody Theater, raising funds to keep Austin's musicians healthy. Featuring Marcus & the Burning Oaks headlining with special guests.",
      short_description: "Supporting HAAM's healthcare access for Austin's working musicians.",
      cause: 'Arts & Culture',
      status: 'completed',
      rsvp_count: 378,
    },
    {
      id: IDS.eid6,
      nonprofit_id: IDS.nid1,
      musician_id: IDS.mid1,
      name: 'Summer Meals Kickoff Cookout',
      date_time: '2026-08-02T11:00:00Z',
      venue: 'Givens District Park, 3811 E 12th St',
      vibe: 'Family-friendly outdoor cookout with live Latin music',
      expected_attendance: 350,
      genre_pref: 'Latin',
      description: "Austin Food Bank's summer meals program launch. Free food distribution, live music, kids' activities, and community resources. Come eat, dance, and help us fight hunger all summer long.",
      short_description: "Supporting Austin Food Bank's summer meals program for kids in need.",
      cause: 'Healthcare',
      status: 'upcoming',
      rsvp_count: 142,
    },
    {
      id: IDS.eid7,
      nonprofit_id: IDS.nid4,
      musician_id: null,
      name: 'Back to School Benefit Concert',
      date_time: '2026-08-22T18:00:00Z',
      venue: 'The Parish, 214 E 6th St',
      vibe: 'High-energy all-ages concert with electronic and hip-hop',
      expected_attendance: 250,
      genre_pref: 'Electronic',
      description: "Raising funds for Youth Arts Coalition's back-to-school music equipment drive. DJ sets, student showcases, and a headlining performance. All ages welcome.",
      short_description: "Supporting Youth Arts Coalition's back-to-school music equipment drive.",
      cause: 'Youth',
      status: 'draft',
      rsvp_count: 0,
    },
  ])

  await upsert('bookings', [
    { id: IDS.bid1, musician_id: IDS.mid1, community_member_id: IDS.uidCommunity1, event_name: 'Torres Family Reunion BBQ', event_date: '2026-06-28T14:00:00Z', location: 'Mueller Lake Park Pavilion', duration: '3 hours', musician_rate: 500, commission_amount: 75, total_charged: 575, status: 'confirmed', message: "We'd love a mix of cumbia and classic rock for a multigenerational crowd. About 80 people, outdoor setting with a covered pavilion." },
    { id: IDS.bid2, musician_id: IDS.mid2, community_member_id: IDS.uidCommunity2, event_name: 'Chen-Williams Wedding Reception', event_date: '2026-05-03T17:00:00Z', location: 'Hotel Saint Cecilia, 112 Academy Dr', duration: '4 hours', musician_rate: 350, commission_amount: 52.5, total_charged: 402.5, status: 'completed', message: 'Looking for elegant jazz and neo-soul for our wedding reception. Cocktail hour into dinner — about 120 guests, intimate garden setting.' },
    { id: IDS.bid3, musician_id: IDS.mid5, community_member_id: IDS.uidCommunity5, event_name: 'Launch Party: TechRise Demo Day', event_date: '2026-07-12T19:00:00Z', location: 'Brazos Hall, 204 E 4th St', duration: '2 hours', musician_rate: 600, commission_amount: 90, total_charged: 690, status: 'pending', message: 'High-energy blues-rock set for our startup demo day after-party. ~200 attendees, tech crowd that wants to let loose.' },
    { id: IDS.bid4, musician_id: IDS.mid3, community_member_id: IDS.uidCommunity2, event_name: 'Hill Country Corporate Retreat', event_date: '2026-06-07T15:00:00Z', location: 'Dripping Springs Ranch, Hwy 290', duration: '3 hours', musician_rate: 400, commission_amount: 60, total_charged: 460, status: 'confirmed', message: 'Acoustic folk and country for an outdoor corporate retreat. Casual ranch setting, about 60 people, sunset session.' },
    { id: IDS.bid5, musician_id: IDS.mid4, community_member_id: IDS.uidCommunity5, event_name: 'SXSW Afterparty: Amplify After Dark', event_date: '2026-03-15T22:00:00Z', location: 'Kingdom, 5th & Red River', duration: '4 hours', musician_rate: 300, commission_amount: 45, total_charged: 345, status: 'completed', message: 'High-energy DJ set for our SXSW afterparty. Full production setup, 300+ capacity, we want the place jumping.' },
    { id: IDS.bid6, musician_id: IDS.mid1, community_member_id: IDS.uidCommunity3, event_name: 'Quinceañera de Sofia', event_date: '2026-04-19T18:00:00Z', location: 'Fiesta Gardens, 2101 Jesse E Segovia St', duration: '4 hours', musician_rate: 500, commission_amount: 75, total_charged: 575, status: 'completed', message: 'Traditional and modern Latin music for a quinceañera celebration. About 150 guests, outdoor pavilion by the lake.' },
    { id: IDS.bid7, musician_id: IDS.mid1, community_member_id: IDS.uidCommunity4, event_name: 'Brewery Grand Opening', event_date: '2026-07-05T16:00:00Z', location: 'East Side Brewing, 1201 E 6th St', duration: '3 hours', musician_rate: 500, commission_amount: 75, total_charged: 575, status: 'pending', message: 'Looking for high-energy Latin fusion to kick off our grand opening. Food trucks, 200+ expected, outdoor beer garden.' },
    { id: IDS.bid8, musician_id: IDS.mid2, community_member_id: IDS.uidCommunity1, event_name: 'Jazz Night at Springdale Social', event_date: '2026-08-15T20:00:00Z', location: 'Springdale General, 1023 Springdale Rd', duration: '2 hours', musician_rate: 350, commission_amount: 52.5, total_charged: 402.5, status: 'confirmed', message: 'Intimate jazz night for a small crowd. 40-50 people, indoor venue, cocktails and candles.' },
    { id: IDS.bid9, musician_id: IDS.mid5, community_member_id: IDS.uidCommunity2, event_name: '40th Birthday Blowout', event_date: '2026-09-20T19:00:00Z', location: "Stubb's BBQ, 801 Red River St", duration: '3 hours', musician_rate: 600, commission_amount: 90, total_charged: 690, status: 'pending', message: "Blues and rock for a milestone birthday party. About 100 guests, Stubb's indoor stage, full band setup." },
  ])

  await insert(
    'impact_pool_transactions',
    [
      { booking_id: IDS.bid2, amount: 52.5, type: 'inflow', description: 'Commission from booking: Chen-Williams Wedding Reception' },
      { booking_id: IDS.bid5, amount: 45, type: 'inflow', description: 'Commission from booking: SXSW Afterparty: Amplify After Dark' },
      { booking_id: IDS.bid6, amount: 75, type: 'inflow', description: 'Commission from booking: Quinceañera de Sofia' },
      { booking_id: null, amount: 200, type: 'inflow', description: 'Historical: Spring 2026 booking commissions batch' },
      { booking_id: null, amount: 150, type: 'inflow', description: 'Historical: Winter 2025 booking commissions batch' },
      { booking_id: null, amount: 300, type: 'inflow', description: 'Historical: Fall 2025 booking commissions batch' },
      { booking_id: null, amount: 600, type: 'inflow', description: 'Historical: Summer 2025 booking commissions batch' },
      { booking_id: null, amount: 215, type: 'inflow', description: 'Historical: SXSW 2025 commissions' },
      { booking_id: null, amount: 200, type: 'outflow', description: 'Disbursement to Austin Food Bank — Q1 2026' },
      { booking_id: null, amount: 250, type: 'outflow', description: 'Disbursement to HAAM — Q4 2025' },
      { booking_id: null, amount: 350, type: 'outflow', description: 'Disbursement to Austin Pets Alive! — Q3 2025' },
      { booking_id: null, amount: 350, type: 'outflow', description: 'Disbursement to Youth Arts Coalition — Q2 2025' },
    ]
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
