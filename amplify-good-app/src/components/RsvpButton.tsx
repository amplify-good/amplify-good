'use client'

import { useState, useTransition } from 'react'
import { toggleRsvpAction } from '@/app/actions/rsvps'

export default function RsvpButton({
  eventId,
  initialRsvped,
  isLoggedIn,
}: {
  eventId: string
  initialRsvped: boolean
  isLoggedIn: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [rsvped, setRsvped] = useState(initialRsvped)
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
        setRsvped(res.rsvped ?? false)
      } else {
        setError(res.error ?? 'Failed to update RSVP.')
      }
    })
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={rsvped ? 'btn-secondary' : 'btn-primary'}
      >
        {isPending ? '…' : rsvped ? "You're Going! (Cancel)" : 'RSVP Now'}
      </button>
      {error && <p className="text-xs text-red-600 font-body mt-1">{error}</p>}
    </div>
  )
}
