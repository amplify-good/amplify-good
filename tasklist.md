# Amplify Good — Supabase Database Build-Out Tasklist

> Goal: Migrate from a static-data prototype to a fully functional Supabase-backed app with real auth, data persistence, and row-level security.

---

## Phase 1 — Supabase Project Setup

- [ ] **1.1** Create a Supabase project at supabase.com (name: `amplify-good`)
- [ ] **1.2** Copy the project URL and anon key; add to `amplify-good-app/.env.local` (template in `.env.local.example`):
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
  SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # server-side only
  ```
- [x] **1.3** Install Supabase packages — `@supabase/supabase-js`, `@supabase/ssr` installed via pnpm
- [ ] **1.4** Link Supabase CLI to project (once project exists):
  ```bash
  npx supabase login
  npx supabase link --project-ref <project-ref>
  ```
- [x] **1.5** `src/lib/supabase/client.ts` — browser client created
- [x] **1.6** `src/lib/supabase/server.ts` — async server client + `getServerSession()` created
- [x] **1.7** `src/proxy.ts` — session refresh on every request (Next.js 16 uses `proxy.ts`, not `middleware.ts`)

---

## Phase 2 — Database Schema (SQL Migrations)

All migration files written to `supabase/migrations/`. Run via Supabase Studio SQL editor or `supabase db push` once linked.

- [x] **2.1** `001_profiles.sql` — `profiles` table + `handle_new_user()` trigger (auto-creates profile on signup)
- [x] **2.2** `002_musicians.sql` — `musicians`, `musician_media_links`, `musician_social_links` tables
- [x] **2.3** `003_nonprofits.sql` — `nonprofits` table
- [x] **2.4** `004_events.sql` — `events` table
- [x] **2.5** `005_rsvps.sql` — `rsvps` table + `update_rsvp_count()` trigger
- [x] **2.6** `006_bookings.sql` — `bookings` table
- [x] **2.7** `007_impact_pool.sql` — `impact_pool_transactions` table + `impact_pool_summary` view + `handle_booking_completed()` trigger
- [x] **2.8** `008_indexes.sql` — 13 performance indexes
- [ ] **2.9 (YOU)** Run migrations against your live Supabase project (paste each file into Studio → SQL Editor in order 001→008)

---

## Phase 3 — Row Level Security (RLS)

- [x] **3.1–3.8** All RLS policies written to `009_rls_policies.sql`:
  - `profiles` — authenticated read-any, update-own
  - `musicians` — public select, insert/update own
  - `musician_media_links` / `musician_social_links` — public select, manage own
  - `nonprofits` — public select, insert/update own
  - `events` — public select (non-draft), nonprofit owns drafts + mutations
  - `rsvps` — own + nonprofit-event select, community insert, own delete
  - `bookings` — musician + community member see own, community inserts, both can update
  - `impact_pool_transactions` — authenticated read, no direct writes (trigger only)
- [ ] **3.9 (YOU)** Run `009_rls_policies.sql` against your live project after schema migrations

---

## Phase 4 — Authentication Migration ✅

- [x] **4.1** `src/lib/auth.ts` — replaced `js-cookie` demo auth with real Supabase Auth (`login`, `logout`, `getSession`, `signupAndLogin`)
- [x] **4.2** `src/app/login/page.tsx` — async submit, real error messages, loading state
- [x] **4.3** `src/app/signup/SignUpForm.tsx` — lifted email/password/name state, calls `signupAndLogin`, loading + error state
- [x] **4.4** `src/components/Navbar.tsx` — uses `supabase.auth.onAuthStateChange`, shows `session.displayName`
- [ ] **4.5** Remove `js-cookie` once confirmed working end-to-end:
  ```bash
  pnpm remove js-cookie @types/js-cookie
  ```
- [x] **4.6** Route protection handled in server components via `getServerSession()` + `redirect('/login')`

---

## Phase 5 — Data Access Layer ✅

All files created in `src/lib/db/`:

- [x] **5.1** `musicians.ts` — `getMusicians`, `getMusicianById`, `getMusicianByUserId`, `createMusician`, `suggestMusiciansForEvent`, `getEventsByMusicianId`
- [x] **5.2** `nonprofits.ts` — `getNonprofits`, `getNonprofitById`, `getNonprofitByUserId`, `createNonprofit`
- [x] **5.3** `events.ts` — `getEvents`, `getEventById`, `getEventsByNonprofitId`, `createEvent`, `updateEvent`
- [x] **5.4** `bookings.ts` — `getBookingsByMusicianId`, `getBookingsByCommunityMemberId`, `createBooking`, `updateBookingStatus`
- [x] **5.5** `rsvps.ts` — `getRsvpCount`, `getUserRsvp`, `createRsvp`, `deleteRsvp`
- [x] **5.6** `impact.ts` — `getImpactPoolSummary`, `getImpactTransactions`
- [x] **5.7** `types.ts` + `index.ts` — shared DB types and barrel export

---

## Phase 6 — Server Actions ✅

All files created in `src/app/actions/`:

- [x] **6.1** `bookings.ts` — `createBookingAction` (role-gated, 15% commission calc), `updateBookingStatusAction`
- [x] **6.2** `events.ts` — `createEventAction`, `publishEventAction`, `assignMusicianAction`
- [x] **6.3** `rsvps.ts` — `toggleRsvpAction`
- [x] **6.4** `profiles.ts` — `updateProfileAction`

---

## Phase 7 — Page Integration ✅

All pages now server-rendered (`ƒ`). Static data imports removed from all routes.

- [x] **7.1** `/musicians/page.tsx` — server component + `MusiciansClient.tsx` for filter UI
- [x] **7.2** `/musicians/[id]/page.tsx` — server component, `getMusicianById`, `generateStaticParams` removed
- [x] **7.3** `/events/page.tsx` — server component + `EventsClient.tsx` for filter UI
- [x] **7.4** `/events/[id]/page.tsx` — server component, `getEventById` (joined relations)
- [x] **7.5** `/events/new/page.tsx` — server wrapper (auth-gated) + `NewEventForm.tsx` client component wired to `createEventAction`
- [x] **7.6** `/book/[id]/page.tsx` — server wrapper + `BookingForm.tsx` wired to `createBookingAction`
- [x] **7.7** `/sponsor/[id]/page.tsx` — server wrapper + `SponsorForm.tsx`
- [x] **7.8** `/home/page.tsx` — async server component, DB calls, `getImpactPoolSummary`
- [x] **7.9** `/dashboard/page.tsx` — server component; `MusicianDashboard`, `NonProfitDashboard`, `CommunityDashboard` as client components with `BookingActions` + `AssignMusicianButton`
- [x] **7.10** `/admin/page.tsx` — server component, live DB queries
- [x] **7.11** `src/components/EventCard.tsx` — updated to `DbEvent`/`DbNonprofit`/`DbMusician` types

---

## Phase 8 — Seed Data Migration

- [x] **8.1** `supabase/seed.sql` written — idempotent `DO $$` block with fixed UUIDs for 4 auth users, 5 musicians (+ media/social links), 5 nonprofits, 7 events, 9 bookings, impact pool transactions (balance: $685, inflows: $1,835, outflows: $1,150)
- [ ] **8.2 (YOU)** Run seed in Supabase Studio: paste `supabase/seed.sql` into SQL Editor and execute
- [ ] **8.3 (YOU)** Verify seed data in Supabase Studio table viewer
- [ ] **8.4 (YOU)** Test demo login accounts end-to-end:
  - `music@gmail.com` / `password123` → musician dashboard
  - `npo@gmail.com` / `password123` → nonprofit dashboard
  - `fan@gmail.com` / `password123` → community home
  - `event@gmail.com` / `password123` → community home

---

## Phase 9 — Testing ✅

### Setup

- [x] Vitest + `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitest/coverage-v8` installed
- [x] `vitest.config.ts` configured with jsdom environment + `@` path alias
- [x] `test`, `test:watch`, `test:coverage` scripts added to `package.json`

### Tests written and passing (38/38)

- [x] `src/lib/db/__tests__/business-logic.test.ts` — commission math (15%, hourly, rounding)
- [x] `src/lib/db/__tests__/suggest-musicians.test.ts` — genre ranking, limit, case-insensitive, empty list
- [x] `src/lib/db/__tests__/musicians.test.ts` — `getMusicians` filters, empty data
- [x] `src/lib/db/__tests__/impact.test.ts` — `getImpactPoolSummary` with data and zero fallback
- [x] `src/app/actions/__tests__/bookings.test.ts` — auth guards, role checks, commission calculation, hourly rate
- [x] `src/app/actions/__tests__/events.test.ts` — auth guards, role checks, create + publish
- [x] `src/lib/format.test.ts` — `formatDate`, `formatTime`, `formatMoney`

### Still to do (requires live Supabase instance)

- [ ] Integration tests against local Supabase (`npx supabase start`) for actual DB operations
- [ ] RLS policy tests — verify anon/authenticated access boundaries
- [ ] E2E tests (Playwright) — full user flows for all 3 roles

---

## Phase 10 — Cleanup & Deployment

- [ ] **10.1 (YOU)** Delete `src/data/musicians.ts`, `src/data/nonprofits.ts`, `src/data/events.ts`, `src/data/bookings.ts` once connected to live DB and verified working
- [ ] **10.2 (YOU)** Remove `js-cookie` dependency: `pnpm remove js-cookie @types/js-cookie`
- [ ] **10.3 (YOU)** Add env vars to Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **10.4** Enable Email Auth in Supabase Dashboard → Authentication → Providers
- [ ] **10.5 (YOU)** Update `README.md` with real env var instructions
- [x] **10.6** `pnpm build` passes clean — no type errors, no warnings

---

## What's Done vs. What Still Needs You

### Done (code complete, build passing, 38 tests green)

- All packages installed
- All SQL migrations + RLS policies written (ready to run)
- Seed data SQL written (ready to run)
- Full data access layer (`src/lib/db/`)
- Real Supabase Auth replacing demo cookie auth
- All 4 server action files
- All pages migrated to server components with live DB queries
- Unit + action tests passing

### Needs You (requires a live Supabase project)

1. Create project at supabase.com
2. Add credentials to `.env.local`
3. Run migrations 001–009 in Supabase Studio SQL Editor
4. Run `supabase/seed.sql` in SQL Editor
5. Enable Email provider in Auth settings
6. Test the 4 demo accounts end-to-end
7. Add env vars to Vercel for production deploy
8. Delete old `src/data/*.ts` files once live DB confirmed
9. Remove `js-cookie` dependency
