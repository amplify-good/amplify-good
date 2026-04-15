import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServerSession } from "@/lib/supabase/server";

export default async function DonatePage() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar initialSession={session} />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-parchment py-12 border-b-2 border-gold">
          <div className="max-w-7xl mx-auto px-4 flex items-stretch gap-5">
            <img
              src="/images/icons/hands_heart_window_icon.png"
              alt=""
              aria-hidden="true"
              className="h-20 w-auto hidden sm:block shrink-0 self-center object-contain"
            />
            <div className="flex flex-col justify-center">
              <h1 className="font-display text-5xl sm:text-6xl uppercase text-azure mb-2">
                Donate
              </h1>
              <p className="font-heading text-sienna text-lg">
                Help us amplify the good across Austin&apos;s music and nonprofit community.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <section className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="card px-8 py-12 sm:px-12 sm:py-16">
            <img
              src="/images/icons/impact_star_icon.png"
              alt=""
              aria-hidden="true"
              className="h-16 w-auto mx-auto mb-6 object-contain"
            />

            <h2 className="font-display text-3xl sm:text-4xl uppercase text-azure mb-4">
              Coming Soon
            </h2>

            <p className="font-body text-gray-600 text-lg leading-relaxed mb-4 max-w-xl mx-auto">
              We&apos;re building a way for you to directly support the artists and
              nonprofits that make Austin&apos;s live music scene thrive. Every
              dollar will flow into the Impact Pool — funding performances at
              community events across the city.
            </p>

            <p className="font-body text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Whether it&apos;s sponsoring a set, covering a musician&apos;s fee, or
              backing a cause you believe in — your generosity will keep the
              music playing where it matters most.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-gold/40" />
              <img
                src="/images/icons/bluebonnet_star_icon.png"
                alt=""
                aria-hidden="true"
                className="h-8 w-auto object-contain"
              />
              <div className="h-px w-20 bg-gold/40" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/events" className="btn-primary">
                Browse Events
              </Link>
              <Link href="/home" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={!!session} />
    </div>
  );
}
