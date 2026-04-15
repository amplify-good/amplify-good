import { createClient } from '@/lib/supabase/server'
import type { DbNonprofit, CreateNonprofitData } from './types'

export async function getNonprofits(): Promise<DbNonprofit[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nonprofits')
    .select('*')
    .not('name', 'ilike', 'UI Test%')
    .order('name')

  if (error) throw new Error(`Failed to fetch nonprofits: ${error.message}`)
  return data ?? []
}

export async function getNonprofitById(id: string): Promise<DbNonprofit | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nonprofits')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export async function getNonprofitByUserId(userId: string): Promise<DbNonprofit | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nonprofits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data
}

export async function createNonprofit(data: CreateNonprofitData): Promise<DbNonprofit> {
  const supabase = await createClient()
  const { data: created, error } = await supabase
    .from('nonprofits')
    .insert({
      user_id: data.userId,
      name: data.name,
      bio: data.bio ?? null,
      website: data.website ?? null,
      logo_url: data.logoUrl ?? null,
      contact_email: data.contactEmail ?? null,
      cause: data.cause ?? null,
    })
    .select()
    .single()

  if (error || !created) throw new Error(`Failed to create nonprofit: ${error?.message}`)
  return created
}
