import Link from 'next/link'
import { getEventById } from '@/lib/db/events'
import { notFound } from 'next/navigation'
import SponsorForm from './SponsorForm'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getServerSession } from '@/lib/supabase/server'

export default async function SponsorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [session, event] = await Promise.all([
    getServerSession(),
    getEventById(id),
  ])
  if (!event) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar initialSession={session} />

      {/* Page Header */}
      <section className="bg-parchment py-10 px-4 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto">
          <p className="font-heading text-sm text-sienna uppercase tracking-widest mb-1">
            Impact Sponsorship
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase text-azure">
            Sponsor This Set
          </h1>
          <p className="font-body text-gray-600 mt-2 max-w-lg">
            Your sponsorship covers a live music performance at a non-profit event. Your
            name will be featured as an Impact Sponsor.
          </p>
        </div>
      </section>

      {session ? (
        <SponsorForm
          event={event}
          musician={event.musicians ?? null}
          nonprofit={event.nonprofits ?? null}
        />
      ) : (
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="card max-w-md text-center space-y-4">
            <h2 className="font-display text-2xl uppercase text-azure">
              Log In to Sponsor
            </h2>
            <p className="font-body text-gray-600">
              Sign in to sponsor the live music performance at {event.name}.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Link href="/login" className="btn-primary">
                Log In
              </Link>
              <Link href={`/events/${event.id}`} className="btn-secondary">
                Back to Event
              </Link>
            </div>
          </div>
        </main>
      )}

      <Footer isLoggedIn={!!session} />
    </div>
  )
}
