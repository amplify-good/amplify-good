# Amplify Good App

Supabase-backed Next.js application for the Amplify Good marketplace connecting musicians, nonprofits, and community members.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth + Postgres + Row Level Security
- Vitest + Testing Library

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `/.env.local` from `/.env.local.example` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAILS=admin@example.com
```

3. Run the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

Create a hosted Supabase project, then run the SQL migrations in order from [`supabase/migrations`](/Users/andychuong/Documents/SB/Amplify_good/amplify-good-app/supabase/migrations):

1. `001_profiles.sql`
2. `002_musicians.sql`
3. `003_nonprofits.sql`
4. `004_events.sql`
5. `005_rsvps.sql`
6. `006_bookings.sql`
7. `007_impact_pool.sql`
8. `008_indexes.sql`
9. `009_rls_policies.sql`

After migrations, seed demo data in this order:

```bash
pnpm seed:auth-demo
pnpm seed:app-demo
```

Use [`supabase/reset_demo.sql`](/Users/andychuong/Documents/SB/Amplify_good/amplify-good-app/supabase/reset_demo.sql) if you want to clear the seeded marketplace records, and [`supabase/cleanup_broken_auth_seed.sql`](/Users/andychuong/Documents/SB/Amplify_good/amplify-good-app/supabase/cleanup_broken_auth_seed.sql) only if you need to clean up an older broken auth seed from before the service-role seeder existed.

## Auth Notes

- Enable the Email provider in Supabase Authentication.
- The current signup flow expects immediate session creation after `signUp()`.
- For this codebase, keep email confirmation off unless you also implement a confirmation callback flow.

## Demo Accounts

After running both seed scripts, these accounts work with password auth:

- `music@gmail.com` / `password123`
- `npo@gmail.com` / `password123`
- `fan@gmail.com` / `password123`
- `event@gmail.com` / `password123`

## Admin Access

`/admin` is protected by `ADMIN_EMAILS`, a comma-separated allowlist of email addresses. Any signed-in user not on that list is redirected to `/home`.

## Commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm seed:auth-demo
pnpm seed:app-demo
```

## Deployment

Deploy to Vercel with:

- Root Directory: `amplify-good-app`
- Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_EMAILS`

## Current Behavior

- Musician and nonprofit signup now creates the matching role record immediately after auth signup.
- Community signup routes to `/home`.
- Musician and nonprofit signup routes to `/dashboard`.
- Server actions and dashboards use Supabase-backed sessions rather than demo cookies.
