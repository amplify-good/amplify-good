# Amplify Good

Amplify Good is a three-sided marketplace for Austin that connects musicians, nonprofits, and community members through a shared impact-pool model.

The working application lives in [`amplify-good-app/`](amplify-good-app/).

## What It Does

- Community members can browse musicians and events, book private performances, sponsor event sets, and contribute to the impact pool.
- Nonprofits can create events and match with local musicians.
- Musicians can receive booking requests and participate in nonprofit events funded by the pool.
- Admins can review a read-only operational dashboard once their email is allowlisted.

## App Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Postgres, Storage, and RLS
- Vitest + Testing Library

## Getting Started

```bash
cd amplify-good-app
pnpm install
pnpm dev
```

See the app-level README for full setup instructions: [`amplify-good-app/README.md`](amplify-good-app/README.md)

## Required Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server-only) |
| `ADMIN_EMAILS` | Comma-separated allowlist for `/admin` access |

## Supabase Bootstrapping

For a fresh project:

1. Create the Supabase project.
2. Copy env values into `amplify-good-app/.env.local` (see `.env.local.example`).
3. Run migrations `001` through `010` from `amplify-good-app/supabase/migrations/`.
4. Run `pnpm seed:auth-demo`.
5. Run `pnpm seed:app-demo`.
6. Enable Email auth in Supabase and keep email confirmation off unless you add a confirmation callback flow.

## Demo Accounts

After running both seed scripts:

- `music@gmail.com` / `password123`
- `npo@gmail.com` / `password123`
- `fan@gmail.com` / `password123`
- `event@gmail.com` / `password123`

## Deployment

Deploy the Next.js app from the `amplify-good-app` subdirectory. In Vercel, set the project Root Directory to `amplify-good-app` and add the required environment variables.
