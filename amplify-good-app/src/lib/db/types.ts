// Database row types — snake_case matching Supabase column names

export type DbMusician = {
  id: string
  user_id: string | null
  name: string
  bio: string | null
  genres: string[]
  photo_url: string | null
  rate: number
  rate_type: 'per_event' | 'hourly'
  available: boolean
  created_at: string
  updated_at: string
}

export type DbMusicianMediaLink = {
  id: string
  musician_id: string
  type: 'spotify' | 'youtube' | 'soundcloud'
  url: string
  label: string
  sort_order: number
}

export type DbMusicianSocialLink = {
  id: string
  musician_id: string
  platform: string
  url: string
  sort_order: number
}

export type DbMusicianWithLinks = DbMusician & {
  musician_media_links: DbMusicianMediaLink[]
  musician_social_links: DbMusicianSocialLink[]
}

export type DbNonprofit = {
  id: string
  user_id: string | null
  name: string
  bio: string | null
  website: string | null
  logo_url: string | null
  contact_email: string | null
  cause: string | null
  created_at: string
  updated_at: string
}

export type DbEvent = {
  id: string
  nonprofit_id: string
  musician_id: string | null
  name: string
  date_time: string
  venue: string
  vibe: string | null
  expected_attendance: number | null
  genre_pref: string | null
  description: string | null
  short_description: string | null
  cause: string | null
  status: 'upcoming' | 'completed' | 'draft'
  rsvp_count: number
  created_at: string
  updated_at: string
}

export type DbEventWithRelations = DbEvent & {
  nonprofits: DbNonprofit | null
  musicians: DbMusician | null
}

export type DbBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type DbBooking = {
  id: string
  musician_id: string
  community_member_id: string
  event_name: string
  event_date: string
  location: string | null
  duration: string | null
  musician_rate: number
  commission_amount: number
  total_charged: number
  status: DbBookingStatus
  message: string | null
  created_at: string
  updated_at: string
}

export type DbBookingWithMusician = DbBooking & {
  musicians: DbMusician | null
}

export type DbRsvp = {
  id: string
  event_id: string
  user_id: string
  created_at: string
}

export type DbImpactTransaction = {
  id: string
  booking_id: string | null
  amount: number
  type: 'inflow' | 'outflow'
  description: string | null
  created_at: string
}

export type ImpactPoolSummary = {
  balance: number
  totalInflows: number
  totalOutflows: number
}

export type CreateMusicianData = {
  userId: string
  name: string
  bio?: string
  genres: string[]
  photoUrl?: string
  rate: number
  rateType: 'per_event' | 'hourly'
}

export type UpdateMusicianData = {
  name?: string
  bio?: string | null
  genres?: string[]
  photoUrl?: string | null
  rate?: number
  rateType?: 'per_event' | 'hourly'
  available?: boolean
}

export type CreateNonprofitData = {
  userId: string
  name: string
  bio?: string
  website?: string
  logoUrl?: string
  contactEmail?: string
  cause?: string
}

export type CreateEventData = {
  nonprofitId: string
  name: string
  dateTime: string
  venue: string
  vibe?: string
  expectedAttendance?: number
  genrePref?: string
  description?: string
  shortDescription?: string
  cause?: string
}

export type CreateBookingData = {
  musicianId: string
  communityMemberId: string
  eventName: string
  eventDate: string
  location?: string
  duration?: string
  musicianRate: number
  commissionAmount: number
  totalCharged: number
  message?: string
}
