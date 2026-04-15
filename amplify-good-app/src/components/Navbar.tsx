"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AppSession } from "@/lib/auth";

function sessionFromUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }): AppSession | null {
  const role = user.user_metadata?.role as AppSession["role"] | undefined;
  const displayName = user.user_metadata?.display_name as string | undefined;
  if (!role) return null;
  return { userId: user.id, email: user.email!, role, displayName: displayName || user.email! };
}

export default function Navbar({ initialSession }: { initialSession?: AppSession | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<AppSession | null>(initialSession ?? null);

  useEffect(() => {
    const supabase = createClient();

    if (!initialSession) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setSession(user ? sessionFromUser(user) : null);
      });
    }

    // Per Supabase docs: keep this callback synchronous and never await
    // other Supabase methods inside it to avoid deadlocks.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, supabaseSession) => {
        if (!supabaseSession?.user) {
          setSession(null);
          return;
        }
        setSession(sessionFromUser(supabaseSession.user));
      }
    );

    return () => subscription.unsubscribe();
  }, [initialSession]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: 'local' });
    window.location.href = "/";
  };

  return (
    <nav className="bg-azure text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/fist-logo.png"
              alt="Amplify Good"
              className="h-14 w-auto object-contain"
            />
            <span className="font-display text-2xl tracking-wide uppercase">
              Amplify Good
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4 font-heading font-semibold text-sm uppercase tracking-wide">
            <Link href="/events" className="hover:text-orange transition-colors">
              Events
            </Link>
            <Link href="/musicians" className="hover:text-orange transition-colors">
              Musicians
            </Link>
            {session && (
              <Link href="/dashboard" className="hover:text-orange transition-colors">
                Dashboard
              </Link>
            )}
            {session ? (
              <div className="flex items-center gap-2 -ml-2">
                <span className="border-l border-white/40 pl-2 text-orange">
                  {session.displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary border-white! text-white! hover:bg-white! hover:text-azure! py-2! px-4! text-sm rounded-full"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-secondary border-white! text-white! hover:bg-white! hover:text-azure! py-2! px-4! text-sm rounded-full">
                Log In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 font-heading font-semibold text-sm uppercase tracking-wide">
            <Link href="/events" className="block py-2 hover:text-orange" onClick={() => setMenuOpen(false)}>
              Events
            </Link>
            <Link href="/musicians" className="block py-2 hover:text-orange" onClick={() => setMenuOpen(false)}>
              Musicians
            </Link>
            {session && (
              <Link href="/dashboard" className="block py-2 hover:text-orange" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            )}
            {session ? (
              <>
                <span className="block py-2 text-orange normal-case text-xs">
                  {session.displayName}
                </span>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="block py-2 hover:text-orange text-left w-full"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block py-2 hover:text-orange" onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
