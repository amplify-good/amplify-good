-- Create the avatars bucket (public, 5MB limit, images only)
-- NOTE: bucket creation is done via the Storage API, not SQL.
-- Run this once manually or via seed script:
--   POST /storage/v1/bucket { id: "avatars", name: "avatars", public: true,
--     file_size_limit: 5242880, allowed_mime_types: ["image/jpeg","image/png","image/webp","image/gif"] }

-- Storage RLS policies (applied to storage.objects)

-- Anyone can view avatars (public bucket)
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Authenticated users upload to their own folder: {userId}/filename
create policy "avatars_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can overwrite their own files
create policy "avatars_auth_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own files
create policy "avatars_auth_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
