"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GenreTags from "@/components/GenreTags";
import { musicians, allGenres } from "@/data/musicians";
import type { Musician } from "@/data/musicians";

const CAUSES = ["Youth", "Environment", "Healthcare", "Animal Rescue", "Arts & Culture"];

export default function CreateEventPage() {
  const [form, setForm] = useState({
    eventName: "",
    dateTime: "",
    venue: "",
    vibe: "",
    attendance: "",
    genre: "",
    description: "",
    cause: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [suggestedMusicians, setSuggestedMusicians] = useState<Musician[]>([]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Find musicians whose genres overlap with the selected genre, up to 3
    const matched = musicians
      .filter((m) => m.genres.includes(form.genre))
      .slice(0, 3);

    // If fewer than 3 matched, pad with others not already included
    if (matched.length < 3) {
      const additional = musicians
        .filter((m) => !matched.includes(m))
        .slice(0, 3 - matched.length);
      matched.push(...additional);
    }

    setSuggestedMusicians(matched);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="bg-parchment py-10 px-4 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl uppercase text-azure tracking-wide">
            Create an Event
          </h1>
          <p className="font-body text-gray-600 mt-2 max-w-lg">
            Tell us about your non-profit event and we&apos;ll match you with the perfect
            Austin musicians.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {submitted ? (
          /* ── Success Panel + Suggested Musicians ── */
          <div className="flex flex-col gap-8">
            {/* Success banner */}
            <div className="card text-center py-10 px-8">
              <img src="/images/icons/music_notes_icon.png" alt="Success" className="h-16 w-auto object-contain mx-auto mb-4" />
              <h2 className="font-display text-3xl uppercase text-azure mb-2">
                Event Created!
              </h2>
              <p className="font-body text-gray-600 text-lg">
                <span className="font-semibold text-sienna">{form.eventName}</span> is now
                live on Amplify the Good.
              </p>
              <p className="font-body text-sm text-gray-400 mt-2">
                We&apos;ll suggest musicians for your event based on your genre and vibe preferences.
              </p>

              {/* Event recap chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {form.genre && <span className="genre-pill">{form.genre}</span>}
                {form.cause && (
                  <span className="genre-pill !bg-sienna/10 !text-sienna">{form.cause}</span>
                )}
                {form.attendance && (
                  <span className="genre-pill !bg-turquoise/10 !text-turquoise">
                    {form.attendance} expected guests
                  </span>
                )}
              </div>
            </div>

            {/* Suggested Musicians */}
            <div>
              <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4">
                Suggested Musicians
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {suggestedMusicians.map((musician) => (
                  <SuggestedMusicianCard key={musician.id} musician={musician} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/events" className="btn-primary inline-block text-center">
                View All Events
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSuggestedMusicians([]);
                  setForm({
                    eventName: "",
                    dateTime: "",
                    venue: "",
                    vibe: "",
                    attendance: "",
                    genre: "",
                    description: "",
                    cause: "",
                  });
                }}
                className="btn-secondary inline-block text-center"
              >
                Create Another Event
              </button>
            </div>
          </div>
        ) : (
          /* ── Event Creation Form ── */
          <div className="card">
            <h2 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-6">
              Event Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Event Name */}
              <div>
                <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                  Event Name <span className="text-sienna">*</span>
                </label>
                <input
                  type="text"
                  name="eventName"
                  required
                  value={form.eventName}
                  onChange={handleChange}
                  placeholder="e.g., Annual Community Gala"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                  Date &amp; Time <span className="text-sienna">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  required
                  value={form.dateTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                  Venue / Location <span className="text-sienna">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="e.g., Republic Square Park, Austin TX"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
                />
              </div>

              {/* Vibe / Theme */}
              <div>
                <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                  Vibe / Theme <span className="text-sienna">*</span>
                </label>
                <input
                  type="text"
                  name="vibe"
                  required
                  value={form.vibe}
                  onChange={handleChange}
                  placeholder="e.g., casual outdoor BBQ, formal gala"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
                />
              </div>

              {/* Two-column: Attendance + Genre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Expected Attendance */}
                <div>
                  <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                    Expected Attendance <span className="text-sienna">*</span>
                  </label>
                  <input
                    type="number"
                    name="attendance"
                    required
                    min={1}
                    value={form.attendance}
                    onChange={handleChange}
                    placeholder="e.g., 200"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                    Genre of Music <span className="text-sienna">*</span>
                  </label>
                  <select
                    name="genre"
                    required
                    value={form.genre}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure bg-white"
                  >
                    <option value="" disabled>
                      Select a genre
                    </option>
                    {allGenres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cause */}
              <div>
                <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                  Cause / Category <span className="text-sienna">*</span>
                </label>
                <select
                  name="cause"
                  required
                  value={form.cause}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure bg-white"
                >
                  <option value="" disabled>
                    Select a cause
                  </option>
                  {CAUSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                  Description{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell musicians and potential sponsors more about your event, its mission, and what makes it special..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure resize-none"
                />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-2" />

              {/* Submit */}
              <button type="submit" className="btn-primary w-full text-center text-lg">
                Create Event
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SuggestedMusicianCard({ musician }: { musician: Musician }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="card flex flex-col items-center text-center gap-3 px-5 pb-5 pt-5">
      {/* Photo */}
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={musician.photoUrl}
          alt={musician.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Name — fixed height for alignment */}
      <h4 className="font-heading text-base font-bold text-azure leading-tight min-h-[2.5rem] flex items-center">
        {musician.name}
      </h4>

      {/* Genres */}
      <GenreTags genres={musician.genres} className="justify-center min-h-[2rem]" />

      {/* Rate */}
      <div className="flex items-baseline gap-1">
        <span className="impact-number text-xl">${musician.rate}</span>
        <span className="font-body text-xs text-gray-500">
          /{musician.rateType === "per_event" ? "event" : "hr"}
        </span>
      </div>

      {/* Spacer to push button to bottom */}
      <div className="flex-1" />

      {/* Confirm button */}
      {confirmed ? (
        <div className="font-heading text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-md uppercase tracking-wide">
          Confirmed!
        </div>
      ) : (
        <button
          onClick={() => setConfirmed(true)}
          className="btn-primary !py-2 !px-5 text-sm w-full"
        >
          Confirm
        </button>
      )}
    </div>
  );
}
