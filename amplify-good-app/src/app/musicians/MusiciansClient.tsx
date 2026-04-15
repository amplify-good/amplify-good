"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import GenreTags from "@/components/GenreTags";
import type { DbMusician } from "@/lib/db/types";

const GENRE_LIST = [
  "Rock", "Jazz", "Country", "Hip-Hop", "R&B", "Mariachi",
  "Classical", "Electronic", "Folk", "Latin", "Blues",
];

export default function MusiciansClient({ musicians }: { musicians: DbMusician[] }) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [nameSearch, setNameSearch] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const filtered = useMemo(() => {
    return musicians.filter((m: DbMusician) => {
      const matchesName =
        nameSearch.trim() === "" ||
        m.name.toLowerCase().includes(nameSearch.toLowerCase());

      const matchesGenres =
        selectedGenres.length === 0 ||
        selectedGenres.some((g) => m.genres.includes(g));

      const min = minRate !== "" ? Number(minRate) : null;
      const max = maxRate !== "" ? Number(maxRate) : null;
      const matchesMin = min === null || isNaN(min) || m.rate >= min;
      const matchesMax = max === null || isNaN(max) || m.rate <= max;

      return matchesName && matchesGenres && matchesMin && matchesMax;
    });
  }, [musicians, nameSearch, selectedGenres, minRate, maxRate]);

  return (
    <>
      {/* Page Header */}
      <section className="bg-parchment py-12 px-4 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-5xl md:text-6xl uppercase text-azure">
              Find Your Musician
            </h1>
            <img src="/images/icons/guitar_icon.png" alt="" className="h-10 w-auto" aria-hidden="true" />
          </div>
          <p className="font-heading text-lg mt-3 text-sienna max-w-xl">
            Book Austin&apos;s finest talent for your next event or non-profit gathering.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-sand-light border-b border-sand-dark sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">

          {/* Name search */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="text"
              aria-label="Search musicians by name"
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-azure w-full sm:w-64"
            />

            {/* Rate range */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading text-sm font-semibold text-gray-600 whitespace-nowrap">Rate ($):</span>
              <input
                type="number"
                aria-label="Minimum rate"
                placeholder="Min"
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                className="border border-gray-300 rounded-full px-3 py-2 text-sm font-body w-20 sm:w-24 focus:outline-none focus:ring-2 focus:ring-azure"
                min={0}
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                aria-label="Maximum rate"
                placeholder="Max"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                className="border border-gray-300 rounded-full px-3 py-2 text-sm font-body w-20 sm:w-24 focus:outline-none focus:ring-2 focus:ring-azure"
                min={0}
              />
            </div>

            {/* Clear filters — always rendered to prevent layout shift */}
            <button
              onClick={() => {
                setSelectedGenres([]);
                setNameSearch("");
                setMinRate("");
                setMaxRate("");
              }}
              className={`text-sm font-heading font-semibold text-sienna hover:text-azure transition-all whitespace-nowrap cursor-pointer ${
                selectedGenres.length > 0 || nameSearch || minRate || maxRate
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              Clear filters
            </button>
          </div>

          {/* Genre filters */}
          <div className="flex flex-wrap items-center gap-1">
            {GENRE_LIST.map((genre, i) => {
              const active = selectedGenres.includes(genre);
              return (
                <span key={genre} className="flex items-center gap-1">
                  <button
                    onClick={() => toggleGenre(genre)}
                    aria-pressed={active}
                    className={`font-heading font-semibold text-sm cursor-pointer transition-all py-1 ${
                      active
                        ? "text-orange underline underline-offset-4"
                        : "text-azure hover:text-sienna"
                    }`}
                  >
                    {genre}
                  </button>
                  {i < GENRE_LIST.length - 1 && (
                    <span className="text-gold font-bold text-xs mx-0.5">|</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-xl text-gray-500">No musicians match your filters.</p>
            <p className="font-body text-sm text-gray-400 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <p className="font-heading text-sm font-semibold text-gray-500 mb-6">
              Showing {filtered.length} musician{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((musician) => (
                <MusicianCard key={musician.id} musician={musician} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

function MusicianCard({ musician }: { musician: DbMusician }) {
  return (
    <div className="card flex flex-col items-center text-center px-6 pb-6 pt-6">
      {/* Profile photo — fixed size */}
      <div className="w-24 h-24 shrink-0 mb-3">
        <img
          src={musician.photo_url ?? "/images/icons/musician_profile_window_icon.png"}
          alt={musician.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Name — fixed min-height so cards align */}
      <h2 className="font-heading text-xl font-bold text-azure leading-tight min-h-[3.5rem] flex items-center">
        {musician.name}
      </h2>

      {/* Genres */}
      <GenreTags genres={musician.genres} className="justify-center min-h-[2rem] mt-1" />

      {/* Rate */}
      <div className="flex items-baseline gap-1 mt-3">
        <span className="impact-number text-2xl">
          ${musician.rate}
        </span>
        <span className="font-body text-xs text-gray-500">
          /{musician.rate_type === "per_event" ? "event" : "hr"}
        </span>
      </div>

      {/* Availability badge */}
      {!musician.available && (
        <span className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wide mt-1">
          Currently Unavailable
        </span>
      )}

      {/* CTA */}
      <Link
        href={`/musicians/${musician.id}`}
        className="btn-primary inline-block mt-auto pt-4"
      >
        View Profile
      </Link>
    </div>
  );
}
