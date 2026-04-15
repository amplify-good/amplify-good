import { getEvents } from "@/lib/db/events";
import { getMusicians } from "@/lib/db/musicians";
import { getNonprofits } from "@/lib/db/nonprofits";
import EventsClient from "./EventsClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "@/lib/supabase/server";

export default async function EventsPage() {
  const [session, events, musicians, nonprofits] = await Promise.all([
    getServerSession(),
    getEvents(),
    getMusicians(),
    getNonprofits(),
  ]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialSession={session} />
      <EventsClient events={events} musicians={musicians} nonprofits={nonprofits} />
      <Footer isLoggedIn={!!session} />
    </div>
  );
}
