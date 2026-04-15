import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getServerSession } from '@/lib/supabase/server'
import {
  getMusicianByUserId,
  getNonprofitByUserId,
  getMusicians,
  getBookingsByMusicianId,
  getBookingsByCommunityMemberId,
  getEventsByNonprofitId,
  getEventsByMusicianId,
} from '@/lib/db'
import type { DbBookingWithMusician } from '@/lib/db/types'
import { formatDate, formatMoney } from '@/lib/format'
import { MusicianDashboard } from './MusicianDashboard'
import { NonProfitDashboard } from './NonProfitDashboard'

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

// ─── Community Member Dashboard ───────────────────────────────────────────────

function CommunityDashboard({
  displayName,
  bookings,
}: {
  displayName: string
  bookings: DbBookingWithMusician[]
}) {
  const totalImpact = bookings.reduce((sum, b) => sum + b.commission_amount, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl uppercase tracking-wide text-azure">
          Welcome back, {displayName}!
        </h1>
        <p className="font-body text-gray-500 mt-1">
          Here&apos;s everything happening with your bookings and impact.
        </p>
      </div>

      {/* Your Bookings */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Your Bookings
        </h3>
        {bookings.length === 0 ? (
          <p className="text-gray-500 font-body">No bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-heading font-bold text-lg text-gray-800">
                    {booking.event_name}
                  </h4>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="text-sm font-body text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-700">Musician:</span>{' '}
                    <span className="text-turquoise font-semibold">
                      {booking.musicians?.name ?? 'Unknown'}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Date:</span>{' '}
                    {formatDate(booking.event_date)}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Total Charged:</span>{' '}
                    <span className="text-gold font-bold">
                      {formatMoney(booking.total_charged)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Impact Summary */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Your Impact
        </h3>
        <div className="card text-center max-w-sm">
          <p className="text-sm font-heading font-semibold uppercase text-gray-500 mb-2">
            Total Contributed to Impact Pool
          </p>
          <p className="impact-number text-gold">{formatMoney(totalImpact)}</p>
          <p className="text-xs font-body text-gray-400 mt-2">
            Every booking contributes a portion to fund live music at non-profit events
            across Austin.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4 pb-2 border-b-2 border-sand-dark">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/musicians" className="btn-primary">
            Find a Musician
          </Link>
          <Link href="/events" className="btn-secondary">
            Browse Events
          </Link>
        </div>
      </section>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  if (session.role === 'musician') {
    const musician = await getMusicianByUserId(session.userId)
    if (!musician) redirect('/signup?role=musician')

    const [bookings, assignedEvents] = await Promise.all([
      getBookingsByMusicianId(musician.id),
      getEventsByMusicianId(musician.id),
    ])

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar initialSession={session} />
        <main className="flex-1">
          <MusicianDashboard
            musician={musician}
            bookings={bookings}
            assignedEvents={assignedEvents}
          />
        </main>
        <Footer isLoggedIn />
      </div>
    )
  }

  if (session.role === 'nonprofit') {
    const nonprofit = await getNonprofitByUserId(session.userId)
    if (!nonprofit) redirect('/signup?role=nonprofit')

    const [events, musicians] = await Promise.all([
      getEventsByNonprofitId(nonprofit.id),
      getMusicians(),
    ])

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar initialSession={session} />
        <main className="flex-1">
          <NonProfitDashboard
            nonprofit={nonprofit}
            events={events}
            musicians={musicians}
          />
        </main>
        <Footer isLoggedIn />
      </div>
    )
  }

  // community
  const bookings = await getBookingsByCommunityMemberId(session.userId)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialSession={session} />
      <main className="flex-1">
        <CommunityDashboard displayName={session.displayName} bookings={bookings} />
      </main>
      <Footer isLoggedIn />
    </div>
  )
}
