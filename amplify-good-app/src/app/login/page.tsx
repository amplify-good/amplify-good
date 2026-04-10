"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { login, DEMO_ACCOUNTS } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const role = login(email);
    if (!role) {
      setError("Demo accounts: music@gmail.com, npo@gmail.com, or fan@gmail.com (any password)");
      return;
    }

    // Redirect based on role
    if (role === "musician") router.push("/dashboard?role=musician");
    else if (role === "nonprofit") router.push("/dashboard?role=nonprofit");
    else router.push("/home");
  };

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition";
  const labelClass =
    "block font-heading font-semibold text-sm text-gray-700 mb-1";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="bg-sand-light rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gold">
          {/* Header band */}
          <div className="bg-parchment px-8 py-6 text-center border-b-2 border-gold">
            <h1 className="font-display text-3xl uppercase tracking-wide mb-1 text-azure">
              Amplify the Good
            </h1>
            <p className="font-body text-sienna text-sm">
              Austin&apos;s Music &amp; Non-Profit Marketplace
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="font-heading font-bold text-2xl text-gray-800 mb-1">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm font-body">
                Log in to your Amplify the Good account
              </p>
            </div>

            {/* Demo account hint */}
            <div className="card !bg-parchment mb-6 text-xs font-body text-gray-600">
              <p className="font-heading font-semibold text-azure text-sm mb-2">Demo Accounts</p>
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => { setEmail(a.email); setError(""); }}
                  className="block w-full text-left py-1 hover:text-azure cursor-pointer transition-colors"
                >
                  <span className="font-semibold">{a.email}</span>
                  <span className="text-gray-400 ml-2">— {a.name} ({a.role})</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="music@gmail.com"
                  required
                  className={inputClass}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="login-password" className={labelClass}>
                    Password
                  </label>
                  <button type="button" className="text-xs text-azure hover:underline cursor-pointer font-body">
                    Forgot password?
                  </button>
                </div>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Any password works"
                  required
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-sienna font-body">{error}</p>
              )}

              {/* Submit */}
              <button type="submit" className="btn-primary w-full text-center mt-2">
                Log In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-sand-light px-4 text-xs text-gray-400 font-body uppercase tracking-wider">
                  Or join as
                </span>
              </div>
            </div>

            {/* Quick sign-up role links */}
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/signup?role=musician"
                className="text-center py-3 px-3 rounded-xl border-2 border-azure text-azure font-heading font-semibold text-xs uppercase tracking-wide hover:bg-azure hover:text-white transition min-h-[44px] flex items-center justify-center"
              >
                Musician
              </Link>
              <Link
                href="/signup?role=nonprofit"
                className="text-center py-3 px-3 rounded-xl border-2 border-sienna text-sienna font-heading font-semibold text-xs uppercase tracking-wide hover:bg-sienna hover:text-white transition min-h-[44px] flex items-center justify-center"
              >
                Non-Profit
              </Link>
              <Link
                href="/signup?role=community"
                className="text-center py-3 px-3 rounded-xl border-2 border-orange text-gray-700 font-heading font-semibold text-xs uppercase tracking-wide hover:bg-orange hover:text-foreground transition min-h-[44px] flex items-center justify-center"
              >
                Community
              </Link>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm font-body text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-azure font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
