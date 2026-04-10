# Amplify Good

**Amplify the Good City-Wide** — Where Wealth Preserves Art & Art Drives Social Impact

Amplify Good is a three-sided marketplace built for Austin, TX that connects **musicians**, **non-profits**, and **community members** through a closed-loop impact exchange. Community members book musicians and pay their rate + a 15% impact commission. That commission funds musicians to perform at non-profit events — at zero cost to the non-profit.

> ACL Festival meets local community. Grassroots, not corporate.

---

## Demo

This is a **frontend-only clickable prototype** with pre-loaded example data. There is no backend, no database, no authentication, and no payment processing. All data is hardcoded for demo purposes.

**Built for the Alpha City Limits Pilot — May 31, 2026**

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — logo, three role paths, login link |
| `/signup` | Role-specific sign-up forms (Musician, Non-Profit, Community) |
| `/login` | Login form |
| `/home` | Community home — event feed, featured musicians, partner logos |
| `/musicians` | Musician directory with genre, rate, and name filters |
| `/musicians/:id` | Musician profile — bio, media, rate, booking & sponsor CTAs |
| `/events` | Event listing with genre, cause, and keyword filters |
| `/events/:id` | Event detail — nonprofit info, performing artist, RSVP |
| `/events/new` | Event creation form with musician suggestions |
| `/dashboard` | Role-switching dashboard (Musician, Non-Profit, Community) |
| `/book/:id` | Booking request + checkout mockup |
| `/sponsor/:id` | Sponsor a musician's set at a non-profit event |
| `/admin` | Admin panel — impact pool, users, bookings, events |

---

## Seed Data

| Type | Count | Details |
|------|-------|---------|
| Musicians | 5 | Latin, Jazz, Folk/Country, Electronic, Blues/Rock |
| Non-Profits | 5 | Austin Food Bank, HAAM, Austin Pets Alive!, Youth Arts Coalition, Barton Springs Conservancy |
| Events | 5 | 3 upcoming, 1 without musician, 1 completed |
| Bookings | 3 | 1 confirmed, 1 completed, 1 pending |
| Impact Pool | 1 | $1,200 in / $800 out / $400 balance |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Language | TypeScript |
| Fonts | Anton, League Spartan, Open Sans (Google Fonts) |

---

## Getting Started

```bash
cd amplify-good-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Brand & Design

- **Sandy parchment gradient** background matching Canva brand guides
- **Gold card borders**, azure/sienna text on warm backgrounds
- **Hand-drawn Texas icons** — armadillo, cactus, longhorn, Austin skyline, capitol, bluebonnets
- **Genre tags** as pipe-separated text (not bubble badges)
- **Rounded rectangle buttons** — festival wristband feel
- **Colors:** Azure `#21639F`, Texan Sienna `#BF5700`, Orange `#FFB700`, Gold Rush `#FBB03B`
- **Fonts:** Anton (display), League Spartan (headings), Open Sans (body)

---

## Project Structure

```
amplify-good-app/
  src/
    app/           # Next.js App Router pages
    components/    # Navbar, Footer, GenreTags, SectionDivider
    data/          # Seed data (musicians, nonprofits, events, bookings)
  public/
    images/        # Logos, musician placeholders
      icons/       # Brand icon kit (20 hand-drawn illustrations)
Branding/          # Source brand assets (Canva guides, icon kit, logos)
PRD_2_Summary.md   # Product requirements summary
```

---

**Built for ATX | Amplify the Good City-Wide**
