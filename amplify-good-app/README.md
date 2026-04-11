# Amplify Good — Developer README

Frontend-only Next.js prototype for the Amplify Good three-sided marketplace.

## Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 with `@theme inline` CSS tokens |
| Language | TypeScript |
| Auth | Cookie-based demo auth via `js-cookie` |
| Fonts | Anton, League Spartan, Open Sans (Google Fonts) |
| Data | Static TypeScript seed files — no database |

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
src/
  app/                  # Next.js App Router pages
    page.tsx            # / — Landing
    login/page.tsx      # /login
    signup/page.tsx     # /signup
    home/page.tsx       # /home — Community feed
    musicians/
      page.tsx          # /musicians — Directory
      [id]/page.tsx     # /musicians/:id — Profile
    events/
      page.tsx          # /events — Listing
      new/page.tsx      # /events/new — Create event
      [id]/page.tsx     # /events/:id — Detail
    dashboard/page.tsx  # /dashboard — Role dashboard
    book/[id]/page.tsx  # /book/:id — Booking + checkout
    sponsor/[id]/page.tsx # /sponsor/:id — Sponsor a set
    admin/page.tsx      # /admin — Admin panel
    globals.css         # Tailwind 4 + design tokens + base styles
    layout.tsx          # Root layout (fonts, metadata)
  components/
    Navbar.tsx          # Sticky nav with session-aware login/logout
    Footer.tsx          # Site footer
    GenreTags.tsx       # Pipe-separated genre display
    SectionDivider.tsx  # Decorative section separator
  data/
    musicians.ts        # 5 musician records
    nonprofits.ts       # 5 nonprofit records
    events.ts           # 7 event records
    bookings.ts         # 9 booking records + impactPool object
  lib/
    auth.ts             # Cookie auth — login, logout, getSession, getDisplayName
    format.ts           # Shared utilities — formatDate, formatTime, formatMoney
public/
  images/
    fist-logo.png       # Primary logo (microphone fist)
    icons/              # Hand-drawn brand illustration kit
    musicians/          # Musician placeholder photos
    nonprofits/         # Nonprofit logo placeholders
```

## Authentication

No real auth — uses `js-cookie` to store two cookies: `ampgood_role` and `ampgood_email`.

**`src/lib/auth.ts`** exports:

- `login(email)` — checks email against hardcoded map, sets cookies, returns role or null
- `logout()` — removes both cookies
- `getSession()` — reads cookies, returns `{ role, email }` or null
- `getDisplayName(email)` — maps email to display name

Demo accounts (any password):

| Email | Role | Display Name |
| ----- | ---- | ------------ |
| `music@gmail.com` | musician | Los Topo Chicos |
| `npo@gmail.com` | nonprofit | Austin Food Bank |
| `fan@gmail.com` | community | Rachel Torres |
| `event@gmail.com` | community | David Chen |

The Navbar reads the session via `getSession()` on mount and shows the user's display name + logout button when logged in.

## Seed Data

All data lives in `src/data/`. No database, no API calls — everything is imported directly into pages.

- **`musicians.ts`** — 5 musicians with id, name, genre, rate, bio, media, socials
- **`nonprofits.ts`** — 5 nonprofits with id, name, mission, cause, logo
- **`events.ts`** — 7 events with status (upcoming/draft/completed), musicianId, nonprofitId
- **`bookings.ts`** — 9 bookings covering all 5 musicians; also exports `impactPool` object

Impact pool shape:

```typescript
export const impactPool = {
  balance: 685,
  totalInflows: 1835,
  totalOutflows: 1150,
};
```

## Design Tokens

CSS custom properties defined in `globals.css` and exposed via `@theme inline`:

```css
--color-azure: #21639F       /* Primary brand */
--color-sienna: #BF5700      /* Secondary accent */
--color-orange: #FFB700      /* Action buttons */
--color-gold: #FBB03B        /* Impact numbers */
--color-sand: #E8DCBE        /* Page background */
--color-sand-light: #F2EADA
--color-sand-dark: #D9CCAB
--color-parchment: #E3D7BA
```

Use as Tailwind utilities: `bg-azure`, `text-orange`, `border-gold`, etc.

## Shared Utilities

**`src/lib/format.ts`**:

- `formatDate(dateString)` — e.g. `"June 14, 2026"`
- `formatTime(dateString)` — e.g. `"6:00 PM"`
- `formatMoney(amount)` — e.g. `"$1,835.00"`

## Static Generation

Pages with dynamic routes (`/musicians/[id]`, `/events/[id]`, `/book/[id]`, `/sponsor/[id]`) use `generateStaticParams()` to export all routes at build time.

## Deployment

Deploy to Vercel. Set the **Root Directory** to `amplify-good-app` in the Vercel project settings (the monorepo root is not the Next.js app).

```text
Root Directory: amplify-good-app
Build Command:  npm run build  (default)
Output:         .next          (default)
```

No environment variables required — this is a fully static frontend prototype.
