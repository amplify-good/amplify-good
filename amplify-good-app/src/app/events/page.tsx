"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { events, Event } from "@/data/events";
import { nonprofits } from "@/data/nonprofits";
import { musicians, allGenres } from "@/data/musicians";
import { allCauses } from "@/data/nonprofits";


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
                {filtered.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    nonprofit={nonprofits.find((np) => np.id === event.nonprofitId)}
                    musician={event.musicianId ? musicians.find((m) => m.id === event.musicianId) : null}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
