import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import { getMusicianById } from "@/lib/db/musicians";
import { getEvents } from "@/lib/db/events";
import { getServerSession } from "@/lib/supabase/server";

// Social platform display config
const socialIconMap: Record<string, { label: string; icon: string }> = {
  instagram: { label: "Instagram", icon: "📸" },
  twitter:   { label: "Twitter / X", icon: "🐦" },
  facebook:  { label: "Facebook", icon: "📘" },
  tiktok:    { label: "TikTok", icon: "🎵" },
  website:   { label: "Website", icon: "🌐" },
  youtube:   { label: "YouTube", icon: "▶️" },
};

// Media type display config
const mediaTypeMap: Record<string, { label: string; prefix: string; color: string }> = {
  spotify:    { label: "Listen on Spotify",    prefix: "♪",  color: "bg-green-100 text-green-800 hover:bg-green-200" },
  youtube:    { label: "Watch on YouTube",     prefix: "▶",  color: "bg-red-100 text-red-800 hover:bg-red-200" },
  soundcloud: { label: "Listen on SoundCloud", prefix: "☁",  color: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
};

export default async function MusicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, musician] = await Promise.all([
    getServerSession(),
    getMusicianById(id),
  ]);

  if (!musician) {
    notFound();
  }

  const events = await getEvents({ status: "upcoming" });
  const sponsorableEvent = events.find(
    (e) => e.musician_id === musician.id
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar initialSession={session} />

      {/* Hero Section */}
      <section className="bg-azure text-white py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-5">
          {/* Circular profile photo */}
          <div className="w-48 h-48 shrink-0">
            <img
              src={musician.photo_url ?? "/images/icons/musician_profile_window_icon.png"}
              alt={musician.name}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Name */}
          <h1 className="font-display text-5xl md:text-6xl uppercase text-orange leading-tight">
            {musician.name}
          </h1>

          {/* Genres */}
          <div className="flex items-center justify-center flex-wrap gap-1">
            {musician.genres.map((genre, i) => (
              <span key={genre} className="flex items-center gap-1">
                <span className="font-heading font-semibold text-sm text-orange">{genre}</span>
                {i < musician.genres.length - 1 && (
                  <span className="text-white/40 font-bold text-sm">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Availability */}
          <span
            className={`font-heading text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-md ${
              musician.available
                ? "bg-green-500/20 text-green-300"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {musician.available ? "Available for Bookings" : "Currently Unavailable"}
          </span>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-10">

        {/* Rate */}
        <section className="card text-center">
          <p className="font-heading text-sm uppercase tracking-widest text-gray-500 mb-1">Rate</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="impact-number text-5xl">${musician.rate}</span>
            <span className="font-body text-gray-500">
              per {musician.rate_type === "per_event" ? "event" : "hour"}
            </span>
          </div>
        </section>

        <SectionDivider icon="/images/icons/longhorn_skull_icon.png" />

        {/* Bio */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-azure uppercase tracking-wide mb-4">
            About
          </h2>
          <div className="card">
            <p className="font-body text-gray-700 leading-relaxed text-base">
              {musician.bio}
            </p>
          </div>
        </section>

        {/* Media Gallery */}
        {musician.musician_media_links.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-azure uppercase tracking-wide mb-4">
              Listen &amp; Watch
            </h2>
            <div className="flex flex-wrap gap-3">
              {musician.musician_media_links.map((link, i) => {
                const meta = mediaTypeMap[link.type] ?? {
                  label: `Listen: ${link.label}`,
                  prefix: "♪",
                  color: "bg-sand-light text-azure hover:bg-azure/10",
                };
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 font-heading font-semibold text-sm px-5 py-3 rounded-full transition-colors ${meta.color}`}
                  >
                    <span aria-hidden="true">{meta.prefix}</span>
                    <span>{meta.label}</span>
                    <span className="opacity-70 text-xs">— {link.label}</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Social Links */}
        {musician.musician_social_links.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-azure uppercase tracking-wide mb-4">
              Connect
            </h2>
            <div className="flex flex-wrap gap-3">
              {musician.musician_social_links.map((link, i) => {
                const meta = socialIconMap[link.platform] ?? {
                  label: link.platform,
                  icon: "🔗",
                };
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-heading font-semibold text-sm text-azure border border-azure px-4 py-2 rounded-full hover:bg-azure hover:text-white transition-colors"
                  >
                    <span aria-hidden="true">{meta.icon}</span>
                    {meta.label}
                  </a>
                );
              })}
            </div>
          </section>
        )}

        <SectionDivider icon="/images/icons/cactus_small_icon.png" />

        {/* CTA Buttons */}
        <section className="flex flex-col sm:flex-row gap-4 pt-4">
          {session?.role === 'community' ? (
            <Link
              href={`/book/${musician.id}`}
              className="btn-primary inline-block text-center"
            >
              Request Booking
            </Link>
          ) : !session ? (
            <Link
              href="/login"
              className="btn-primary inline-block text-center"
            >
              Log In to Book
            </Link>
          ) : null}
          {session ? (
            sponsorableEvent ? (
              <Link
                href={`/sponsor/${sponsorableEvent.id}`}
                className="btn-secondary inline-block text-center"
              >
                Sponsor This Set
              </Link>
            ) : (
              <Link
                href="/events"
                className="btn-secondary inline-block text-center"
              >
                Find an Event to Sponsor
              </Link>
            )
          ) : null}
          <Link
            href="/musicians"
            className="font-heading font-semibold text-sm text-gray-500 hover:text-azure transition-colors self-center underline underline-offset-2"
          >
            ← Back to Directory
          </Link>
        </section>

      </main>

      <Footer isLoggedIn={!!session} />
    </div>
  );
}
