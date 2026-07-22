import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router'
import type { ProtectedServices } from '../../lib/services/types'
import { ServiceProvider } from '../../lib/services/service-context'
import { AuthProvider } from './auth-provider'
import { AuthenticationLoading } from '../../pages/login-page'

export function ProtectedServiceBoundary({
  loadServices,
}: {
  loadServices: () => Promise<ProtectedServices>
}) {
  const [services, setServices] = useState<ProtectedServices | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void loadServices()
      .then((nextServices) => {
        if (active) setServices(nextServices)
      })
      .catch(() => {
        if (active) setError('Student access is temporarily unavailable. Please try again later.')
      })

    return () => {
      active = false
    }
  }, [loadServices])

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-page px-5 text-foreground">
        <div className="w-full max-w-md rounded-card border border-border bg-card p-6 text-center">
          <h1 className="text-xl font-semibold">We couldn’t open student access.</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{error}</p>
          <Link className="mt-5 inline-block text-sm font-semibold underline underline-offset-4" to="/">
            Return to Artifact Academy
          </Link>
        </div>
      </main>
    )
  }

  if (!services) return <AuthenticationLoading />

  return (
    <ServiceProvider services={services}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ServiceProvider>
  )
}
