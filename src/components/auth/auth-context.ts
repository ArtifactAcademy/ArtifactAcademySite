import { createContext } from 'react'
import type { AuthUser } from '../../lib/services/types'

export interface AuthContextValue {
  error: string | null
  loading: boolean
  user: AuthUser | null
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
