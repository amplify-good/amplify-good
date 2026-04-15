import Link from 'next/link'
import { getMusicianById } from '@/lib/db/musicians'
import { notFound } from 'next/navigation'
import BookingForm from './BookingForm'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getServerSession } from '@/lib/supabase/server'

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [session, musician] = await Promise.all([
    getServerSession(),
    getMusicianById(id),
  ])
  if (!musician) notFound()

  const canBook = session?.role === 'community'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar initialSession={session} />
      {canBook ? (
        <BookingForm musician={musician} />
      ) : (
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="card max-w-md text-center space-y-4">
            <h2 className="font-display text-2xl uppercase text-azure">
              {!session ? 'Log In to Book' : 'Booking Unavailable'}
            </h2>
            <p className="font-body text-gray-600">
              {!session
                ? `Sign in with a community account to request a booking with ${musician.name}.`
                : 'Only community members can request musician bookings.'}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              {!session && (
                <Link href="/login" className="btn-primary">
                  Log In
                </Link>
              )}
              <Link href={`/musicians/${musician.id}`} className="btn-secondary">
                Back to Profile
              </Link>
            </div>
          </div>
        </main>
      )}
      <Footer isLoggedIn={!!session} />
    </div>
  )
}
