import { createClient } from '@/lib/supabase/server'
import type { DbImpactTransaction, ImpactPoolSummary } from './types'

export async function getImpactPoolSummary(): Promise<ImpactPoolSummary> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('impact_pool_summary')
    .select('*')
    .single()

  if (error || !data) {
    // Return zeros if view is empty or not yet seeded
    return { balance: 0, totalInflows: 0, totalOutflows: 0 }
  }

  return {
    balance: Number(data.balance ?? 0),
    totalInflows: Number(data.total_inflows ?? 0),
    totalOutflows: Number(data.total_outflows ?? 0),
  }
}

export async function getImpactTransactions(limit = 20): Promise<DbImpactTransaction[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('impact_pool_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch impact transactions: ${error.message}`)
  return data ?? []
}
