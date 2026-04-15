# Amplify Good

Amplify Good is a three-sided marketplace for Austin that connects musicians, nonprofits, and community members through a shared impact-pool model.

The working application lives in [/Users/andychuong/Documents/SB/Amplify_good/amplify-good-app](/Users/andychuong/Documents/SB/Amplify_good/amplify-good-app).

## What It Does

- Community members can browse musicians and events, book private performances, and contribute to the impact pool.
- Nonprofits can create events and match with local musicians.
- Musicians can receive booking requests and participate in nonprofit events funded by the pool.
- Admins can review a read-only operational dashboard once their email is allowlisted.

## App Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Postgres, and RLS

## Getting Started

```bash
cd amplify-good-app
pnpm install
pnpm dev
```

See the app-level README for full setup instructions:

- [/Users/andychuong/Documents/SB/Amplify_good/amplify-good-app/README.md](/Users/andychuong/Documents/SB/Amplify_good/amplify-good-app/README.md)

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`

## Supabase Bootstrapping

For a fresh project:

1. Create the Supabase project.
2. Copy env values into `amplify-good-app/.env.local`.
3. Run migrations `001` through `009` from `amplify-good-app/supabase/migrations`.
4. Run `pnpm seed:auth-demo`.
5. Run `pnpm seed:app-demo`.
6. Enable Email auth in Supabase and keep email confirmation off unless you add a confirmation callback flow.

## Demo Accounts

- `music@gmail.com` / `password123`
- `npo@gmail.com` / `password123`
- `fan@gmail.com` / `password123`
- `event@gmail.com` / `password123`

## Deployment

Deploy the Next.js app from the `amplify-good-app` subdirectory. In Vercel, set the project Root Directory to `amplify-good-app` and add the required environment variables there as well.
