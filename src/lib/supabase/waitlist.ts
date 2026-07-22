import type { WaitlistService } from '../services/types'

function requirePublicSupabaseConfig() {
  const url: unknown = import.meta.env.VITE_SUPABASE_URL
  const publishableKey: unknown = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (typeof url !== 'string' || !url || typeof publishableKey !== 'string' || !publishableKey) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }

  return { publishableKey, url }
}

export function createSupabaseWaitlistService(): WaitlistService {
  return {
    async join(signup) {
      const { publishableKey, url } = requirePublicSupabaseConfig()
      const response = await fetch(`${url}/functions/v1/join-waitlist`, {
        method: 'POST',
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${publishableKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signup),
      })

      if (!response.ok) {
        throw new Error('Waitlist signup is temporarily unavailable.')
      }
    },
  }
}
