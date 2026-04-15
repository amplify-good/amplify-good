import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/db/events";
import { getMusicians } from "@/lib/db/musicians";
import { getNonprofits } from "@/lib/db/nonprofits";
import { getImpactPoolSummary } from "@/lib/db/impact";
import { getServerSession } from "@/lib/supabase/server";

export default async function HomePage() {
  const [session, upcomingEvents, allMusicians, allNonprofits, impactPool] = await Promise.all([
    getServerSession(),
    getEvents({ status: "upcoming" }),
    getMusicians(),
    getNonprofits(),
    getImpactPoolSummary(),
  ]);

  // Sort events by date_time ascending
  const sortedEvents = [...upcomingEvents].sort(
    (a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
  );

  // Feature the first 3 musicians
  const featuredMusicians = allMusicians.slice(0, 3);

  // Quick community stats derived from DB data
  const totalRsvps = upcomingEvents.reduce((sum, e) => sum + e.rsvp_count, 0);
  const confirmedBookingsCount = 0; // will be populated once bookings are user-specific

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar initialSession={session} />

      <main className="flex-1">

        {/* ── Hero / Page Header ─────────────────────────────────────────── */}
        <div className="bg-parchment py-12 border-b-2 border-gold">
          <div className="max-w-7xl mx-auto px-4 flex items-stretch gap-5">
            <img
              src="/images/icons/austin_skyline_icon.png"
              alt=""
              aria-hidden="true"
              className="h-20 w-auto hidden sm:block shrink-0 self-center object-contain"
            />
            <div className="flex flex-col justify-center">
              <h1 className="font-display text-5xl sm:text-6xl uppercase text-azure mb-2">
                Welcome Home
              </h1>
              <p className="font-heading text-sienna text-lg">
                Austin&apos;s festival community bulletin board — music, impact, and the people making it happen.
              </p>
            </div>
          </div>
        </div>

        {/* ── Community Pulse Strip ──────────────────────────────────────── */}
        <div className="bg-azure text-white">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-8 justify-center sm:justify-start">
            <div className="flex flex-col items-center sm:items-start">
              <span className="impact-number text-4xl">{sortedEvents.length}</span>
              <span className="font-heading font-semibold text-xs uppercase tracking-widest text-blue-200 mt-1">
                Upcoming Events
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="impact-number text-4xl">{totalRsvps.toLocaleString()}</span>
              <span className="font-heading font-semibold text-xs uppercase tracking-widest text-blue-200 mt-1">
                Community RSVPs
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="impact-number text-4xl">{allMusicians.length}</span>
              <span className="font-heading font-semibold text-xs uppercase tracking-widest text-blue-200 mt-1">
                Local Artists
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="impact-number text-4xl">${impactPool.balance.toLocaleString()}</span>
              <span className="font-heading font-semibold text-xs uppercase tracking-widest text-blue-200 mt-1">
                Impact Pool
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="impact-number text-4xl">{confirmedBookingsCount}</span>
              <span className="font-heading font-semibold text-xs uppercase tracking-widest text-blue-200 mt-1">
                Active Bookings
              </span>
            </div>
          </div>
        </div>

        {/* ── Upcoming Events Feed ───────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/icons/music_notes_icon.png"
                alt=""
                aria-hidden="true"
                className="h-8 w-auto object-contain"
              />
              <h2 className="font-display text-3xl uppercase text-azure">
                Upcoming Events
              </h2>
            </div>
            <Link href="/events" className="btn-secondary py-2! px-5! text-sm">
              View All
            </Link>
          </div>

          {sortedEvents.length === 0 ? (
            <p className="font-body text-gray-500 text-center py-12">
              No upcoming events right now — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  nonprofit={allNonprofits.find((np) => np.id === event.nonprofit_id)}
                  musician={event.musician_id ? allMusicians.find((m) => m.id === event.musician_id) ?? null : null}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4">
          <hr className="border-sand-dark" />
        </div>

        {/* ── Featured Musicians ────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/icons/guitar_icon.png"
                alt=""
                aria-hidden="true"
                className="h-8 w-auto object-contain"
              />
              <h2 className="font-display text-3xl uppercase text-azure">
                Featured Artists
              </h2>
            </div>
            <Link href="/musicians" className="btn-secondary py-2! px-5! text-sm">
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featuredMusicians.map((musician) => (
              <div key={musician.id} className="card flex flex-col gap-4">
                {/* Photo */}
                <div className="flex justify-center">
                  <img
                    src={musician.photo_url ?? "/images/icons/musician_profile_window_icon.png"}
                    alt={musician.name}
                    className="h-20 w-20 object-contain"
                  />
                </div>

                {/* Name */}
                <h3 className="font-heading font-bold text-lg text-azure text-center leading-tight">
                  {musician.name}
                </h3>

                {/* Genres — plain azure text separated by gold pipes */}
                <p className="text-center font-heading font-semibold text-sm text-azure">
                  {musician.genres.map((genre, idx) => (
                    <span key={genre}>
                      {genre}
                      {idx < musician.genres.length - 1 && (
                        <span className="text-gold mx-1 font-bold">|</span>
                      )}
                    </span>
                  ))}
                </p>

                {/* Rate */}
                <p className="text-center">
                  <span className="impact-number text-2xl">
                    ${musician.rate}
                  </span>
                  <span className="font-body text-sm text-gray-500 ml-1">
                    {musician.rate_type === "hourly" ? "/ hr" : "/ event"}
                  </span>
                </p>

                {/* CTA */}
                <div className="mt-auto pt-2">
                  {session?.role === 'community' ? (
                    <Link
                      href={`/book/${musician.id}`}
                      className="btn-primary block text-center py-2! px-4! text-sm"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <Link
                      href={`/musicians/${musician.id}`}
                      className="btn-primary block text-center py-2! px-4! text-sm"
                    >
                      View Profile
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4">
          <hr className="border-sand-dark" />
        </div>

        {/* ── Nonprofit Partner Logos ───────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img
                src="/images/icons/hands_heart_window_icon.png"
                alt=""
                aria-hidden="true"
                className="h-8 w-auto object-contain"
              />
              <h2 className="font-display text-3xl uppercase text-azure">
                Our Partners
              </h2>
            </div>
            <Link href="/donate" className="btn-primary py-2! px-5! text-sm">
              Donate
            </Link>
          </div>

          <p className="font-body text-gray-600 mb-8 max-w-2xl">
            Every event on Amplify Good benefits one of these Austin nonprofits. Your ticket, your booking, your presence — it all flows directly back to the causes that make this city worth celebrating.
          </p>

          {/* Logo row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {allNonprofits.map((np) => (
              <a
                key={np.id}
                href={np.website ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 hover:scale-105 transition-transform"
                aria-label={np.name}
              >
                <div className="h-14 w-14 flex items-center justify-center">
                  <img
                    src={np.logo_url ?? "/images/icons/hands_heart_window_icon.png"}
                    alt={np.name}
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <span className="font-heading font-semibold text-xs text-gray-500 group-hover:text-azure transition-colors text-center leading-tight">
                  {np.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Bulletin Board CTA Row ────────────────────────────────────── */}
        <section className="bg-parchment border-t-2 border-gold">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-4 justify-between">

              {/* Icon accent */}
              <div className="flex items-center gap-4 shrink-0">
                <img
                  src="/images/icons/capitol_sunburst_icon.png"
                  alt=""
                  aria-hidden="true"
                  className="h-16 w-auto object-contain hidden sm:block"
                />
                <div>
                  <h2 className="font-display text-3xl uppercase text-azure leading-tight">
                    Ready to Plug In?
                  </h2>
                  <p className="font-heading text-sienna text-base mt-1">
                    Find your next event, book a musician, or track your impact.
                  </p>
                </div>
              </div>

              {/* Quick-nav buttons */}
              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                <Link href="/events" className="btn-primary">
                  Browse Events
                </Link>
                <Link href="/musicians" className="btn-secondary">
                  Find a Musician
                </Link>
                {session && (
                  <Link href="/dashboard" className="btn-secondary">
                    My Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer isLoggedIn={!!session} />
    </div>
  );
}
