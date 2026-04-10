# Amplify Good - PRD 2 Summary

## What Is Amplify Good?

Amplify Good is a **three-sided marketplace** built for **Austin, TX** that connects **musicians**, **non-profits**, and **community members** through a closed-loop impact exchange. It solves the "Austin Paradox": Austin is the Live Music Capital of the World, yet its musicians struggle to make a living and its non-profits can't afford to book them.

**The core mechanism:** Community members book musicians through the platform and pay the musician's standard rate **+ a 15% impact commission** (framed as a "donation"). That commission flows into an **impact pool** that funds musicians to perform at non-profit events — at zero cost to the non-profit. Wealth preserves art, art drives social impact.

**Tagline:** "Amplify the Good City-Wide" — Where Wealth Preserves Art & Art Drives Social Impact.

---

## Users & Their Workflows

### 1. Musicians (Local ATX Artists)

**Sign-Up Fields:**
- Name, Email, Password
- Bio (500 char max)
- Genre (predefined list + up to 3 custom tags: Rock, Jazz, Country, Hip-Hop, R&B, Mariachi, Classical, Electronic, Folk, Latin, Blues, etc.)
- Media (upload or link — SoundCloud, Spotify, YouTube, Vimeo; up to 10 items)
- Social Links (Instagram, Twitter/X, TikTok, Facebook, website — optional)
- Standard Professional Rate (hourly or per-event)
- Profile Photo

**Workflow:**
1. Sign up and create a full profile (bio, genre, media, rate, photo, socials).
2. Profile doubles as their public-facing page — community members and non-profits discover them here.
3. Receive **booking requests** via email and in-app notifications (shows event name, date, location, attendance, payout amount).
4. **Accept or decline** requests from their dashboard.
5. Once accepted, the gig is confirmed.

**Dashboard Features:**
- Incoming booking requests with accept/decline actions
- Upcoming confirmed gigs (date, venue, event name, payout)
- Past gigs with earnings history
- Total earnings summary (lifetime earnings, impact gigs played, private gigs played)
- Notification badge for unread requests (e.g., "2 new booking requests")
- Quick link to edit profile

**Key Principle:** Every gig on the platform — private or non-profit — pays the musician their **full professional rate** (their "Living Wage Floor").

---

### 2. Non-Profits (Registered Charities & Community Orgs)

**Sign-Up Fields:**
- Organization Name, Bio/Mission (1000 char max), Website, Logo Upload, Contact Email, Password

**Workflow:**
1. Sign up and create an organization profile.
2. **Create events** via a form: Event Name, Date & Time, Venue/Location, Vibe/Theme (e.g., "casual outdoor BBQ," "formal gala"), Expected Attendance, Genre of Music, Description (optional), Cause/Category (Youth, Environment, Healthcare, Animal Rescue, Arts & Culture, etc.).
3. **Find a musician** in two ways:
   - **Algorithmic Suggestions:** Platform auto-suggests up to 3 genre-matched musicians after event submission. Non-profit reviews and confirms.
   - **Browse & Search:** Search the full musician directory (filter by genre, rate range, name, availability by date).
4. Musician is **paid from the impact pool** at their full rate — **zero cost to the non-profit**.
5. Manage events from their Organization Dashboard.

**Dashboard Features:**
- List of created events with status (upcoming, past, draft)
- Per event: confirmed musician, RSVP count, event details
- Edit or cancel upcoming events

---

### 3. Community Members (Austin Residents, Event Hosts, Anyone)

**Sign-Up Fields:**
- Name, Email, Password (simplest onboarding — get them in fast)

**Workflow — Browse Events:**
1. Land on community home page after login — see upcoming events (non-profit fundraisers + community events).
2. Search/filter events by: Date, Genre, Cause/Category, Keyword.
3. From any event: RSVP, view performing musician's profile, or sponsor the set.

**Workflow — Book a Musician ("Find a Musician"):**
1. Search the musician directory (filter by genre, rate range, name, availability).
2. View musician profiles (bio, media, rate, socials).
3. Click "Request Booking" — fill out: Event Name, Date & Time, Venue/Location, Duration, Message to Musician (optional).
4. Musician receives the request, can accept/decline/reply.
5. Once accepted, proceed to **checkout**: Musician's Rate + 15% Impact Commission (Donation) = Total.
6. The 15% donation feeds the impact pool.

**Workflow — Sponsor a Musician ("Adopt an Artist"):**
1. From a musician's profile or a non-profit event listing, choose "Sponsor This Set."
2. Pay the musician's full professional rate directly — musician performs at the non-profit event at zero cost to the org.
3. Sponsor is recognized on the event page as the "Impact Sponsor."
4. Turns any community member into a patron of Austin's music scene beyond the passive 15% commission.

---

### 4. Admin (Amplify Good Team)

- Manage seed data and user accounts
- Moderate content
- Oversee the impact pool balance and transactions
- Admin panel at `/admin`

---

## Design & Styling

### Vibe
**"ACL Festival meets local community"** — grassroots Austin festival feel, NOT a corporate SaaS tool. Gritty-but-clean, like a festival poster, not a vintage filter. Energetic, urgent, and unapologetically optimistic.

### Color Palette

**Primary Colors:**
| Name | Hex | Usage |
|------|-----|-------|
| Azure | `#21639F` | Primary brand color — headers, CTAs, links, navigation, trust elements |
| Texan Sienna | `#BF5700` | Secondary accent — sub-headings, highlights, warm accents ("Burnt Orange") |
| Orange (ACL) | `#FFB700` | Energy color — primary action buttons, badges, hover states, active indicators |
| Light Blue | `#DFEEFB` | Backgrounds, card fills, light surfaces — keeps UI airy and clean |

**Extended Festival Palette (Accents):**
| Name | Hex | Usage |
|------|-----|-------|
| Desert Turquoise | `#00A6A3` | Success states, impact metrics, positive indicators |
| Dusk Purple | `#4D1378` | Premium accents, special event badges, evening-themed elements |
| Gold Rush | `#FBB03B` | Impact pool visuals, financial summaries, earnings displays |
| Hill Country Green | `#348F41` | Community tags, eco/outdoor event markers, growth indicators |

**Rules:** No black backgrounds. No vivid crimson. Palette evokes an Austin sunset and Hill Country landscape — warm, vibrant, inviting.

### Typography
| Role | Font | Usage |
|------|------|-------|
| Display / Headers | **Anton** | All headings, hero text, bold statements, CTAs. ALL-CAPS for primary CTAs. ACL festival poster style — condensed, bold, energetic. |
| Sub-Headers | **League Spartan** or **Montserrat Bold** | Secondary headings, section labels, navigation items |
| Body Text | **Open Sans** | All body copy, form labels, descriptions, profiles, event details. Clean and legible. |

### Iconography & Illustration
- **Vector-style, hand-drawn illustrations only** — Longhorns, Armadillos, Guitars, Cacti, Capitol Dome, Festival Guitar, Austin Skyline, Saguaro Cactus, Civic Spark Sunburst, Rhythmic Notes Motif.
- **Hero Logo:** Microphone-Fist inside a shield with a lightning bolt ("Civic Spark").
- Distressed textures used sparingly for character, not decay.
- All icons use the four primary brand colors.

### UI Components
- **Backgrounds:** Light Blue (`#DFEEFB`) or off-white paper textures. No dark mode or black corporate looks.
- **Cards:** Rounded corners, light borders, white or light blue fill. Used for event listings, musician profiles, dashboard items.
- **Buttons:** Rounded corners or "badge" styles evoking festival wristbands / backstage passes. Primary actions in **Orange** (`#FFB700`), secondary in **Azure** (`#21639F`) outline.
- **Profile Photos:** Circular frames for musicians.
- **Genre Tags:** Pill-shaped badges in Light Blue with Azure text.
- **Impact Metrics:** Use **Gold Rush** (`#FBB03B`) for financial numbers and pool balances.

### Brand Voice
- **Energetic:** Lively and active, reflecting Austin's music culture.
- **Grassroots:** Accessible, community-driven, never corporate-speak.
- **Optimistic:** Frame challenges as opportunities, lead with possibility.
- **Bold:** Strong calls to action, confident positioning.
- **Wording Rule:** Always use "Amplify the Good" in user-facing copy. Never "Join the Engine," "Booking Software," or "Financial Hub."

### Landing Page
- Centers the logo with tagline "Amplify the Good City-Wide"
- Three sign-up paths:
  - **I'm a Musician** — Create your profile, set your rate, and get booked.
  - **I'm a Non-Profit** — Post events and get matched with musicians at zero cost.
  - **I Need a Musician** — Browse events, book musicians, or sponsor a set.
- "Already have an account? Log in" link below
- **No scrolling, no content overload.** Logo is the hero element. Zero friction to sign-up or login.
- Event feeds, musician directories, and partner showcases live on role-specific pages after login — NOT on the landing page.

---

## Information Architecture (Sitemap)

| Route | Purpose |
|-------|---------|
| `/` | Landing Page (logo, three sign-up paths, login link) |
| `/signup` | Role selection → role-specific sign-up form |
| `/login` | Authentication |
| `/home` | Community home (event feed, featured musicians, partner logos — after login) |
| `/musicians` | Musician directory (search by genre, filter by rate) |
| `/musicians/:id` | Individual musician profile |
| `/events` | Event listing (upcoming events, filterable) |
| `/events/:id` | Event detail page |
| `/events/new` | Event creation form (non-profit only) |
| `/dashboard` | Role-specific dashboard |
| `/book/:musicianId` | Booking request flow |
| `/sponsor/:eventId` | Sponsor a set flow |
| `/admin` | Admin panel |

---

## Demo Scope (Alpha City Limits Pilot — May 31, 2026)

A **frontend-only clickable prototype with pre-loaded example data** — not a production app. There is **no real backend, no database, no authentication, and no payment processing.** The goal is to demonstrate the platform's core loop at the Alpha City Limits festival (May 31, 2026).

**What's Built (Frontend Only):** All page layouts, UI components, navigation, sign-up forms, profiles, musician directory, dashboards, booking forms, checkout page, and sponsor flow — fully designed and clickable.

**What's Example/Mock Data:** All data is hardcoded example data for demo purposes:
- No real user registration or login — forms are visual only
- No real email notifications — dashboard shows pre-set notification badges
- No real payments — checkout page is a styled mockup showing the rate + 15% breakdown
- No real matching algorithm — musician suggestions are a pre-selected list
- No real availability calendar — all musicians show as available
- Search/filters pull from a static dataset
- Messaging is a pre-written chat-style display

**Seed Data:** 5 musicians (Jazz, Folk, Rock, Latin, Blues), 5 non-profits, 3-5 events, 2-3 sample bookings, 1 pre-set impact pool ($1,200 in, $800 out, $400 available).

**Three Demo Walkthrough Paths:**
1. **Musician:** Landing → Sign up → See profile → Dashboard → View booking request → Accept → See gigs & earnings
2. **Non-Profit:** Landing → Sign up → Org dashboard → Create event → View 3 suggested musicians → Confirm → See event with musician
3. **Community Member:** Landing → Sign up → Browse events → Find musician → View profile → Request booking → Musician accepts → Checkout (rate + 15%) → Confirmation
