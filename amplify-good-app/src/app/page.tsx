import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase/server";

const roles = [
  {
    icon: "/images/icons/guitar_icon.png",
    title: "I'm a Musician",
    description: "Create your profile, set your rate, and get booked.",
    href: "/signup?role=musician",
    accent: "border-t-4 border-t-sienna",
    btnClass: "btn-primary",
  },
  {
    icon: "/images/icons/hands_heart_window_icon.png",
    title: "I'm a Non-Profit",
    description: "Post events and get matched with musicians at zero cost.",
    href: "/signup?role=nonprofit",
    accent: "border-t-4 border-t-azure",
    btnClass: "btn-secondary",
  },
  {
    icon: "/images/icons/music_notes_icon.png",
    title: "I Need a Musician",
    description: "Browse events, book musicians, or sponsor a set.",
    href: "/signup?role=community",
    accent: "border-t-4 border-t-orange",
    btnClass: "btn-primary",
  },
];

export default async function LandingPage() {
  const session = await getServerSession();
  if (session) {
    redirect(session.role === "community" ? "/home" : "/dashboard");
  }

  return (
    <main className="sm:h-screen flex flex-col min-h-screen relative">
      {/* Decorative corner accents — subtle, festival-poster style */}
      <img src="/images/icons/armadillo_icon.png" alt="" className="absolute bottom-16 left-6 h-12 hidden sm:block" aria-hidden="true" />
      <img src="/images/icons/cactus_small_icon.png" alt="" className="absolute bottom-16 right-6 h-16 hidden sm:block" aria-hidden="true" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-6 relative z-10">
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Amplify Good — fist holding microphone with lightning bolt"
          className="h-52 sm:h-60 w-auto object-contain drop-shadow-lg mb-2"
        />
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-azure tracking-wide">
          Amplify Good
        </h1>

        <p className="font-heading text-base sm:text-lg text-sienna font-semibold tracking-wide max-w-xl text-center mt-2">
          Where Wealth Preserves Art &amp; Art Drives Social Impact
        </p>

        {/* Decorative divider — guitar + lines */}
        <div className="flex items-center gap-4 my-5">
          <div className="h-px w-24 sm:w-40 bg-sienna/40" />
          <Image
            src="/images/icons/impact_star_icon.png"
            alt=""
            width={40}
            height={40}
            style={{ width: 'auto', height: 'auto' }}
            aria-hidden="true"
          />
          <div className="h-px w-24 sm:w-40 bg-sienna/40" />
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {roles.map((role) => (
            <div
              key={role.title}
              className={`card flex flex-col items-center text-center px-5 pb-5 pt-6 ${role.accent}`}
            >
              <div className="h-16 flex items-center justify-center mb-3">
                <img
                  src={role.icon}
                  alt={role.title}
                  className="max-h-full max-w-[60px] object-contain"
                />
              </div>

              <h2 className="font-heading text-lg font-bold text-azure mb-1">
                {role.title}
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-3">
                {role.description}
              </p>

              <Link href={role.href} className={`${role.btnClass} inline-block mt-auto py-2! px-6! text-sm`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* Login link */}
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-azure hover:text-sienna transition-colors underline underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* Bottom banner bar */}
      <div className="banner-bar">
        Built for ATX &nbsp;|&nbsp; Amplify the Good City-Wide
      </div>
    </main>
  );
}
