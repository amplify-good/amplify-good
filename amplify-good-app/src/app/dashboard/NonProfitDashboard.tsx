'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate, formatTime, formatMoney } from '@/lib/format'
import type { DbMusician, DbNonprofit, DbEvent } from '@/lib/db/types'
import { AssignMusicianButton } from './AssignMusicianButton'

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    upcoming: 'bg-green-100 text-green-800 border border-green-300',
    completed: 'bg-blue-100 text-blue-800 border border-blue-300',
    draft: 'bg-gray-100 text-gray-600 border border-gray-300',
    confirmed: 'bg-green-100 text-green-800 border border-green-300',
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    cancelled: 'bg-red-100 text-red-700 border border-red-300',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-heading font-semibold uppercase tracking-wide ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  )
}

// ─── Genre Pill ───────────────────────────────────────────────────────────────

function GenrePill({ genre }: { genre: string }) {
  return <span className="genre-pill">{genre}</span>
}

// ─── Non-Profit Dashboard ─────────────────────────────────────────────────────

export function NonProfitDashboard({
  nonprofit,
  events,
  musicians,
}: {
  nonprofit: DbNonprofit
  events: DbEvent[]
  musicians: DbMusician[]
}) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const eventsNeedingMusician = events.filter(
    (e) => e.status === 'upcoming' && !e.musician_id
  )

  function sortByDate<T extends { date_time: string }>(arr: T[]) {
    return [...arr].sort((a, b) => {
      const diff = new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
      return sortOrder === 'newest' ? -diff : diff
    })
  }

  const activeEvents = sortByDate(events.filter((e) => e.status !== 'completed'))
  const pastEvents = sortByDate(events.filter((e) => e.status === 'completed'))

  function getSuggestedMusicians(genrePref: string | null) {
    if (!genrePref) return musicians.slice(0, 3)
    const matched = musicians.filter((m) =>
      m.genres.some((g) => g.toLowerCase() === genrePref.toLowerCase())
    )
    const others = musicians.filter(
      (m) => !m.genres.some((g) => g.toLowerCase() === genrePref.toLowerCase())
    )
    return [...matched, ...others].slice(0, 3)
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
            {nonprofit.name}
          </h2>
        </div>
        <Link href="/events/new" className="btn-primary self-start">
          + Create New Event
        </Link>
      </div>

      {/* Your Events */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-2 border-b-2 border-sand-dark">
          <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide">
            Your Events
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-body text-gray-500">Sort:</span>
            <button
              onClick={() => setSortOrder('newest')}
              className={`text-xs px-3 py-1 rounded font-heading font-semibold transition-colors ${sortOrder === 'newest' ? 'bg-azure text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`text-xs px-3 py-1 rounded font-heading font-semibold transition-colors ${sortOrder === 'oldest' ? 'bg-azure text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Oldest
            </button>
          </div>
        </div>
        {activeEvents.length === 0 ? (
          <p className="text-gray-500 font-body">No active events.</p>
        ) : (
          <div className="space-y-4">
            {activeEvents.map((ev) => {
              const assignedMusician = ev.musician_id
                ? musicians.find((m) => m.id === ev.musician_id)
                : null
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
                      <span className="font-semibold text-gray-700">Date:</span>{' '}
                      {formatDate(ev.date_time)} at {formatTime(ev.date_time)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Venue:</span>{' '}
                      {ev.venue}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Musician:</span>{' '}
                      {assignedMusician ? (
                        <span className="text-turquoise font-semibold">
                          {assignedMusician.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not yet confirmed</span>
                      )}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">RSVPs:</span>{' '}
                      {ev.rsvp_count}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
            Past Events
          </h3>
          <div className="space-y-4">
            {pastEvents.map((ev) => {
              const assignedMusician = ev.musician_id
                ? musicians.find((m) => m.id === ev.musician_id)
                : null
              return (
                <div key={ev.id} className="card space-y-2 opacity-75">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h4 className="font-heading font-bold text-lg text-gray-700">
                      {ev.name}
                    </h4>
                    <StatusBadge status={ev.status} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm font-body text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-700">Date:</span>{' '}
                      {formatDate(ev.date_time)} at {formatTime(ev.date_time)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Venue:</span>{' '}
                      {ev.venue}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Musician:</span>{' '}
                      {assignedMusician ? (
                        <span className="text-turquoise font-semibold">
                          {assignedMusician.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not yet confirmed</span>
                      )}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">RSVPs:</span>{' '}
                      {ev.rsvp_count}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Musician Suggestions */}
      {eventsNeedingMusician.length > 0 && (
        <section>
          <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
            Musician Suggestions
          </h3>
          <div className="space-y-8">
            {eventsNeedingMusician.map((ev) => {
              const suggestions = getSuggestedMusicians(ev.genre_pref)
              return (
                <div key={ev.id}>
                  <p className="font-heading font-semibold text-gray-700 mb-3">
                    For <span className="text-sienna">{ev.name}</span> &mdash; looking for{' '}
                    {ev.genre_pref && <span className="genre-pill">{ev.genre_pref}</span>}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {suggestions.map((m) => (
                      <div
                        key={m.id}
                        className="card space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <p className="font-heading font-bold text-gray-800">{m.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {m.genres.map((g) => (
                              <GenrePill key={g} genre={g} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 font-body mt-2">
                            {formatMoney(m.rate)}{' '}
                            {m.rate_type === 'hourly' ? '/ hr' : '/ event'}
                          </p>
                        </div>
                        <AssignMusicianButton eventId={ev.id} musicianId={m.id} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
