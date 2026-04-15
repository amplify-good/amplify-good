'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateBookingStatusAction } from '@/app/actions/bookings'

export function BookingActions({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ status: string; error?: string } | null>(null)
  const router = useRouter()

  const handleAccept = () =>
    startTransition(async () => {
      const res = await updateBookingStatusAction(bookingId, 'confirmed')
      if (res.success) {
        setResult({ status: 'confirmed' })
        router.refresh()
      } else {
        setResult({ status: 'error', error: res.error })
      }
    })

  const handleDecline = () =>
    startTransition(async () => {
      const res = await updateBookingStatusAction(bookingId, 'cancelled')
      if (res.success) {
        setResult({ status: 'declined' })
        router.refresh()
      } else {
        setResult({ status: 'error', error: res.error })
      }
    })

  if (result?.status === 'confirmed') {
    return (
      <p className="text-sm font-heading font-bold text-green-700 bg-green-100 px-3 py-1 rounded-md uppercase tracking-wide inline-block mt-1">
        Accepted
      </p>
    )
  }

  if (result?.status === 'declined') {
    return (
      <p className="text-sm font-heading font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-md uppercase tracking-wide inline-block mt-1">
        Declined
      </p>
    )
  }

  return (
    <div className="space-y-2 pt-1">
      {result?.status === 'error' && (
        <p className="text-xs text-red-600 font-body">{result.error ?? 'Something went wrong.'}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleAccept}
          disabled={isPending}
          className="btn-primary text-sm py-2! px-4!"
        >
          {isPending ? '…' : 'Accept'}
        </button>
        <button
          onClick={handleDecline}
          disabled={isPending}
          className="btn-secondary text-sm py-2! px-4!"
        >
          {isPending ? '…' : 'Decline'}
        </button>
      </div>
    </div>
  )
}
