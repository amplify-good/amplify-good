"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getSession, logout, getDisplayName } from "@/lib/auth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<{ role: string; email: string } | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const handleLogout = () => {
    logout();
    setSession(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-azure text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={session ? "/home" : "/"} className="flex items-center gap-2">
            <img
              src="/images/fist-logo.png"
              alt="Amplify Good"
              className="h-10 w-auto object-contain"
            />
            <span className="font-display text-xl tracking-wide uppercase">
              Amplify Good
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 font-heading font-semibold text-sm uppercase tracking-wide">
            <Link href="/events" className="hover:text-orange transition-colors">
              Events
            </Link>
            <Link href="/musicians" className="hover:text-orange transition-colors">
              Musicians
            </Link>
            <Link href="/dashboard" className="hover:text-orange transition-colors">
              Dashboard
            </Link>
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-orange normal-case text-xs">
                  {getDisplayName(session.email)}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-azure !py-2 !px-4 text-sm rounded-full"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-azure !py-2 !px-4 text-sm rounded-full">
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
            <Link href="/dashboard" className="block py-2 hover:text-orange" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            {session ? (
              <>
                <span className="block py-2 text-orange normal-case text-xs">
                  {getDisplayName(session.email)}
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
