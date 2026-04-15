'use client'

import { useState } from 'react'
import { assignMusicianAction } from '@/app/actions/events'
import { useTransition } from 'react'

export function AssignMusicianButton({
  eventId,
  musicianId,
}: {
  eventId: string
  musicianId: string
}) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  const handleClick = () =>
    startTransition(async () => {
      const res = await assignMusicianAction(eventId, musicianId)
      setResult(res)
    })

  if (result?.success) {
    return (
      <p className="text-sm font-heading font-bold text-green-700 bg-green-100 px-3 py-1 rounded-md uppercase tracking-wide text-center mt-2">
        Confirmed!
      </p>
    )
  }

  return (
    <div className="mt-2">
      {result && !result.success && (
        <p className="text-xs text-red-600 font-body mb-1">{result.error ?? 'Failed to assign.'}</p>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="btn-primary text-sm py-2! px-4! w-full"
      >
        {isPending ? 'Confirming…' : 'Confirm'}
      </button>
    </div>
  )
}
