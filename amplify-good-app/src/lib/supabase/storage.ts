import { createClient } from './client'

const BUCKET = 'avatars'

/**
 * Upload an image to the avatars bucket under the user's folder.
 * Path: {userId}/{timestamp}.{ext}
 * Returns the public URL on success, or throws on failure.
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: true })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Delete a previously uploaded avatar by its full public URL.
 */
export async function deleteAvatar(publicUrl: string): Promise<void> {
  const supabase = createClient()
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return

  const path = publicUrl.slice(idx + marker.length)
  await supabase.storage.from(BUCKET).remove([path])
}
