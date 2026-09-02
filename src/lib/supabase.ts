import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function saveTestResult(payload: {
  testSlug: string
  resultId: string
  score: number
}) {
  if (!supabase) return

  await supabase.from('test_results').insert({
    test_slug: payload.testSlug,
    result_id: payload.resultId,
    score: payload.score,
  })
}
