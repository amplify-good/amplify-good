"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, Event } from "@/data/events";
import { nonprofits } from "@/data/nonprofits";
import { musicians, allGenres } from "@/data/musicians";
import { allCauses } from "@/data/nonprofits";

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

function causeColor(cause: string): string {
  const map: Record<string, string> = {
    Healthcare: "bg-turquoise text-white",
    Youth: "bg-purple text-white",
    Environment: "bg-green text-white",
    "Animal Rescue": "bg-sienna text-white",
    "Arts & Culture": "bg-gold text-foreground",
  };
  return map[cause] ?? "bg-azure text-white";
}

export default function EventsPage() {
  const [genreFilter, setGenreFilter] = useState("");
  const [causeFilter, setCauseFilter] = useState("");
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    return events.filter((event: Event) => {
      const matchesGenre =
        !genreFilter || event.genrePref === genreFilter;
      const matchesCause =
        !causeFilter || event.cause === causeFilter;
      const kw = keyword.toLowerCase();
      const matchesKeyword =
        !kw ||
        event.name.toLowerCase().includes(kw) ||
        event.description.toLowerCase().includes(kw);
      return matchesGenre && matchesCause && matchesKeyword;
    });
  }, [genreFilter, causeFilter, keyword]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-parchment py-12 border-b-2 border-gold">
          <div className="max-w-7xl mx-auto px-4 flex items-stretch gap-5">
            <img src="/images/icons/austin_skyline_icon.png" alt="" className="h-20 w-auto hidden sm:block flex-shrink-0 self-center object-contain" aria-hidden="true" />
            <div className="flex flex-col justify-center">
              <h1 className="font-display text-5xl sm:text-6xl uppercase text-azure mb-2">
                Upcoming Events
              </h1>
              <p className="font-heading text-sienna text-lg">
                Live music meets social impact — find an event and make a difference.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-sand-light border-b border-sand-dark shadow-sm sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Keyword Search */}
            <div className="flex-1">
              <input
                type="text"
                aria-label="Search events"
                placeholder="Search events..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full border border-gray-200 rounded-full px-4 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <select
              aria-label="Filter by genre"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="border border-gray-200 rounded-full pl-4 pr-10 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
            >
              <option value="">All Genres</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Cause Filter */}
            <select
              aria-label="Filter by cause"
              value={causeFilter}
              onChange={(e) => setCauseFilter(e.target.value)}
              className="border border-gray-200 rounded-full pl-4 pr-10 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
            >
              <option value="">All Causes</option>
              {allCauses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Clear Filters — always rendered, visibility toggles to prevent layout shift */}
            <button
              onClick={() => {
                setGenreFilter("");
                setCauseFilter("");
                setKeyword("");
              }}
              className={`font-heading font-semibold text-sm text-sienna hover:text-azure transition-all px-2 whitespace-nowrap cursor-pointer ${
                genreFilter || causeFilter || keyword
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Event Grid */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading text-xl text-gray-400 font-semibold">
                No events found matching your filters.
              </p>
              <button
                onClick={() => {
                  setGenreFilter("");
                  setCauseFilter("");
                  setKeyword("");
                }}
                className="btn-secondary mt-4 inline-block"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <p className="font-body text-sm text-gray-500 mb-6">
                Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((event) => {
                  const nonprofit = nonprofits.find(
                    (np) => np.id === event.nonprofitId
                  );
                  const musician = event.musicianId
                    ? musicians.find((m) => m.id === event.musicianId)
                    : null;

                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block group"
                    >
                      <div className="card h-full flex flex-col gap-3 group-hover:shadow-lg transition-shadow border-t-4 border-t-azure">
                        {/* Status badge */}
                        {event.status === "completed" && (
                          <span className="inline-flex items-center self-start text-xs font-heading font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-md uppercase tracking-wide">
                            Completed
                          </span>
                        )}

                        {/* Event Name */}
                        <h2 className="font-heading font-bold text-xl text-azure group-hover:text-sienna transition-colors leading-tight">
                          {event.name}
                        </h2>

                        {/* Date & Time */}
                        <div className="flex items-start gap-2 text-sm font-body text-gray-600">
                          <svg
                            className="w-4 h-4 mt-0.5 shrink-0 text-sienna" aria-hidden="true"
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
                            {formatDate(event.dateTime)} &middot;{" "}
                            {formatTime(event.dateTime)}
                          </span>
                        </div>

                        {/* Venue */}
                        <div className="flex items-start gap-2 text-sm font-body text-gray-600">
                          <svg
                            className="w-4 h-4 mt-0.5 shrink-0 text-sienna" aria-hidden="true"
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
                            <span className="font-semibold text-gray-700">
                              Hosted by:
                            </span>{" "}
                            {nonprofit.name}
                          </div>
                        )}

                        {/* Musician */}
                        <div className="text-sm font-body">
                          {musician ? (
                            <span className="text-gray-600">
                              <span className="font-semibold text-gray-700">
                                Performing:
                              </span>{" "}
                              {musician.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">
                              Musician TBD
                            </span>
                          )}
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Badges + RSVP */}
                        <div className="flex justify-between items-center pt-2 pb-1 border-t border-sand-dark">
                          <span className="text-sm font-heading font-semibold text-azure uppercase tracking-wide">
                            {event.genrePref} <span className="text-gold font-bold mx-0.5">|</span> {event.cause}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
