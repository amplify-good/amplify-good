"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { musicians } from "@/data/musicians";
import { nonprofits } from "@/data/nonprofits";
import { events } from "@/data/events";
import { bookings } from "@/data/bookings";
import { getSession } from "@/lib/auth";
import { formatDate, formatTime, formatMoney } from "@/lib/format";

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    upcoming: "bg-green-100 text-green-800 border border-green-300",
    completed: "bg-blue-100 text-blue-800 border border-blue-300",
    draft: "bg-gray-100 text-gray-600 border border-gray-300",
    confirmed: "bg-green-100 text-green-800 border border-green-300",
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    cancelled: "bg-red-100 text-red-700 border border-red-300",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-heading font-semibold uppercase tracking-wide ${styles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

// ─── Genre Pill ───────────────────────────────────────────────────────────────

function GenrePill({ genre }: { genre: string }) {
  return <span className="genre-pill">{genre}</span>;
}

// ─── Role Selector (default view) ─────────────────────────────────────────────

function RoleSelector() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
      <img src="/images/icons/sun_icon_middle.png" alt="" className="h-14 w-auto mb-4" aria-hidden="true" />
      <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-azure mb-4 text-center">
        Your Dashboard
      </h1>
      <p className="font-body text-gray-600 mb-12 text-center max-w-md">
        Choose how you&apos;re showing up today.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {[
          { href: "/dashboard?role=musician", icon: "/images/icons/guitar_icon.png", label: "Musician", desc: "Manage bookings & gigs" },
          { href: "/dashboard?role=nonprofit", icon: "/images/icons/hands_heart_window_icon.png", label: "Non-Profit", desc: "Organize events & find talent" },
          { href: "/dashboard?role=community", icon: "/images/icons/civic_impact_window_icon.png", label: "Community", desc: "Track bookings & impact" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="card flex flex-col items-center p-8 hover:shadow-lg transition-shadow group text-center"
          >
            <div className="h-16 flex items-center justify-center mb-4">
              <img src={item.icon} alt={item.label} className="max-h-full max-w-[60px] object-contain" />
            </div>
            <h2 className="font-heading font-bold text-xl text-azure group-hover:text-sienna transition-colors">
              {item.label}
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-body">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Musician Dashboard ───────────────────────────────────────────────────────

function MusicianDashboard() {
  const musician = musicians.find((m) => m.id === "m1")!;

  // Pending bookings for m1
  const pendingBookings = bookings.filter(
    (b) => b.musicianId === "m1" && b.status === "pending"
  );

  // Confirmed private bookings for m1
  const confirmedPrivate = bookings.filter(
    (b) => b.musicianId === "m1" && b.status === "confirmed"
  );

  // Events where musician is assigned (confirmed/upcoming)
  const assignedEvents = events.filter((e) => e.musicianId === "m1");

  // Earnings calculations
  const completedPrivate = bookings.filter(
    (b) => b.musicianId === "m1" && b.status === "completed"
  );
  const completedEvents = events.filter(
    (e) => e.musicianId === "m1" && e.status === "completed"
  );
  const totalEarnings = completedPrivate.reduce(
    (sum, b) => sum + b.musicianRate,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-azure">
            Welcome back,
          </h1>
          <h2 className="font-heading text-3xl font-bold text-sienna">
            {musician.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-body text-gray-600">Booking Requests</span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange text-white text-sm font-bold">
            {pendingBookings.length}
          </span>
        </div>
      </div>

      {/* Incoming Requests */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Incoming Requests
        </h3>
        {pendingBookings.length === 0 ? (
          <p className="text-gray-500 font-body">No pending requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="card space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-heading font-bold text-lg text-gray-800">
                    {booking.eventName}
                  </h4>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="text-sm font-body text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-700">Date:</span>{" "}
                    {formatDate(booking.eventDate)} at{" "}
                    {formatTime(booking.eventDate)}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Location:
                    </span>{" "}
                    {booking.location}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Duration:
                    </span>{" "}
                    {booking.duration}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Payout:</span>{" "}
                    <span className="text-gold font-bold">
                      {formatMoney(booking.musicianRate)}
                    </span>
                  </p>
                </div>
                {booking.message && (
                  <blockquote className="border-l-4 border-sand-dark pl-3 text-sm italic text-gray-500 font-body">
                    &ldquo;{booking.message}&rdquo;
                  </blockquote>
                )}
                <div className="flex gap-3 pt-1">
                  <button className="btn-primary text-sm !py-2 !px-4" aria-label={`Accept booking for ${booking.eventName}`}>
                    Accept
                  </button>
                  <button className="btn-secondary text-sm !py-2 !px-4" aria-label={`Decline booking for ${booking.eventName}`}>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Gigs */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Upcoming Gigs
        </h3>
        <div className="space-y-3">
          {/* Confirmed private bookings */}
          {confirmedPrivate.map((booking) => (
            <div
              key={booking.id}
              className="card flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-heading font-bold text-gray-800">
                  {booking.eventName}
                </p>
                <p className="text-sm font-body text-gray-500">
                  {formatDate(booking.eventDate)} &middot; {booking.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gold font-bold text-lg">
                  {formatMoney(booking.musicianRate)}
                </p>
                <p className="text-xs text-gray-400 font-body">private gig</p>
              </div>
            </div>
          ))}
          {/* Impact events (non-profit assigned events) */}
          {assignedEvents
            .filter((e) => e.status === "upcoming")
            .map((ev) => (
              <div
                key={ev.id}
                className="card flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <p className="font-heading font-bold text-gray-800">
                    {ev.name}
                  </p>
                  <p className="text-sm font-body text-gray-500">
                    {formatDate(ev.dateTime)} &middot; {ev.venue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-turquoise font-bold text-lg">
                    Impact Gig
                  </p>
                  <p className="text-xs text-gray-400 font-body">
                    {ev.rsvpCount} RSVPs expected
                  </p>
                </div>
              </div>
            ))}
          {confirmedPrivate.length === 0 &&
            assignedEvents.filter((e) => e.status === "upcoming").length ===
              0 && (
              <p className="text-gray-500 font-body">No upcoming gigs yet.</p>
            )}
        </div>
      </section>

      {/* Earnings Summary */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Earnings Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
              Lifetime Earnings
            </p>
            <p className="impact-number text-gold">
              {formatMoney(totalEarnings || 500)}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
              Impact Gigs
            </p>
            <p className="impact-number text-turquoise">
              {completedEvents.length}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
              Private Gigs
            </p>
            <p className="impact-number text-azure">
              {completedPrivate.length}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Non-Profit Dashboard ─────────────────────────────────────────────────────

function NonProfitDashboard() {
  const org = nonprofits.find((n) => n.id === "np1")!;
  const orgEvents = events.filter((e) => e.nonprofitId === "np1");

  // Events needing musicians (upcoming + no musician)
  const eventsNeedingMusician = orgEvents.filter(
    (e) => e.status === "upcoming" && !e.musicianId
  );

  function getSuggestedMusicians(genrePref: string) {
    const matched = musicians.filter((m) =>
      m.genres.some(
        (g) => g.toLowerCase() === genrePref.toLowerCase()
      )
    );
    const others = musicians.filter(
      (m) => !m.genres.some((g) => g.toLowerCase() === genrePref.toLowerCase())
    );
    return [...matched, ...others].slice(0, 3);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-azure">
            Welcome back,
          </h1>
          <h2 className="font-heading text-3xl font-bold text-sienna">
            {org.name}
          </h2>
        </div>
        <Link href="/events/new" className="btn-primary self-start">
          + Create New Event
        </Link>
      </div>

      {/* Your Events */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Your Events
        </h3>
        {orgEvents.length === 0 ? (
          <p className="text-gray-500 font-body">No events yet.</p>
        ) : (
          <div className="space-y-4">
            {orgEvents.map((ev) => {
              const assignedMusician = ev.musicianId
                ? musicians.find((m) => m.id === ev.musicianId)
                : null;
              return (
                <div key={ev.id} className="card space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h4 className="font-heading font-bold text-lg text-gray-800">
                      {ev.name}
                    </h4>
                    <StatusBadge status={ev.status} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm font-body text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-700">Date:</span>{" "}
                      {formatDate(ev.dateTime)} at {formatTime(ev.dateTime)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Venue:
                      </span>{" "}
                      {ev.venue}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Musician:
                      </span>{" "}
                      {assignedMusician ? (
                        <span className="text-turquoise font-semibold">
                          {assignedMusician.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          Not yet confirmed
                        </span>
                      )}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        RSVPs:
                      </span>{" "}
                      {ev.rsvpCount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Musician Suggestions */}
      {eventsNeedingMusician.length > 0 && (
        <section>
          <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
            Musician Suggestions
          </h3>
          <div className="space-y-8">
            {eventsNeedingMusician.map((ev) => {
              const suggestions = getSuggestedMusicians(ev.genrePref);
              return (
                <div key={ev.id}>
                  <p className="font-heading font-semibold text-gray-700 mb-3">
                    For{" "}
                    <span className="text-sienna">{ev.name}</span> &mdash;
                    looking for{" "}
                    <span className="genre-pill">{ev.genrePref}</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {suggestions.map((m) => (
                      <div
                        key={m.id}
                        className="card space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <p className="font-heading font-bold text-gray-800">
                            {m.name}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {m.genres.map((g) => (
                              <GenrePill key={g} genre={g} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 font-body mt-2">
                            {formatMoney(m.rate)}{" "}
                            {m.rateType === "hourly" ? "/ hr" : "/ event"}
                          </p>
                        </div>
                        <button className="btn-primary text-sm !py-2 !px-4 mt-2 w-full">
                          Confirm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Community Member Dashboard ───────────────────────────────────────────────

function CommunityDashboard() {
  const totalImpact = bookings.reduce((sum, b) => sum + b.commissionAmount, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wide text-azure">
          Welcome back!
        </h1>
        <p className="font-body text-gray-500 mt-1">
          Here&apos;s everything happening with your bookings and impact.
        </p>
      </div>

      {/* Your Bookings */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Your Bookings
        </h3>
        {bookings.length === 0 ? (
          <p className="text-gray-500 font-body">No bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => {
              const musician = musicians.find(
                (m) => m.id === booking.musicianId
              );
              return (
                <div key={booking.id} className="card space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-heading font-bold text-lg text-gray-800">
                      {booking.eventName}
                    </h4>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="text-sm font-body text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">
                        Musician:
                      </span>{" "}
                      <span className="text-turquoise font-semibold">
                        {musician?.name ?? "Unknown"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Date:</span>{" "}
                      {formatDate(booking.eventDate)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Total Charged:
                      </span>{" "}
                      <span className="text-gold font-bold">
                        {formatMoney(booking.totalCharged)}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Impact Summary */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Your Impact
        </h3>
        <div className="card text-center max-w-sm">
          <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-2">
            Total Contributed to Impact Pool
          </p>
          <p className="impact-number text-gold">{formatMoney(totalImpact)}</p>
          <p className="text-xs font-body text-gray-400 mt-2">
            Every booking contributes a portion to fund live music at non-profit
            events across Austin.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/musicians" className="btn-primary">
            Find a Musician
          </Link>
          <Link href="/events" className="btn-secondary">
            Browse Events
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── Inner dashboard (reads search params) ────────────────────────────────────

function DashboardInner() {
  const searchParams = useSearchParams();
  const paramRole = searchParams.get("role");

  // Use URL param first, fall back to cookie session
  const session = getSession();
  const role = paramRole || session?.role;

  if (role === "musician") return <MusicianDashboard />;
  if (role === "nonprofit") return <NonProfitDashboard />;
  if (role === "community") return <CommunityDashboard />;
  return <RoleSelector />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="font-body text-gray-500 text-lg animate-pulse">
                Loading dashboard…
              </p>
            </div>
          }
        >
          <DashboardInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
