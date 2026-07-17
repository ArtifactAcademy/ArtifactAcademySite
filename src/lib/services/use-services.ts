import { useContext } from 'react'
import { ServiceContext } from './service-context-value'

export function useServices() {
  const services = useContext(ServiceContext)
  if (!services) throw new Error('ServiceProvider is missing')
  return services
}
