import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/supabase/server'
import { getMusicians } from '@/lib/db/musicians'
import NewEventForm from './NewEventForm'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function NewEventPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'nonprofit') redirect('/home')

  const musicians = await getMusicians()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar initialSession={session} />

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

      <NewEventForm musicians={musicians} />

      <Footer isLoggedIn={!!session} />
    </div>
  )
}
