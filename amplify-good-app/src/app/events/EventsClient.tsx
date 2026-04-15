"use client";

import { useState, useMemo } from "react";
import EventCard from "@/components/EventCard";
import type { DbEvent, DbMusician, DbNonprofit } from "@/lib/db/types";

const GENRE_LIST = [
  "Rock", "Jazz", "Country", "Hip-Hop", "R&B", "Mariachi",
  "Classical", "Electronic", "Folk", "Latin", "Blues",
];

const CAUSE_LIST = [
  "Youth", "Environment", "Healthcare", "Animal Rescue", "Arts & Culture",
];

interface EventsClientProps {
  events: DbEvent[];
  musicians: DbMusician[];
  nonprofits: DbNonprofit[];
  rsvpedEventIds?: string[];
}

export default function EventsClient({ events, musicians, nonprofits, rsvpedEventIds = [] }: EventsClientProps) {
  const rsvpedSet = useMemo(() => new Set(rsvpedEventIds), [rsvpedEventIds]);
  const [genreFilter, setGenreFilter] = useState("");
  const [causeFilter, setCauseFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [myEventsOpen, setMyEventsOpen] = useState(true);
  const [upcomingOpen, setUpcomingOpen] = useState(true);
  const [pastOpen, setPastOpen] = useState(true);

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  const myEvents = useMemo(
    () => events.filter((e) => rsvpedSet.has(e.id) && !isPast(e.date_time)),
    [events, rsvpedSet]
  );

  const { upcoming, past } = useMemo(() => {
    const filtered = events.filter((event: DbEvent) => {
      const matchesGenre =
        !genreFilter || event.genre_pref === genreFilter;
      const matchesCause =
        !causeFilter || event.cause === causeFilter;
      const kw = keyword.toLowerCase();
      const matchesKeyword =
        !kw ||
        event.name.toLowerCase().includes(kw) ||
        (event.description ?? "").toLowerCase().includes(kw);
      return matchesGenre && matchesCause && matchesKeyword;
    });

    return {
      upcoming: filtered.filter((e) => !isPast(e.date_time) && !rsvpedSet.has(e.id)),
      past: filtered.filter((e) => isPast(e.date_time)),
    };
  }, [events, genreFilter, causeFilter, keyword, rsvpedSet]);

  return (
    <main className="flex-1">
      {/* Page Header */}
      <div className="bg-parchment py-12 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 flex items-stretch gap-5">
          <img src="/images/icons/austin_skyline_icon.png" alt="" className="h-20 w-auto hidden sm:block shrink-0 self-center object-contain" aria-hidden="true" />
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
              className="w-full border-2 border-azure rounded-full px-4 py-2 font-body text-sm focus:outline-none"
            />
          </div>

          {/* Genre Filter */}
          <select
            aria-label="Filter by genre"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="border-2 border-azure rounded-full pl-4 pr-10 py-2 font-body text-sm focus:outline-none bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
          >
            <option value="">All Genres</option>
            {GENRE_LIST.map((g) => (
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
            className="border-2 border-azure rounded-full pl-4 pr-10 py-2 font-body text-sm focus:outline-none bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
          >
            <option value="">All Causes</option>
            {CAUSE_LIST.map((c) => (
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
        {/* My Events — collapsible, only shown when user has RSVPs */}
        {myEvents.length > 0 && (
          <section className="mb-10">
            <button
              onClick={() => setMyEventsOpen((o) => !o)}
              className="flex items-center gap-3 w-full mb-4 cursor-pointer group/my"
            >
              <h2 className="font-display text-2xl uppercase text-sienna">
                My Events
              </h2>
              <span className="font-body text-sm text-gray-400">
                ({myEvents.length})
              </span>
              <div className="h-px flex-1 bg-sienna/40" />
              <svg
                className={`w-5 h-5 text-sienna transition-transform ${myEventsOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {myEventsOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    nonprofit={nonprofits.find((np) => np.id === event.nonprofit_id)}
                    musician={event.musician_id ? musicians.find((m) => m.id === event.musician_id) ?? null : null}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {upcoming.length === 0 && past.length === 0 ? (
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
            {/* Upcoming Events */}
            {upcoming.length > 0 && (
              <section>
                <button
                  onClick={() => setUpcomingOpen((o) => !o)}
                  className="flex items-center gap-3 w-full mb-6 cursor-pointer"
                >
                  <h2 className="font-display text-2xl uppercase text-azure">
                    Upcoming Events
                  </h2>
                  <span className="font-body text-sm font-semibold text-sienna">
                    ({upcoming.length})
                  </span>
                  <div className="h-px flex-1 bg-sienna/40" />
                  <svg
                    className={`w-5 h-5 text-azure transition-transform ${upcomingOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {upcomingOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        nonprofit={nonprofits.find((np) => np.id === event.nonprofit_id)}
                        musician={event.musician_id ? musicians.find((m) => m.id === event.musician_id) ?? null : null}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Past Events */}
            {past.length > 0 && (
              <section className={upcoming.length > 0 ? "mt-14" : ""}>
                <button
                  onClick={() => setPastOpen((o) => !o)}
                  className="flex items-center gap-3 w-full mb-6 cursor-pointer"
                >
                  <h2 className="font-display text-2xl uppercase text-azure">
                    Past Events
                  </h2>
                  <span className="font-body text-sm text-gray-400">
                    ({past.length})
                  </span>
                  <div className="h-px flex-1 bg-sienna/40" />
                  <svg
                    className={`w-5 h-5 text-azure transition-transform ${pastOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {pastOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
                    {past.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        nonprofit={nonprofits.find((np) => np.id === event.nonprofit_id)}
                        musician={event.musician_id ? musicians.find((m) => m.id === event.musician_id) ?? null : null}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
