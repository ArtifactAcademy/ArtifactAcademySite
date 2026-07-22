import { useContext } from 'react'
import { WaitlistContext } from './waitlist-context-value'

export function useWaitlistService() {
  const service = useContext(WaitlistContext)
  if (!service) throw new Error('WaitlistProvider is missing')
  return service
}
