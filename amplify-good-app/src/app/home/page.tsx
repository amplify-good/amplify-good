import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events } from "@/data/events";
import { musicians } from "@/data/musicians";
import { nonprofits } from "@/data/nonprofits";
import { bookings, impactPool } from "@/data/bookings";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  // Show only upcoming events in the feed, sorted soonest first
  const upcomingEvents = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Feature the first 3 musicians
  const featuredMusicians = musicians.slice(0, 3);

  // Quick community stats derived from seed data
  const totalRsvps = events.reduce((sum, e) => sum + e.rsvpCount, 0);
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "completed").length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* ── Hero / Page Header ─────────────────────────────────────────── */}
        <div className="bg-parchment py-12 border-b-2 border-gold">
          <div className="max-w-7xl mx-auto px-4 flex items-stretch gap-5">
            <img
              src="/images/icons/austin_skyline_icon.png"
              alt=""
              aria-hidden="true"
              className="h-20 w-auto hidden sm:block flex-shrink-0 self-center object-contain"
            />
            <div className="flex flex-col justify-center">
              <h1 className="font-display text-5xl sm:text-6xl uppercase text-azure mb-2">
                Welcome Home
              </h1>
              <p className="font-heading text-sienna text-lg">
                Austin's festival community bulletin board — music, impact, and the people making it happen.
              </p>
            </div>
          </div>
        </div>

        {/* ── Community Pulse Strip ──────────────────────────────────────── */}
        <div className="bg-azure text-white">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap gap-8 justify-center sm:justify-start">
            <div className="flex flex-col items-center sm:items-start">
              <span className="impact-number text-4xl">{upcomingEvents.length}</span>
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
              <span className="impact-number text-4xl">{musicians.length}</span>
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
              <span className="impact-number text-4xl">{confirmedBookings}</span>
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
            <Link href="/events" className="btn-secondary !py-2 !px-5 text-sm">
              View All
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="font-body text-gray-500 text-center py-12">
              No upcoming events right now — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                const nonprofit = nonprofits.find((np) => np.id === event.nonprofitId);
                const musician = event.musicianId
                  ? musicians.find((m) => m.id === event.musicianId)
                  : null;

                return (
                  <Link key={event.id} href={`/events/${event.id}`} className="block group">
                    <div className="card h-full flex flex-col gap-3 group-hover:shadow-lg transition-shadow border-t-4 border-t-azure">
                      {/* Event name */}
                      <h3 className="font-heading font-bold text-xl text-azure group-hover:text-sienna transition-colors leading-tight">
                        {event.name}
                      </h3>

                      {/* Date & time */}
                      <div className="flex items-start gap-2 text-sm font-body text-gray-600">
                        <svg
                          className="w-4 h-4 mt-0.5 shrink-0 text-sienna"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {formatDate(event.dateTime)} &middot; {formatTime(event.dateTime)}
                        </span>
                      </div>

                      {/* Venue */}
                      <div className="flex items-start gap-2 text-sm font-body text-gray-600">
                        <svg
                          className="w-4 h-4 mt-0.5 shrink-0 text-sienna"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{event.venue}</span>
                      </div>

                      {/* Hosted by */}
                      {nonprofit && (
                        <div className="text-sm font-body text-gray-500">
                          <span className="font-semibold text-gray-700">Hosted by:</span>{" "}
                          {nonprofit.name}
                        </div>
                      )}

                      {/* Musician */}
                      <div className="text-sm font-body">
                        {musician ? (
                          <span className="text-gray-600">
                            <span className="font-semibold text-gray-700">Performing:</span>{" "}
                            {musician.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Musician TBD</span>
                        )}
                      </div>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Genre | Cause + RSVPs */}
                      <div className="flex justify-between items-center pt-2 pb-1 border-t border-sand-dark">
                        <span className="text-sm font-heading font-semibold text-azure uppercase tracking-wide">
                          {event.genrePref}{" "}
                          <span className="text-gold font-bold mx-0.5">|</span>{" "}
                          {event.cause}
                        </span>
                        <span className="text-sm font-heading font-semibold text-sienna uppercase tracking-wide">
                          {event.rsvpCount} RSVPs
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
            <Link href="/musicians" className="btn-secondary !py-2 !px-5 text-sm">
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featuredMusicians.map((musician) => (
              <div key={musician.id} className="card flex flex-col gap-4">
                {/* Photo */}
                <div className="flex justify-center">
                  <img
                    src={musician.photoUrl}
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
                    {musician.rateType === "hourly" ? "/ hr" : "/ event"}
                  </span>
                </p>

                {/* CTA */}
                <div className="mt-auto pt-2">
                  <Link
                    href="/musicians"
                    className="btn-primary block text-center !py-2 !px-4 text-sm"
                  >
                    Book Now
                  </Link>
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
          <div className="flex items-center gap-3 mb-8">
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

          <p className="font-body text-gray-600 mb-8 max-w-2xl">
            Every event on Amplify Good benefits one of these Austin nonprofits. Your ticket, your booking, your presence — it all flows directly back to the causes that make this city worth celebrating.
          </p>

          {/* Logo row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
            {nonprofits.map((np) => (
              <a
                key={np.id}
                href={np.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                aria-label={np.name}
              >
                <img
                  src={np.logoUrl}
                  alt={np.name}
                  className="h-14 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <span className="font-heading font-semibold text-xs text-gray-500 group-hover:text-azure transition-colors text-center max-w-[100px]">
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
                <Link href="/dashboard" className="btn-secondary">
                  My Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
