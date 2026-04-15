'use client'

import { useState, useCallback } from 'react'
import Cropper, { type Area } from 'react-easy-crop'

async function getCroppedBlob(
  imageSrc: string,
  crop: Area,
  outputSize = 512,
): Promise<Blob> {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = reject
    image.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  canvas.width = outputSize
  canvas.height = outputSize
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas export failed'))),
      'image/jpeg',
      0.92,
    )
  })
}

export function ImageCropper({
  imageSrc,
  onCropDone,
  onCancel,
  cropShape = 'round',
  aspect = 1,
}: {
  imageSrc: string
  onCropDone: (croppedFile: File, previewUrl: string) => void
  onCancel: () => void
  cropShape?: 'round' | 'rect'
  aspect?: number
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [saving, setSaving] = useState(false)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedArea(croppedPixels)
  }, [])

  const handleConfirm = async () => {
    if (!croppedArea) return
    setSaving(true)
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea)
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
      const previewUrl = URL.createObjectURL(blob)
      onCropDone(file, previewUrl)
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-sand-light rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gold">
        <div className="bg-parchment px-5 py-3 border-b-2 border-gold flex items-center justify-between">
          <h3 className="font-display text-lg uppercase tracking-wide text-azure">
            Crop Photo
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="relative w-full" style={{ height: 320 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-heading font-semibold text-gray-500 shrink-0">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-azure"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="btn-primary flex-1 text-center"
            >
              {saving ? 'Cropping…' : 'Use Photo'}
            </button>
            <button
              onClick={onCancel}
              disabled={saving}
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
