import { createContext } from 'react'
import type { WaitlistService } from './types'

export const WaitlistContext = createContext<WaitlistService | null>(null)
