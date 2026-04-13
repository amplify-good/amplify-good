import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GenreTags from "@/components/GenreTags";
import { events } from "@/data/events";
import { nonprofits } from "@/data/nonprofits";
import { musicians } from "@/data/musicians";
import { formatDate, formatTime } from "@/lib/format";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = events.find((e) => e.id === id);
  if (!event) notFound();

  const nonprofit = nonprofits.find((np) => np.id === event.nonprofitId);
  const musician = event.musicianId
    ? musicians.find((m) => m.id === event.musicianId)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-azure text-white py-14 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-blue-300 text-sm font-body mb-4">
              <Link href="/events" className="hover:text-orange transition-colors">
                Events
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{event.name}</span>
            </nav>

            <h1 className="font-display text-5xl sm:text-6xl uppercase text-orange leading-tight mb-4">
              {event.name}
            </h1>

            {/* Date, Time, Venue */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 font-body text-blue-100">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange shrink-0"
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
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-orange shrink-0 mt-0.5"
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
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-6">
              <span className="text-sm font-heading font-semibold text-orange">{event.genrePref}</span>
              <span className="text-orange/50 font-bold">|</span>
              <span className="text-sm font-heading font-semibold text-orange">{event.cause}</span>
              {event.status === "completed" && (
                <>
                  <span className="text-orange/50 font-bold">|</span>
                  <span className="text-sm font-heading font-semibold text-blue-200">Completed</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button type="button" className="btn-primary" aria-label="RSVP for this event (demo)">RSVP Now</button>
            {musician && (
              <Link
                href={`/sponsor/${event.id}`}
                className="btn-secondary inline-block"
              >
                Sponsor This Set
              </Link>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 font-body text-gray-600">
              <svg
                className="w-5 h-5 text-sienna"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                <span className="font-semibold text-gray-800">{event.rsvpCount}</span> RSVPs
              </span>
            </div>
            <div className="flex items-center gap-2 font-body text-gray-600">
              <svg
                className="w-5 h-5 text-sienna"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>
                Expected:{" "}
                <span className="font-semibold text-gray-800">
                  {event.expectedAttendance}
                </span>{" "}
                attendees
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="font-heading font-bold text-xl text-azure mb-3">
              About This Event
            </h2>
            <p className="font-body text-gray-700 leading-relaxed">
              {event.description}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2 font-body text-sm text-gray-600">
              <span className="font-semibold text-gray-700">Vibe:</span>
              <span>{event.vibe}</span>
            </div>
          </div>

          {/* Hosting Non-Profit */}
          {nonprofit && (
            <div className="card">
              <h2 className="font-heading font-bold text-xl text-azure mb-4">
                Hosted By
              </h2>
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-sand-light border border-sand-dark">
                  <Image
                    src={nonprofit.logoUrl}
                    alt={`${nonprofit.name} logo`}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {nonprofit.name}
                  </h3>
                  <p className="font-body text-sm text-gray-600 mt-1 leading-relaxed">
                    {nonprofit.bio}
                  </p>
                  <a
                    href={nonprofit.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm font-heading font-semibold text-azure hover:text-sienna transition-colors"
                  >
                    Visit Website
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Performing Musician */}
          <div className="card">
            <h2 className="font-heading font-bold text-xl text-azure mb-4">
              Performing Artist
            </h2>

            {musician ? (
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 shrink-0">
                  <img
                    src={musician.photoUrl}
                    alt={musician.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {musician.name}
                  </h3>
                  <GenreTags genres={musician.genres} className="mt-1" />
                  <p className="font-body text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                    {musician.bio}
                  </p>
                  <Link
                    href={`/musicians/${musician.id}`}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-heading font-semibold text-azure hover:text-sienna transition-colors"
                  >
                    View Profile
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-sand-light rounded-xl border border-sand-dark">
                <div className="w-14 h-14 rounded-full bg-azure/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-7 h-7 text-azure"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-azure">
                    Musician TBD — Funded by the Impact Pool
                  </p>
                  <p className="font-body text-sm text-gray-600 mt-0.5">
                    A musician will be matched to this event through the Amplify
                    the Good Impact Pool. Your sponsorship makes this possible.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Back to Events */}
          <div className="pt-2">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 font-heading font-semibold text-azure hover:text-sienna transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to All Events
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
