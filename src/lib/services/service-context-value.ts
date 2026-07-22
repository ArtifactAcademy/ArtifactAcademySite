import { createContext } from 'react'
import type { ProtectedServices } from './types'

export const ServiceContext = createContext<ProtectedServices | null>(null)
