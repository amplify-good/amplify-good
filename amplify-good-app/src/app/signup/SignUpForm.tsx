"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signupLogin } from "@/lib/auth";

type Role = "musician" | "nonprofit" | "community";

const GENRES = [
  "Rock",
  "Jazz",
  "Country",
  "Hip-Hop",
  "R&B",
  "Mariachi",
  "Classical",
  "Electronic",
  "Folk",
  "Latin",
  "Blues",
];

const ROLE_META: Record<
  Role,
  { label: string; badgeColor: string; badgeBg: string }
> = {
  musician: {
    label: "Musician",
    badgeColor: "text-white",
    badgeBg: "bg-azure",
  },
  nonprofit: {
    label: "Non-Profit",
    badgeColor: "text-white",
    badgeBg: "bg-sienna",
  },
  community: {
    label: "Community Member",
    badgeColor: "text-foreground",
    badgeBg: "bg-orange",
  },
};

// ─── Shared input styles ────────────────────────────────────────────────────
const inputClass =
  "w-full border border-gray-300 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition";
const labelClass = "block font-heading font-semibold text-sm text-gray-700 mb-1";

// ─── Sub-components for each role form ──────────────────────────────────────

function MusicianForm() {
  const [genres, setGenres] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [rateType, setRateType] = useState("hourly");

  const toggleGenre = (g: string) =>
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );

  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="m-name" className={labelClass}>Name</label>
        <input id="m-name" type="text" placeholder="Your full name" className={inputClass} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="m-email" className={labelClass}>Email</label>
        <input id="m-email" type="email" placeholder="you@example.com" className={inputClass} />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="m-password" className={labelClass}>Password</label>
        <input
          id="m-password"
          type="password"
          placeholder="Create a password"
          className={inputClass}
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="m-bio" className={labelClass}>
          Bio{" "}
          <span className="text-gray-400 font-normal">
            ({bio.length}/500)
          </span>
        </label>
        <textarea
          id="m-bio"
          rows={4}
          maxLength={500}
          placeholder="Tell the Austin community about yourself…"
          className={inputClass + " resize-none"}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {/* Genre multi-select */}
      <div>
        <label className={labelClass}>Genre(s)</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {GENRES.map((g) => {
            const selected = genres.includes(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                className={`px-3 py-1 rounded-md text-sm font-heading font-semibold border transition cursor-pointer ${
                  selected
                    ? "bg-azure text-white border-azure"
                    : "bg-sand-light text-azure border-sand-dark hover:border-azure"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
        {genres.length === 0 && (
          <p className="text-xs text-gray-400 mt-1">Select at least one genre.</p>
        )}
      </div>

      {/* Media Links */}
      <div>
        <label htmlFor="m-media" className={labelClass}>Media Links</label>
        <input
          id="m-media"
          type="text"
          placeholder="SoundCloud, Spotify, YouTube, etc."
          className={inputClass}
        />
      </div>

      {/* Social Links */}
      <div>
        <label htmlFor="m-social" className={labelClass}>Social Links</label>
        <input
          id="m-social"
          type="text"
          placeholder="Instagram, TikTok, Facebook, etc."
          className={inputClass}
        />
      </div>

      {/* Rate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="m-rate" className={labelClass}>Standard Rate ($)</label>
          <input
            id="m-rate"
            type="number"
            placeholder="e.g. 150"
            min={0}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="m-ratetype" className={labelClass}>Rate Type</label>
          <select
            id="m-ratetype"
            className={inputClass + " bg-white cursor-pointer"}
            value={rateType}
            onChange={(e) => setRateType(e.target.value)}
          >
            <option value="hourly">Hourly</option>
            <option value="per_event">Per Event</option>
          </select>
        </div>
      </div>

      {/* Profile Photo */}
      <div>
        <label htmlFor="m-photo" className={labelClass}>Profile Photo</label>
        <label htmlFor="m-photo" className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-azure transition cursor-pointer block" role="button" tabIndex={0}>
          <svg
            className="mx-auto h-10 w-10 text-gray-300 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
          <p className="text-sm text-gray-500 font-body">
            Click to upload or drag &amp; drop
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
          <input id="m-photo" type="file" accept="image/*" className="sr-only" aria-label="Upload profile photo" />
        </label>
      </div>
    </div>
  );
}

function NonProfitForm() {
  const [bio, setBio] = useState("");

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="np-name" className={labelClass}>Organization Name</label>
        <input id="np-name" type="text" placeholder="Your organization's name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-bio" className={labelClass}>
          Bio / Mission Statement{" "}
          <span className="text-gray-400 font-normal">({bio.length}/1000)</span>
        </label>
        <textarea id="np-bio" rows={5} maxLength={1000} placeholder="Describe your mission and how live music supports your cause…" className={inputClass + " resize-none"} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div>
        <label htmlFor="np-website" className={labelClass}>Website</label>
        <input id="np-website" type="url" placeholder="https://yourorg.org" className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-email" className={labelClass}>Contact Email</label>
        <input id="np-email" type="email" placeholder="contact@yourorg.org" className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-password" className={labelClass}>Password</label>
        <input id="np-password" type="password" placeholder="Create a password" className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-logo" className={labelClass}>Organization Logo</label>
        <label htmlFor="np-logo" className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-sienna transition cursor-pointer block" role="button" tabIndex={0}>
          <svg className="mx-auto h-10 w-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
          </svg>
          <p className="text-sm text-gray-500 font-body">Click to upload or drag &amp; drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG up to 5MB</p>
          <input id="np-logo" type="file" accept="image/*" className="sr-only" aria-label="Upload organization logo" />
        </label>
      </div>
    </div>
  );
}

function CommunityForm() {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="c-name" className={labelClass}>Name</label>
        <input id="c-name" type="text" placeholder="Your full name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="c-email" className={labelClass}>Email</label>
        <input id="c-email" type="email" placeholder="you@example.com" className={inputClass} />
      </div>
      <div>
        <label htmlFor="c-password" className={labelClass}>Password</label>
        <input id="c-password" type="password" placeholder="Create a password" className={inputClass} />
      </div>
    </div>
  );
}

// ─── Role Selector ───────────────────────────────────────────────────────────

function RoleSelector({
  current,
  onSelect,
}: {
  current: Role;
  onSelect: (r: Role) => void;
}) {
  const roles: { value: Role; label: string }[] = [
    { value: "musician", label: "Musician" },
    { value: "nonprofit", label: "Non-Profit" },
    { value: "community", label: "Community" },
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center mb-6">
      {roles.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onSelect(r.value)}
          className={`px-4 py-2 rounded-full font-heading font-semibold text-sm uppercase tracking-wide border-2 transition cursor-pointer ${
            current === r.value
              ? r.value === "musician"
                ? "bg-azure text-white border-azure"
                : r.value === "nonprofit"
                ? "bg-sienna text-white border-sienna"
                : "bg-orange text-foreground border-orange"
              : "bg-sand-light text-gray-500 border-sand-dark hover:border-gray-400"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawRole = searchParams.get("role") ?? "community";
  const initialRole: Role = ["musician", "nonprofit", "community"].includes(
    rawRole
  )
    ? (rawRole as Role)
    : "community";

  const [role, setRole] = useState<Role>(initialRole);

  const handleRoleChange = (r: Role) => {
    setRole(r);
    router.replace(`/signup?role=${r}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const demoEmails: Record<string, string> = {
      musician: "music@gmail.com",
      nonprofit: "npo@gmail.com",
      community: "fan@gmail.com",
    };
    signupLogin(role, demoEmails[role]);
    router.push(`/dashboard?role=${role}`);
  };

  const meta = ROLE_META[role];

  const headings: Record<Role, string> = {
    musician: "Join as a Musician",
    nonprofit: "Register Your Non-Profit",
    community: "Join the Community",
  };

  const descriptions: Record<Role, string> = {
    musician:
      "Get booked at Austin non-profit events and share your music with the community.",
    nonprofit:
      "Connect with talented local musicians to elevate your events and drive social impact.",
    community:
      "Discover live music, support local artists, and make every dollar count.",
  };

  return (
    <div className="bg-sand-light rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gold">
      {/* Header band */}
      <div className="bg-parchment px-8 py-6 text-center border-b-2 border-gold relative overflow-hidden">
        <h1 className="font-display text-3xl uppercase tracking-wide mb-1 text-azure">
          Amplify the Good
        </h1>
        <p className="font-body text-sienna text-sm">
          Austin&apos;s Music &amp; Non-Profit Marketplace
        </p>
        <img src="/images/icons/armadillo_icon.png" alt="" className="absolute bottom-1 left-3 h-8" aria-hidden="true" />
      </div>

      <div className="px-8 py-8">
        {/* Role switcher */}
        <RoleSelector current={role} onSelect={handleRoleChange} />

        {/* Role badge + heading */}
        <div className="text-center mb-6">
          <span
            className={`inline-block px-4 py-1 rounded-md text-xs font-heading font-bold uppercase tracking-widest mb-3 ${meta.badgeBg} ${meta.badgeColor}`}
          >
            {meta.label}
          </span>
          <h2 className="font-heading font-bold text-2xl text-gray-800">
            {headings[role]}
          </h2>
          <p className="text-gray-500 text-sm font-body mt-1">
            {descriptions[role]}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {role === "musician" && <MusicianForm />}
          {role === "nonprofit" && <NonProfitForm />}
          {role === "community" && <CommunityForm />}

          {/* Terms */}
          <p className="text-xs text-gray-400 font-body text-center">
            By signing up you agree to our{" "}
            <a href="#" className="text-azure underline cursor-pointer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-azure underline cursor-pointer">
              Privacy Policy
            </a>
            .
          </p>

          {/* Submit */}
          <button type="submit" className="btn-primary w-full text-center">
            Create Account
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm font-body text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-azure font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
