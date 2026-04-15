import { getMusicians } from "@/lib/db/musicians";
import MusiciansClient from "./MusiciansClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "@/lib/supabase/server";

export default async function MusiciansPage() {
  const [session, musicians] = await Promise.all([
    getServerSession(),
    getMusicians(),
  ]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialSession={session} />
      <MusiciansClient musicians={musicians} />
      <Footer isLoggedIn={!!session} />
    </div>
  );
}
