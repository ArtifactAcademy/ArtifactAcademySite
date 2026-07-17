import type { ReactNode } from 'react'
import type { AppServices } from './types'
import { ServiceContext } from './service-context-value'

export function ServiceProvider({
  children,
  services,
}: {
  children: ReactNode
  services: AppServices
}) {
  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>
}
