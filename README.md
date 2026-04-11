# Amplify Good

**Amplify the Good City-Wide** — Where Wealth Preserves Art & Art Drives Social Impact

Amplify Good is a three-sided marketplace built for Austin, TX that connects **musicians**, **non-profits**, and **community members** through a closed-loop impact exchange.

> ACL Festival meets local community. Grassroots, not corporate.

---

## The Problem: The Austin Paradox

Austin is the Live Music Capital of the World — yet its musicians struggle to make a living and its non-profits can't afford to book them. Wealth flows through the city, but not to the artists who define it.

---

## The Solution

Community members book musicians through Amplify Good and pay the musician's standard rate **plus a 15% impact commission** (framed as a donation). That commission flows into a shared **impact pool** that funds musicians to perform at non-profit events — at **zero cost to the non-profit**.

Wealth preserves art. Art drives social impact.

---

## Who It's For

### Musicians

Create a profile with bio, genre, media, rate, and socials. Get discovered by community members and non-profits. Accept or decline booking requests from your dashboard. Every gig — private or non-profit — pays your full professional rate.

### Non-Profits

Post events and get algorithmically matched with genre-appropriate musicians. The musician is paid from the impact pool at their full rate. Zero cost to the organization.

### Community Members

Browse upcoming events across Austin, book musicians for private events, or sponsor a musician's set at a non-profit event. Every booking contributes 15% to the impact pool.

---

## Demo Accounts

This prototype uses cookie-based demo auth. Log in with any of these emails (any password works):

| Email | Role | Logs in as |
| ----- | ---- | ---------- |
| `music@gmail.com` | Musician | Los Topo Chicos |
| `npo@gmail.com` | Non-Profit | Austin Food Bank |
| `fan@gmail.com` | Community | Rachel Torres |
| `event@gmail.com` | Community | David Chen |

---

## Routes

| Route | Description |
| ----- | ----------- |
| `/` | Landing page — three role sign-up paths, login link |
| `/signup` | Role-specific sign-up forms (Musician, Non-Profit, Community) |
| `/login` | Log in form |
| `/home` | Community home — event feed, featured musicians, partner logos |
| `/musicians` | Musician directory with genre, rate, and name filters |
| `/musicians/:id` | Musician profile — bio, media, rate, booking & sponsor CTAs |
| `/events` | Event listing with genre, cause, and keyword filters |
| `/events/:id` | Event detail — nonprofit info, performing artist, RSVP |
| `/events/new` | Event creation form with musician suggestions |
| `/dashboard` | Role-specific dashboard (Musician, Non-Profit, Community) |
| `/book/:id` | Booking request + checkout mockup |
| `/sponsor/:id` | Sponsor a musician's set at a non-profit event |
| `/admin` | Admin panel — impact pool, users, bookings, events |

---

## Seed Data

| Type | Count | Details |
| ---- | ----- | ------- |
| Musicians | 5 | Latin, Jazz, Folk/Country, Electronic, Blues/Rock |
| Non-Profits | 5 | Austin Food Bank, HAAM, Austin Pets Alive!, Youth Arts Coalition, Barton Springs Conservancy |
| Events | 7 | Upcoming, draft, and completed — mix of non-profit and community events |
| Bookings | 9 | Spread across all 5 musicians — confirmed, completed, and pending |
| Impact Pool | — | $1,835 in / $1,150 out / $685 available |

---

## Brand & Design

- Vibe: ACL Festival poster energy — energetic, grassroots, unapologetically optimistic. Not a corporate SaaS.
- Background: Sandy parchment gradient with burnt-edge vignette matching Canva brand guides
- Colors: Azure `#21639F` · Texan Sienna `#BF5700` · Orange `#FFB700` · Gold Rush `#FBB03B`
- Fonts: Anton (display/headings) · League Spartan (sub-headings/nav) · Open Sans (body)
- Cards: Gold borders on warm paper-textured backgrounds
- Genre tags: Pipe-separated plain text in azure — no bubble badges
- Buttons: Rounded rectangle, festival wristband feel

---

## Demo Context

Built for the Alpha City Limits Pilot — May 31, 2026

This is a frontend-only clickable prototype with pre-loaded example data. There is no backend, no database, and no payment processing. The goal is to demonstrate the full platform loop at the Alpha City Limits pilot event.

---

## Getting Started

```bash
cd amplify-good-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). See [amplify-good-app/README.md](amplify-good-app/README.md) for developer setup details.

---

## Project Structure

```text
amplify-good-app/    # Next.js app (see its README for full details)
Branding/            # Source brand assets (Canva guides, icon kit, logos)
PRD_Summary.md       # Full product requirements document summary
```

---

**Built for ATX | Amplify the Good City-Wide**
