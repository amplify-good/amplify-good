'use client'

import { useState } from 'react'
import Link from 'next/link'
import GenreTags from '@/components/GenreTags'
import { formatDate, formatTime } from '@/lib/format'
import type { DbEvent, DbMusician, DbNonprofit } from '@/lib/db/types'

export default function SponsorForm({
  event,
  musician,
  nonprofit,
}: {
  event: DbEvent
  musician: DbMusician | null
  nonprofit: DbNonprofit | null
}) {
  const [sponsored, setSponsored] = useState(false)

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
      {sponsored ? (
        /* ── Success Panel ── */
        <div className="card text-center py-12 px-8 max-w-xl mx-auto">
          <img
            src="/images/icons/impact_star_icon.png"
            alt="Success"
            className="h-16 w-auto object-contain mx-auto mb-4"
          />
          <h2 className="font-display text-3xl uppercase text-azure mb-2">
            You&apos;re an Impact Sponsor!
          </h2>
          <p className="font-body text-gray-600 text-lg mt-2">
            Thank you for sponsoring{' '}
            {musician ? (
              <><span className="font-semibold text-sienna">{musician.name}</span>&apos;s performance at{' '}</>
            ) : (
              <>a live performance at{' '}</>
            )}
            <span className="font-semibold text-azure">{event.name}</span>.
          </p>
          <p className="font-body text-sm text-gray-400 mt-3">
            Your name will appear on the event page as an official Impact Sponsor.
          </p>
          {musician && (
            <div className="mt-6 bg-sand-light rounded-2xl px-6 py-4 inline-block">
              <p className="font-heading font-bold text-azure text-sm uppercase tracking-wide">
                Your Sponsorship
              </p>
              <p className="impact-number text-4xl mt-1">
                ${musician.rate.toFixed(2)}{musician.rate_type === 'hourly' ? '/hr' : ''}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/events" className="btn-primary inline-block">
              Browse More Events
            </Link>
            <Link href="/musicians" className="btn-secondary inline-block">
              Find Musicians
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* ── Event Info Card ── */}
          <div className="card">
            <div className="flex items-start gap-4 flex-col sm:flex-row">
              {/* Event badge */}
              <div className="shrink-0 bg-sienna text-white rounded-xl px-4 py-2 text-center min-w-[80px]">
                <p className="font-display text-xs uppercase tracking-widest opacity-75">
                  Event
                </p>
                <p className="font-display text-lg uppercase leading-tight">
                  {new Date(event.date_time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex-1">
                <h2 className="font-heading text-2xl font-bold text-azure leading-tight">
                  {event.name}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  <p className="font-body text-sm text-gray-600">
                    <span className="font-semibold">Date:</span>{' '}
                    {formatDate(event.date_time)} at {formatTime(event.date_time)}
                  </p>
                  <p className="font-body text-sm text-gray-600">
                    <span className="font-semibold">Venue:</span> {event.venue}
                  </p>
                </div>
                {nonprofit && (
                  <p className="font-body text-sm text-turquoise font-semibold mt-2">
                    Hosted by: {nonprofit.name}
                  </p>
                )}
                <div className="mt-3">
                  <span className="genre-pill">{event.cause}</span>
                </div>
              </div>
            </div>

            <p className="font-body text-sm text-gray-500 mt-4 border-t border-gray-100 pt-4">
              {event.description}
            </p>
          </div>

          {/* ── Musician / No Musician ── */}
          {!musician ? (
            <div className="card text-center py-10">
              <img
                src="/images/icons/music_notes_icon.png"
                alt="No musician"
                className="h-14 w-auto object-contain mx-auto mb-4"
              />
              <h3 className="font-heading text-xl font-bold text-gray-500">
                No musician assigned yet
              </h3>
              <p className="font-body text-sm text-gray-400 mt-2">
                Check back soon — a musician will be matched to this event shortly.
              </p>
              <Link href="/musicians" className="btn-secondary inline-block mt-6">
                Browse Musicians
              </Link>
            </div>
          ) : (
            <>
              {/* ── Musician Info ── */}
              <div className="card">
                <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Performing Artist
                </h3>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 shrink-0">
                    <img
                      src={musician.photo_url ?? '/images/icons/musician_profile_window_icon.png'}
                      alt={musician.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-xl font-bold text-azure">
                      {musician.name}
                    </h4>
                    <GenreTags genres={musician.genres} className="mt-1" />
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="impact-number text-2xl">${musician.rate}</span>
                      <span className="font-body text-xs text-gray-500">
                        /{musician.rate_type === 'per_event' ? 'event' : 'hr'}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/musicians/${musician.id}`}
                    className="font-heading text-sm font-semibold text-azure hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              {/* ── Sponsor Summary ── */}
              <div className="card text-white" style={{ background: 'var(--azure)' }}>
                <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-white/60 mb-4">
                  Sponsorship Summary
                </h3>
                <p className="font-body text-white text-base">
                  You&apos;re sponsoring{' '}
                  <span className="font-semibold text-orange">{musician.name}</span>&apos;s
                  performance at{' '}
                  <span className="font-semibold text-orange">{event.name}</span>
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-white/70">
                      {musician.rate_type === 'hourly'
                        ? `Artist Rate ($${musician.rate}/hr)`
                        : 'Performance Fee'}
                    </span>
                    <span className="impact-number text-2xl text-orange">
                      ${musician.rate_type === 'hourly'
                        ? `${musician.rate.toFixed(2)}/hr`
                        : musician.rate.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/20 pt-3">
                    <span className="font-heading font-bold text-white text-sm uppercase tracking-wide">
                      Your Contribution
                    </span>
                    <span className="impact-number text-3xl text-orange">
                      ${musician.rate.toFixed(2)}
                      {musician.rate_type === 'hourly' && (
                        <span className="text-sm text-white/60 font-body">/hr</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-white/10 rounded-xl px-4 py-3">
                  <p className="font-body text-xs text-white/60">
                    100% of your sponsorship covers the artist&apos;s performance fee.
                    Amplify the Good&apos;s platform is supported by a separate community
                    fund.
                  </p>
                </div>
              </div>

              {/* ── Sponsor Perks ── */}
              <div className="card border-2 border-gold">
                <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
                  What You Get as an Impact Sponsor
                </h3>
                <ul className="space-y-2">
                  {[
                    'Your name featured on the event page',
                    'Shoutout from the stage during the performance',
                    "Listed in the non-profit's post-event recap",
                    'Amplify the Good Impact Sponsor badge on your profile',
                  ].map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-2 font-body text-sm text-gray-700"
                    >
                      <span className="text-gold text-base">★</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── CTA ── */}
              <button
                onClick={() => setSponsored(true)}
                className="btn-primary w-full text-center text-lg"
              >
                Sponsor This Set — ${musician.rate.toFixed(2)}{musician.rate_type === 'hourly' ? '/hr' : ''}
              </button>

              <p className="font-body text-xs text-center text-gray-400">
                This is a demo mockup — no real payment is processed.
              </p>
            </>
          )}
        </div>
      )}
    </main>
  )
}
