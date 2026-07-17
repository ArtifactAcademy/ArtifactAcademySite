import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AuthUser } from '../../lib/services/types'
import { useServices } from '../../lib/services/use-services'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth } = useServices()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const unsubscribe = auth.onAuthStateChange((nextUser) => {
      if (!active) return
      setUser(nextUser)
      setLoading(false)
    })

    async function initialize() {
      try {
        await auth.handleCallback()
        const nextUser = await auth.getCurrentUser()
        if (active) setUser(nextUser)
      } catch (caught) {
        if (active) {
          setError(caught instanceof Error ? caught.message : 'Unable to restore your session.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void initialize()
    return () => {
      active = false
      unsubscribe()
    }
  }, [auth])

  const value = useMemo<AuthContextValue>(() => ({
    error,
    loading,
    user,
    async signOut() {
      await auth.signOut()
    },
  }), [auth, error, loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
