'use client'

import { useState, useTransition } from 'react'
import { toggleRsvpAction } from '@/app/actions/rsvps'

export default function RsvpButton({
  eventId,
  initialRsvped,
  initialRsvpCount,
  isLoggedIn,
}: {
  eventId: string
  initialRsvped: boolean
  initialRsvpCount: number
  isLoggedIn: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [rsvped, setRsvped] = useState(initialRsvped)
  const [rsvpCount, setRsvpCount] = useState(initialRsvpCount)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    if (!isLoggedIn) {
      setError('Please log in to RSVP.')
      return
    }
    setError(null)
    startTransition(async () => {
      const res = await toggleRsvpAction(eventId)
      if (res.success) {
        const nowRsvped = res.rsvped ?? false
        setRsvped(nowRsvped)
        setRsvpCount((c) => c + (nowRsvped ? 1 : -1))
      } else {
        setError(res.error ?? 'Failed to update RSVP.')
      }
    })
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={rsvped ? 'btn-secondary' : 'btn-primary'}
      >
        {isPending ? '…' : rsvped ? "You're Going! (Cancel)" : 'RSVP Now'}
      </button>
      <span className="text-sm font-body text-gray-500">
        <span className="font-semibold text-gray-800">{rsvpCount}</span> RSVPs
      </span>
      {error && <p className="text-xs text-red-600 font-body mt-1">{error}</p>}
    </div>
  )
}
