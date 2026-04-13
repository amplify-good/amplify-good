"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GenreTags from "@/components/GenreTags";
import { musicians } from "@/data/musicians";

const IMPACT_COMMISSION = 0.15;

const DURATION_OPTIONS = [
  { label: "1 hour", hours: 1 },
  { label: "2 hours", hours: 2 },
  { label: "3 hours", hours: 3 },
  { label: "4 hours", hours: 4 },
];

export default function BookingPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const musician = musicians.find((m) => m.id === id);

  const [form, setForm] = useState({
    eventName: "",
    dateTime: "",
    venue: "",
    duration: "1",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!musician) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-24">
            <h1 className="font-display text-4xl text-azure uppercase">Musician Not Found</h1>
            <p className="font-body text-gray-500 mt-3">
              We couldn&apos;t find a musician with that ID.
            </p>
            <Link href="/musicians" className="btn-primary inline-block mt-6">
              Browse Musicians
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const durationHours = Number(form.duration);
  const baseRate =
    musician.rateType === "hourly" ? musician.rate * durationHours : musician.rate;
  const commission = Math.round(baseRate * IMPACT_COMMISSION * 100) / 100;
  const total = baseRate + commission;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="bg-parchment py-10 px-4 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto">
          <p className="font-heading text-sm text-sienna uppercase tracking-widest mb-1">
            Step 1 of 1
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase text-azure">
            Book a Musician
          </h1>
          <p className="font-body text-gray-600 mt-2 max-w-lg">
            Fill out your event details and we&apos;ll send a booking request to the musician.
            15% of every booking goes directly to non-profit impact.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        {submitted ? (
          /* ── Success Panel ── */
          <div className="max-w-xl mx-auto card text-center py-12 px-8">
            <img src="/images/icons/impact_star_icon.png" alt="Success" className="h-16 w-auto object-contain mx-auto mb-4" />
            <h2 className="font-display text-3xl uppercase text-azure mb-2">
              Booking Request Sent!
            </h2>
            <p className="font-body text-gray-600 text-lg">
              <span className="font-semibold text-sienna">{musician.name}</span> will review
              your request and get back to you shortly.
            </p>
            <p className="font-body text-sm text-gray-400 mt-3">
              A confirmation will be sent to your email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link href="/musicians" className="btn-primary inline-block">
                Browse More Musicians
              </Link>
              <Link href="/events" className="btn-secondary inline-block">
                View Upcoming Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left: Musician Card ── */}
            <div className="lg:col-span-1">
              <div className="card flex flex-col items-center text-center gap-4 sticky top-24">
                {/* Photo */}
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={musician.photoUrl}
                    alt={musician.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Name */}
                <h2 className="font-heading text-2xl font-bold text-azure leading-tight">
                  {musician.name}
                </h2>

                {/* Genre pills */}
                <GenreTags genres={musician.genres} className="justify-center" />

                {/* Rate */}
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="impact-number text-3xl">${musician.rate}</span>
                  <span className="font-body text-sm text-gray-500">
                    /{musician.rateType === "per_event" ? "event" : "hr"}
                  </span>
                </div>

                {/* Availability */}
                <div
                  className={`font-heading text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md ${
                    musician.available
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {musician.available ? "Available" : "Currently Unavailable"}
                </div>

                {/* Bio snippet */}
                <p className="font-body text-sm text-gray-500 line-clamp-3 mt-1">
                  {musician.bio}
                </p>

                <Link
                  href={`/musicians/${musician.id}`}
                  className="font-heading text-sm font-semibold text-azure hover:underline"
                >
                  View Full Profile
                </Link>
              </div>
            </div>

            {/* ── Right: Form + Checkout ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Booking Form */}
              <div className="card">
                <h3 className="font-heading text-xl font-bold text-azure mb-6 uppercase tracking-wide">
                  Event Details
                </h3>
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
                      placeholder="e.g., Annual Gala Night"
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
                      placeholder="e.g., The Driskill Hotel, Austin TX"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                      Duration <span className="text-sienna">*</span>
                    </label>
                    <select
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure bg-white"
                    >
                      {DURATION_OPTIONS.map((opt) => (
                        <option key={opt.hours} value={String(opt.hours)}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                      Message to Musician{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell the musician about your event, audience, vibe, any special requests..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure resize-none"
                    />
                  </div>

                  {/* Checkout Summary */}
                  <div className="bg-sand-light rounded-2xl p-5 border border-sand-dark">
                    <h4 className="font-heading font-bold text-azure uppercase tracking-wide text-sm mb-4">
                      Booking Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-gray-600">
                          {musician.name}&apos;s Rate
                          {musician.rateType === "hourly" && (
                            <span className="text-gray-400">
                              {" "}
                              (${musician.rate}/hr × {durationHours}h)
                            </span>
                          )}
                        </span>
                        <span className="impact-number text-xl">${baseRate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-gray-600">
                          15% Impact Commission{" "}
                          <span className="text-turquoise font-semibold">(Donation)</span>
                        </span>
                        <span className="font-heading font-bold text-turquoise text-lg">
                          +${commission.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-sand-dark pt-3 flex justify-between items-center">
                        <span className="font-heading font-bold text-gray-800 text-base uppercase tracking-wide">
                          Total
                        </span>
                        <span className="impact-number text-3xl">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="font-body text-xs text-gray-400 mt-3">
                      This is a demo mockup — no real payment is processed. The 15% commission
                      funds non-profit programs across Austin.
                    </p>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="btn-primary w-full text-center">
                    Confirm Booking
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
