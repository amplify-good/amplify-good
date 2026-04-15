'use client'

import { useState } from 'react'
import Link from 'next/link'
import GenreTags from '@/components/GenreTags'
import { createEventAction, assignMusicianAction } from '@/app/actions/events'
import type { DbMusician } from '@/lib/db/types'

const CAUSES = ['Youth', 'Environment', 'Healthcare', 'Animal Rescue', 'Arts & Culture']

const ALL_GENRES = [
  'Rock', 'Jazz', 'Country', 'Hip-Hop', 'R&B', 'Mariachi',
  'Classical', 'Electronic', 'Folk', 'Latin', 'Blues',
]

function SuggestedMusicianCard({
  musician,
  eventId,
}: {
  musician: DbMusician
  eventId: string
}) {
  const [confirmed, setConfirmed] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)

  async function handleConfirm() {
    setIsPending(true)
    setAssignError(null)
    const result = await assignMusicianAction(eventId, musician.id)
    setIsPending(false)
    if (result.success) {
      setConfirmed(true)
    } else {
      setAssignError(result.error ?? 'Failed to assign musician.')
    }
  }

  return (
    <div className="card flex flex-col items-center text-center gap-3 px-5 pb-5 pt-5">
      {/* Photo */}
      <div className="w-20 h-20 shrink-0">
        <img
          src={musician.photo_url ?? '/images/icons/musician_profile_window_icon.png'}
          alt={musician.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Name — fixed height for alignment */}
      <h4 className="font-heading text-base font-bold text-azure leading-tight min-h-10 flex items-center">
        {musician.name}
      </h4>

      {/* Genres */}
      <GenreTags genres={musician.genres} className="justify-center min-h-8" />

      {/* Rate */}
      <div className="flex items-baseline gap-1">
        <span className="impact-number text-xl">${musician.rate}</span>
        <span className="font-body text-xs text-gray-500">
          /{musician.rate_type === 'per_event' ? 'event' : 'hr'}
        </span>
      </div>

      {/* Spacer to push button to bottom */}
      <div className="flex-1" />

      {/* Confirm button */}
      {confirmed ? (
        <div className="font-heading text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-md uppercase tracking-wide">
          Confirmed!
        </div>
      ) : (
        <>
          {assignError && (
            <p className="text-xs text-red-600 font-body">{assignError}</p>
          )}
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="btn-primary py-2! px-5! text-sm w-full"
          >
            {isPending ? 'Confirming…' : 'Confirm'}
          </button>
        </>
      )}
    </div>
  )
}

export default function NewEventForm({ musicians }: { musicians: DbMusician[] }) {
  const [form, setForm] = useState({
    eventName: '',
    dateTime: '',
    venue: '',
    vibe: '',
    attendance: '',
    genre: '',
    description: '',
    cause: '',
    shortDescription: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [createdEventId, setCreatedEventId] = useState<string | null>(null)
  const [suggestedMusicians, setSuggestedMusicians] = useState<DbMusician[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customCause, setCustomCause] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await createEventAction({
      name: form.eventName,
      dateTime: form.dateTime,
      venue: form.venue,
      vibe: form.vibe || undefined,
      expectedAttendance: form.attendance ? Number(form.attendance) : undefined,
      genrePref: form.genre || undefined,
      description: form.description || undefined,
      shortDescription: form.shortDescription || undefined,
      cause: form.cause || undefined,
    })

    setIsLoading(false)

    if (!result.success) {
      setError(result.error ?? 'Failed to create event.')
      return
    }

    // Find suggested musicians matching the selected genre
    const matched = musicians.filter((m) => m.genres.includes(form.genre)).slice(0, 3)
    if (matched.length < 3) {
      const additional = musicians
        .filter((m) => !matched.includes(m))
        .slice(0, 3 - matched.length)
      matched.push(...additional)
    }

    setCreatedEventId(result.eventId ?? null)
    setSuggestedMusicians(matched)
    setSubmitted(true)
  }

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
      {submitted ? (
        /* ── Success Panel + Suggested Musicians ── */
        <div className="flex flex-col gap-8">
          {/* Success banner */}
          <div className="card text-center py-10 px-8">
            <img
              src="/images/icons/music_notes_icon.png"
              alt="Success"
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
            <h2 className="font-display text-3xl uppercase text-azure mb-2">
              Event Created!
            </h2>
            <p className="font-body text-gray-600 text-lg">
              <span className="font-semibold text-sienna">{form.eventName}</span> is now
              live on Amplify the Good.
            </p>
            <p className="font-body text-sm text-gray-400 mt-2">
              We&apos;ll suggest musicians for your event based on your genre and vibe
              preferences.
            </p>

            {/* Event recap chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {form.genre && <span className="genre-pill">{form.genre}</span>}
              {form.cause && (
                <span className="genre-pill bg-sienna/10! text-sienna!">{form.cause}</span>
              )}
              {form.attendance && (
                <span className="genre-pill bg-turquoise/10! text-turquoise!">
                  {form.attendance} expected guests
                </span>
              )}
            </div>
          </div>

          {/* Suggested Musicians */}
          <div>
            <h3 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-4">
              Suggested Musicians
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {suggestedMusicians.map((musician) => (
                <SuggestedMusicianCard
                  key={musician.id}
                  musician={musician}
                  eventId={createdEventId ?? ''}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/events" className="btn-primary inline-block text-center">
              View All Events
            </Link>
            <button
              onClick={() => {
                setSubmitted(false)
                setSuggestedMusicians([])
                setCreatedEventId(null)
                setCustomCause(false)
                setForm({
                  eventName: '',
                  dateTime: '',
                  venue: '',
                  vibe: '',
                  attendance: '',
                  genre: '',
                  description: '',
                  cause: '',
                  shortDescription: '',
                })
              }}
              className="btn-secondary inline-block text-center"
            >
              Create Another Event
            </button>
          </div>
        </div>
      ) : (
        /* ── Event Creation Form ── */
        <div className="card">
          <h2 className="font-heading text-xl font-bold text-azure uppercase tracking-wide mb-6">
            Event Details
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-body">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Event Name */}
            <div>
              <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                Event Name <span className="text-sienna">*</span>
              </label>
              <input
                type="text"
                name="eventName"
                required
                value={form.eventName}
                onChange={handleChange}
                placeholder="e.g., Annual Community Gala"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                Date &amp; Time <span className="text-sienna">*</span>
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                required
                value={form.dateTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                Venue / Location <span className="text-sienna">*</span>
              </label>
              <input
                type="text"
                name="venue"
                required
                value={form.venue}
                onChange={handleChange}
                placeholder="e.g., Republic Square Park, Austin TX"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
              />
            </div>

            {/* Vibe / Theme */}
            <div>
              <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                Vibe / Theme{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="vibe"
                value={form.vibe}
                onChange={handleChange}
                placeholder="e.g., casual outdoor BBQ, formal gala"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
              />
            </div>

            {/* Two-column: Attendance + Genre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Expected Attendance */}
              <div>
                <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                  Expected Attendance <span className="text-sienna">*</span>
                </label>
                <input
                  type="number"
                  name="attendance"
                  required
                  min={1}
                  value={form.attendance}
                  onChange={handleChange}
                  placeholder="e.g., 200"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                  Genre of Music <span className="text-sienna">*</span>
                </label>
                <select
                  name="genre"
                  required
                  value={form.genre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure bg-white"
                >
                  <option value="" disabled>
                    Select a genre
                  </option>
                  {ALL_GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cause */}
            <div>
              <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                Cause / Category <span className="text-sienna">*</span>
              </label>
              <select
                value={customCause ? '__custom__' : form.cause}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomCause(true)
                    setForm((prev) => ({ ...prev, cause: '' }))
                  } else {
                    setCustomCause(false)
                    setForm((prev) => ({ ...prev, cause: e.target.value }))
                  }
                }}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure bg-white"
              >
                <option value="" disabled>
                  Select a cause
                </option>
                {CAUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="__custom__">Other (type your own)</option>
              </select>
              {customCause && (
                <input
                  type="text"
                  name="cause"
                  required
                  value={form.cause}
                  onChange={handleChange}
                  placeholder="e.g., Housing, Education, Mental Health"
                  autoFocus
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure mt-2"
                />
              )}
            </div>

            {/* Short Description / Card Summary */}
            <div>
              <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                Card Summary{' '}
                <span className="text-gray-400 font-normal">(optional, max 150 chars)</span>
              </label>
              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                maxLength={150}
                placeholder="e.g., Supporting Austin Food Bank's fight against hunger."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure"
              />
              <p className="text-xs text-gray-400 font-body mt-1">
                Shown on the event card below the title.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block font-heading font-semibold text-sm text-gray-700 mb-1">
                Description{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell musicians and potential sponsors more about your event, its mission, and what makes it special..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure resize-none"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-2" />

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-center text-lg"
            >
              {isLoading ? 'Creating…' : 'Create Event'}
            </button>
          </form>
        </div>
      )}
    </main>
  )
}
