import { createContext } from 'react'
import type { AppServices } from './types'

export const ServiceContext = createContext<AppServices | null>(null)
