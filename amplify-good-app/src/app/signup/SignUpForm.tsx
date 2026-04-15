"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signupAndLogin, type Role } from "@/lib/auth";
import { uploadAvatar } from "@/lib/supabase/storage";
import { updateMusicianProfileAction } from "@/app/actions/profiles";

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

function MusicianForm({
  name,
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  bio,
  onBioChange,
  genres,
  onGenresChange,
  rate,
  onRateChange,
  rateType,
  onRateTypeChange,
  photoPreview,
  photoRef,
  onPhotoChange,
  onPhotoRemove,
  error,
}: {
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  bio: string;
  onBioChange: (v: string) => void;
  genres: string[];
  onGenresChange: (v: string[]) => void;
  rate: string;
  onRateChange: (v: string) => void;
  rateType: "hourly" | "per_event";
  onRateTypeChange: (v: "hourly" | "per_event") => void;
  photoPreview: string | null;
  photoRef: React.RefObject<HTMLInputElement | null>;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: () => void;
  error: string;
}) {
  const toggleGenre = (g: string) => {
    const nextGenres = genres.includes(g)
      ? genres.filter((genre) => genre !== g)
      : [...genres, g];
    onGenresChange(nextGenres);
  };

  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="m-name" className={labelClass}>Name</label>
        <input
          id="m-name"
          type="text"
          placeholder="Your full name"
          className={inputClass}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="m-email" className={labelClass}>Email</label>
        <input
          id="m-email"
          type="email"
          placeholder="you@example.com"
          className={inputClass}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="m-password" className={labelClass}>Password</label>
        <input
          id="m-password"
          type="password"
          placeholder="Create a password"
          className={inputClass}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
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
          onChange={(e) => onBioChange(e.target.value)}
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
            value={rate}
            onChange={(e) => onRateChange(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="m-ratetype" className={labelClass}>Rate Type</label>
          <select
            id="m-ratetype"
            className={inputClass + " bg-white cursor-pointer"}
            value={rateType}
            onChange={(e) => onRateTypeChange(e.target.value as "hourly" | "per_event")}
          >
            <option value="hourly">Hourly</option>
            <option value="per_event">Per Event</option>
          </select>
        </div>
      </div>

      {/* Profile Photo */}
      <div>
        <label className={labelClass}>Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 bg-white shrink-0">
            <img
              src={photoPreview ?? "/images/icons/musician_profile_window_icon.png"}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="btn-secondary text-xs text-center cursor-pointer py-1.5 px-4 inline-block">
              Choose Photo
              <input
                ref={photoRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={onPhotoChange}
              />
            </label>
            {photoPreview && (
              <button
                type="button"
                onClick={onPhotoRemove}
                className="text-xs text-sienna hover:underline font-body text-left"
              >
                Remove
              </button>
            )}
            <span className="text-xs text-gray-400 font-body">Optional. Max 5 MB.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NonProfitForm({
  name,
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  bio,
  onBioChange,
  website,
  onWebsiteChange,
  cause,
  onCauseChange,
}: {
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  bio: string;
  onBioChange: (v: string) => void;
  website: string;
  onWebsiteChange: (v: string) => void;
  cause: string;
  onCauseChange: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="np-name" className={labelClass}>Organization Name</label>
        <input
          id="np-name"
          type="text"
          placeholder="Your organization's name"
          className={inputClass}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="np-bio" className={labelClass}>
          Bio / Mission Statement{" "}
          <span className="text-gray-400 font-normal">({bio.length}/1000)</span>
        </label>
        <textarea id="np-bio" rows={5} maxLength={1000} placeholder="Describe your mission and how live music supports your cause…" className={inputClass + " resize-none"} value={bio} onChange={(e) => onBioChange(e.target.value)} />
      </div>
      <div>
        <label htmlFor="np-cause" className={labelClass}>Primary Cause</label>
        <input
          id="np-cause"
          type="text"
          placeholder="Food security, youth arts, environmental stewardship..."
          className={inputClass}
          value={cause}
          onChange={(e) => onCauseChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="np-website" className={labelClass}>Website</label>
        <input
          id="np-website"
          type="url"
          placeholder="https://yourorg.org"
          className={inputClass}
          value={website}
          onChange={(e) => onWebsiteChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="np-email" className={labelClass}>Contact Email</label>
        <input
          id="np-email"
          type="email"
          placeholder="contact@yourorg.org"
          className={inputClass}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="np-password" className={labelClass}>Password</label>
        <input
          id="np-password"
          type="password"
          placeholder="Create a password"
          className={inputClass}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
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

function CommunityForm({
  name,
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
}: {
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="c-name" className={labelClass}>Name</label>
        <input
          id="c-name"
          type="text"
          placeholder="Your full name"
          className={inputClass}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="c-email" className={labelClass}>Email</label>
        <input
          id="c-email"
          type="email"
          placeholder="you@example.com"
          className={inputClass}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="c-password" className={labelClass}>Password</label>
        <input
          id="c-password"
          type="password"
          placeholder="Create a password"
          className={inputClass}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
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
  const initialRole: Role = ["musician", "nonprofit", "community"].includes(rawRole)
    ? (rawRole as Role)
    : "community";

  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [musicianBio, setMusicianBio] = useState("");
  const [musicianGenres, setMusicianGenres] = useState<string[]>([]);
  const [musicianRate, setMusicianRate] = useState("");
  const [musicianRateType, setMusicianRateType] = useState<"hourly" | "per_event">("hourly");
  const [musicianPhoto, setMusicianPhoto] = useState<File | null>(null);
  const [musicianPhotoPreview, setMusicianPhotoPreview] = useState<string | null>(null);
  const musicianPhotoRef = useRef<HTMLInputElement>(null);
  const [nonprofitBio, setNonprofitBio] = useState("");
  const [nonprofitWebsite, setNonprofitWebsite] = useState("");
  const [nonprofitCause, setNonprofitCause] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const handleRoleChange = (r: Role) => {
    setRole(r);
    setError("");
    router.replace(`/signup?role=${r}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !displayName) {
      setError("Please fill in all required fields.");
      return;
    }
    if (role === "musician" && musicianGenres.length === 0) {
      setError("Please select at least one genre.");
      return;
    }
    setLoading(true);
    try {
      const result = await signupAndLogin({
        email,
        password,
        role,
        displayName,
        musician:
          role === "musician"
            ? {
                bio: musicianBio,
                genres: musicianGenres,
                rate: musicianRate ? Number(musicianRate) : undefined,
                rateType: musicianRateType,
              }
            : undefined,
        nonprofit:
          role === "nonprofit"
            ? {
                bio: nonprofitBio,
                website: nonprofitWebsite,
                cause: nonprofitCause,
              }
            : undefined,
      });
      if ("error" in result) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Upload musician photo after signup if one was selected
      if (role === "musician" && musicianPhoto) {
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const photoUrl = await uploadAvatar(user.id, musicianPhoto);
            await updateMusicianProfileAction({ photoUrl });
          }
        } catch {
          // Photo upload failed but account was created — continue to dashboard
        }
      }

      window.location.href = result.role === "community" ? "/home" : "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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
          {role === "musician" && (
            <MusicianForm
              name={displayName}
              onNameChange={setDisplayName}
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
              bio={musicianBio}
              onBioChange={setMusicianBio}
              genres={musicianGenres}
              onGenresChange={setMusicianGenres}
              rate={musicianRate}
              onRateChange={setMusicianRate}
              rateType={musicianRateType}
              onRateTypeChange={setMusicianRateType}
              photoPreview={musicianPhotoPreview}
              photoRef={musicianPhotoRef}
              onPhotoChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5 MB."); return; }
                setMusicianPhoto(file);
                setMusicianPhotoPreview(URL.createObjectURL(file));
              }}
              onPhotoRemove={() => { setMusicianPhoto(null); setMusicianPhotoPreview(null); if (musicianPhotoRef.current) musicianPhotoRef.current.value = ""; }}
              error={error}
            />
          )}
          {role === "nonprofit" && (
            <NonProfitForm
              name={displayName}
              onNameChange={setDisplayName}
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
              bio={nonprofitBio}
              onBioChange={setNonprofitBio}
              website={nonprofitWebsite}
              onWebsiteChange={setNonprofitWebsite}
              cause={nonprofitCause}
              onCauseChange={setNonprofitCause}
            />
          )}
          {role === "community" && (
            <CommunityForm
              name={displayName}
              onNameChange={setDisplayName}
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
            />
          )}

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

          {/* Error */}
          {error && (
            <p className="text-sm text-sienna font-body text-center">{error}</p>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary w-full text-center">
            {loading ? "Creating Account…" : "Create Account"}
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
