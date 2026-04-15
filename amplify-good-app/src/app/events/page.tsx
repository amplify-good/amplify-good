import { getEvents, completeExpiredEvents } from "@/lib/db/events";
import { getMusicians } from "@/lib/db/musicians";
import { getNonprofits } from "@/lib/db/nonprofits";
import { getUserRsvpEventIds } from "@/lib/db/rsvps";
import { completeExpiredBookings } from "@/lib/db/bookings";
import EventsClient from "./EventsClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "@/lib/supabase/server";

export default async function EventsPage() {
  await Promise.all([completeExpiredEvents(), completeExpiredBookings()]);

  const [session, events, musicians, nonprofits] = await Promise.all([
    getServerSession(),
    getEvents(),
    getMusicians(),
    getNonprofits(),
  ]);

  const rsvpedEventIds = session
    ? Array.from(await getUserRsvpEventIds(session.userId))
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialSession={session} />
      <EventsClient events={events} musicians={musicians} nonprofits={nonprofits} rsvpedEventIds={rsvpedEventIds} />
      <Footer isLoggedIn={!!session} />
    </div>
  );
}
