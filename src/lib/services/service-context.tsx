import type { ReactNode } from 'react'
import type { ProtectedServices } from './types'
import { ServiceContext } from './service-context-value'

export function ServiceProvider({
  children,
  services,
}: {
  children: ReactNode
  services: ProtectedServices
}) {
  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>
}
