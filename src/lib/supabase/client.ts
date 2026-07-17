import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined

export function getSupabaseClient() {
  if (client) return client

  const url: unknown = import.meta.env.VITE_SUPABASE_URL
  const publishableKey: unknown = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (typeof url !== 'string' || !url || typeof publishableKey !== 'string' || !publishableKey) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }

  client = createClient(url, publishableKey, {
    auth: {
      detectSessionInUrl: false,
      flowType: 'pkce',
      persistSession: true,
    },
  })

  return client
}
