'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate, formatTime, formatMoney } from '@/lib/format'
import type { DbMusician, DbEvent, DbBooking } from '@/lib/db/types'
import { BookingActions } from './BookingActions'
import { EditMusicianProfile } from './EditMusicianProfile'

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

// ─── Musician Dashboard ───────────────────────────────────────────────────────

export function MusicianDashboard({
  musician,
  bookings,
  assignedEvents,
}: {
  musician: DbMusician
  bookings: DbBooking[]
  assignedEvents: DbEvent[]
}) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [editing, setEditing] = useState(false)
  const router = useRouter()

  const pendingBookings = bookings.filter((b) => b.status === 'pending')
  const confirmedPrivate = bookings.filter((b) => b.status === 'confirmed')
  const upcomingImpactEvents = assignedEvents.filter((e) => e.status === 'upcoming')
  const completedPrivate = bookings.filter((b) => b.status === 'completed')
  const completedEvents = assignedEvents.filter((e) => e.status === 'completed')
  const totalEarnings = completedPrivate.reduce((sum, b) => sum + b.musician_rate, 0)

  type GigDisplay = {
    id: string
    name: string
    date: string
    location: string
    type: 'private' | 'impact'
    payout?: number
    rsvpCount?: number
  }

  function sortGigs(gigs: GigDisplay[]) {
    return [...gigs].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
      return sortOrder === 'newest' ? -diff : diff
    })
  }

  const upcomingGigs = sortGigs([
    ...confirmedPrivate.map((b) => ({
      id: b.id,
      name: b.event_name,
      date: b.event_date,
      location: b.location ?? '',
      type: 'private' as const,
      payout: b.musician_rate,
    })),
    ...upcomingImpactEvents.map((e) => ({
      id: e.id,
      name: e.name,
      date: e.date_time,
      location: e.venue,
      type: 'impact' as const,
      rsvpCount: e.rsvp_count,
    })),
  ])

  const pastGigs = sortGigs([
    ...completedPrivate.map((b) => ({
      id: b.id,
      name: b.event_name,
      date: b.event_date,
      location: b.location ?? '',
      type: 'private' as const,
      payout: b.musician_rate,
    })),
    ...completedEvents.map((e) => ({
      id: e.id,
      name: e.name,
      date: e.date_time,
      location: e.venue,
      type: 'impact' as const,
      rsvpCount: e.rsvp_count,
    })),
  ])

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
          <button
            onClick={() => setEditing(true)}
            className="mt-2 text-sm font-heading font-semibold text-azure hover:text-sienna transition-colors underline underline-offset-2"
          >
            Edit Profile
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-body text-gray-600">Booking Requests</span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange text-white text-sm font-bold">
            {pendingBookings.length}
          </span>
        </div>
      </div>

      {editing && (
        <EditMusicianProfile
          musician={musician}
          userId={musician.user_id!}
          onClose={() => setEditing(false)}
          onSaved={() => { setEditing(false); router.refresh() }}
        />
      )}

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
                    {booking.event_name}
                  </h4>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="text-sm font-body text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-700">Date:</span>{' '}
                    {formatDate(booking.event_date)} at {formatTime(booking.event_date)}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Location:</span>{' '}
                    {booking.location}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Duration:</span>{' '}
                    {booking.duration}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Payout:</span>{' '}
                    <span className="text-gold font-bold">
                      {formatMoney(booking.musician_rate)}
                    </span>
                  </p>
                </div>
                {booking.message && (
                  <blockquote className="border-l-4 border-sand-dark pl-3 text-sm italic text-gray-500 font-body">
                    &ldquo;{booking.message}&rdquo;
                  </blockquote>
                )}
                <BookingActions bookingId={booking.id} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Gigs */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-2 border-b-2 border-sand-dark">
          <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide">
            Upcoming Gigs
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
        <div className="space-y-3">
          {upcomingGigs.length === 0 ? (
            <p className="text-gray-500 font-body">No upcoming gigs yet.</p>
          ) : (
            upcomingGigs.map((gig) => (
              <div
                key={gig.id}
                className="card flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <p className="font-heading font-bold text-gray-800">{gig.name}</p>
                  <p className="text-sm font-body text-gray-500">
                    {formatDate(gig.date)} &middot; {gig.location}
                  </p>
                </div>
                <div className="text-right">
                  {gig.type === 'private' ? (
                    <>
                      <p className="text-gold font-bold text-lg">
                        {formatMoney(gig.payout!)}
                      </p>
                      <p className="text-xs text-gray-400 font-body">private gig</p>
                    </>
                  ) : (
                    <>
                      <p className="text-turquoise font-bold text-lg">Impact Gig</p>
                      <p className="text-xs text-gray-400 font-body">
                        {gig.rsvpCount} RSVPs expected
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Past Gigs */}
      {pastGigs.length > 0 && (
        <section>
          <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
            Past Gigs
          </h3>
          <div className="space-y-3">
            {pastGigs.map((gig) => (
              <div
                key={gig.id}
                className="card flex flex-wrap items-center justify-between gap-4 opacity-75"
              >
                <div>
                  <p className="font-heading font-bold text-gray-700">{gig.name}</p>
                  <p className="text-sm font-body text-gray-400">
                    {formatDate(gig.date)} &middot; {gig.location}
                  </p>
                </div>
                <div className="text-right">
                  {gig.type === 'private' ? (
                    <>
                      <p className="text-gold font-bold text-lg">
                        {formatMoney(gig.payout!)}
                      </p>
                      <p className="text-xs text-gray-400 font-body">private gig</p>
                    </>
                  ) : (
                    <>
                      <p className="text-turquoise font-bold text-lg">Impact Gig</p>
                      <p className="text-xs text-gray-400 font-body">
                        {gig.rsvpCount} attended
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
              {formatMoney(totalEarnings)}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
              Impact Gigs
            </p>
            <p className="impact-number text-turquoise">{completedEvents.length}</p>
          </div>
          <div className="card text-center">
            <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-1">
              Private Gigs
            </p>
            <p className="impact-number text-azure">{completedPrivate.length}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
