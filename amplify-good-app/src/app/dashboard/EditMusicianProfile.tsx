'use client'

import { useState, useTransition, useRef } from 'react'
import { updateMusicianProfileAction } from '@/app/actions/profiles'
import { createClient } from '@/lib/supabase/client'
import { uploadAvatar } from '@/lib/supabase/storage'
import type { DbMusician } from '@/lib/db/types'

const GENRES = [
  'Rock', 'Jazz', 'Country', 'Hip-Hop', 'R&B',
  'Mariachi', 'Classical', 'Electronic', 'Folk', 'Latin', 'Blues',
]

export function EditMusicianProfile({
  musician,
  userId,
  onClose,
  onSaved,
}: {
  musician: DbMusician
  userId: string
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(musician.name)
  const [bio, setBio] = useState(musician.bio ?? '')
  const [genres, setGenres] = useState<string[]>(musician.genres)
  const [rate, setRate] = useState(String(musician.rate))
  const [rateType, setRateType] = useState<'per_event' | 'hourly'>(musician.rate_type)
  const [available, setAvailable] = useState(musician.available)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(musician.photo_url)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleGenre = (g: string) => {
    setGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.')
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSave = () => {
    setError('')
    if (!name.trim()) { setError('Name is required.'); return }
    if (genres.length === 0) { setError('Select at least one genre.'); return }

    const rateNum = Number(rate)
    if (isNaN(rateNum) || rateNum < 0) { setError('Rate must be a valid number.'); return }

    startTransition(async () => {
      let newPhotoUrl: string | null | undefined = undefined

      // Upload new photo if selected
      if (photoFile) {
        try {
          newPhotoUrl = await uploadAvatar(userId, photoFile)
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Photo upload failed.')
          return
        }
      } else if (photoPreview === null && musician.photo_url) {
        // User explicitly removed their photo
        newPhotoUrl = null
      }

      const result = await updateMusicianProfileAction({
        name: name.trim(),
        bio: bio.trim() || null,
        genres,
        photoUrl: newPhotoUrl,
        rate: rateNum,
        rateType,
        available,
      })

      if (!result.success) {
        setError(result.error ?? 'Update failed.')
        return
      }

      if (name.trim() !== musician.name) {
        const supabase = createClient()
        await supabase.auth.updateUser({ data: { display_name: name.trim() } })
      }

      onSaved()
    })
  }

  const inputClass =
    'w-full border border-gray-300 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition'
  const labelClass = 'block font-heading font-semibold text-sm text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-sand-light rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gold">
        <div className="bg-parchment px-6 py-4 border-b-2 border-gold flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase tracking-wide text-azure">
            Edit Profile
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Profile Photo */}
          <div>
            <span className={labelClass}>Profile Photo</span>
            <div className="flex items-center gap-4 mt-1">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold bg-white shrink-0">
                <img
                  src={photoPreview ?? '/images/icons/musician_profile_window_icon.png'}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="btn-secondary text-xs text-center cursor-pointer py-1.5 px-4">
                  Choose Photo
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs text-sienna hover:underline font-body"
                  >
                    Remove photo
                  </button>
                )}
                <span className="text-xs text-gray-400 font-body">JPG, PNG, WebP or GIF. Max 5 MB.</span>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="edit-name" className={labelClass}>Stage / Band Name</label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="edit-bio" className={labelClass}>Bio</label>
            <textarea
              id="edit-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={inputClass}
              placeholder="Tell people about your music..."
            />
          </div>

          {/* Genres */}
          <div>
            <span className={labelClass}>Genres</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-1 rounded-md text-sm font-heading font-semibold border cursor-pointer transition-colors ${
                    genres.includes(g)
                      ? 'bg-azure text-white border-azure'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-rate" className={labelClass}>Rate ($)</label>
              <input
                id="edit-rate"
                type="number"
                min="0"
                step="5"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="edit-rate-type" className={labelClass}>Rate Type</label>
              <select
                id="edit-rate-type"
                value={rateType}
                onChange={(e) => setRateType(e.target.value as 'per_event' | 'hourly')}
                className={inputClass}
              >
                <option value="hourly">Per Hour</option>
                <option value="per_event">Per Event</option>
              </select>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={available}
              onClick={() => setAvailable(!available)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                available ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  available ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="font-heading font-semibold text-sm text-gray-700">
              {available ? 'Available for Bookings' : 'Currently Unavailable'}
            </span>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-sienna font-body">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="btn-primary flex-1 text-center"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              disabled={isPending}
              className="btn-secondary flex-1 text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
