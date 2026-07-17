import type { User } from '@supabase/supabase-js'
import type { AuthService, AuthUser } from '../services/types'
import { getSupabaseClient } from './client'

function mapUser(user: User | null): AuthUser | null {
  if (!user?.email) return null
  return { id: user.id, email: user.email }
}

export function createSupabaseAuthService(): AuthService {
  const client = getSupabaseClient()

  return {
    async handleCallback() {
      const callbackUrl = new URL(window.location.href)
      const code = callbackUrl.searchParams.get('code')
      const callbackError = callbackUrl.searchParams.get('error_description')
      if (!code && !callbackError) return

      const cleanCallbackUrl = () => {
        callbackUrl.searchParams.delete('code')
        callbackUrl.searchParams.delete('error')
        callbackUrl.searchParams.delete('error_code')
        callbackUrl.searchParams.delete('error_description')
        window.history.replaceState(
          {},
          document.title,
          `${callbackUrl.pathname}${callbackUrl.search}`,
        )
      }

      if (callbackError) {
        cleanCallbackUrl()
        throw new Error(callbackError)
      }

      const { error } = await client.auth.exchangeCodeForSession(code ?? '')
      if (error) throw error

      cleanCallbackUrl()
    },

    async getCurrentUser() {
      const { data, error } = await client.auth.getUser()
      if (error) {
        if (error.name === 'AuthSessionMissingError') return null
        throw error
      }
      return mapUser(data.user)
    },

    onAuthStateChange(listener) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        listener(mapUser(session?.user ?? null))
      })
      return () => data.subscription.unsubscribe()
    },

    async sendMagicLink(email, redirectTo) {
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      })
      if (error) throw error
    },

    async signOut() {
      const { error } = await client.auth.signOut()
      if (error) throw error
    },
  }
}
