import { type ReactNode } from 'react'
import type { WaitlistService } from './types'
import { WaitlistContext } from './waitlist-context-value'

export function WaitlistProvider({
  children,
  service,
}: {
  children: ReactNode
  service: WaitlistService
}) {
  return <WaitlistContext.Provider value={service}>{children}</WaitlistContext.Provider>
}
