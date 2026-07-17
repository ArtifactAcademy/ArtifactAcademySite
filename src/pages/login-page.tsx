import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Crown, Mail } from 'lucide-react'
import { Navigate } from 'react-router'
import { useAuth } from '../components/auth/use-auth'
import { Button } from '../components/ui/button'
import { useServices } from '../lib/services/use-services'

export function LoginPage() {
  const { auth } = useServices()
  const { error: authError, loading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) return <AuthenticationLoading />
  if (user) return <Navigate replace to="/learn" />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await auth.sendMagicLink(email, `${window.location.origin}/login`)
      setSent(true)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send the sign-in link.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-page px-5 py-10 text-foreground">
      <div className="w-full max-w-md rounded-card border border-border bg-card p-6 shadow-panel sm:p-8">
        <span className="grid size-10 place-items-center rounded-control bg-primary text-primary-foreground">
          <Crown aria-hidden="true" className="size-5" />
        </span>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Artifact Academy</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in to keep learning.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Enter your cohort email. We’ll send a secure sign-in link—no password required.
        </p>

        {sent ? (
          <div aria-live="polite" className="mt-7 rounded-card border border-success/30 bg-success-soft p-4">
            <span className="grid size-9 place-items-center rounded-full bg-success text-white">
              <Check aria-hidden="true" className="size-4" />
            </span>
            <h2 className="mt-3 text-sm font-semibold">Check your inbox</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              We sent a sign-in link to <strong className="text-foreground">{email}</strong>.
            </p>
            <button
              className="mt-3 cursor-pointer text-xs font-semibold text-foreground underline underline-offset-4"
              onClick={() => setSent(false)}
              type="button"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <div>
              <label className="text-xs font-semibold" htmlFor="email">Email address</label>
              <div className="relative mt-2">
                <Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-3 size-4 text-subtle" />
                <input
                  autoComplete="email"
                  className="h-10 w-full rounded-control border border-border-strong bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-subtle"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>
            {(error || authError) && (
              <p aria-live="polite" className="text-xs leading-5 text-clay">{error ?? authError}</p>
            )}
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? 'Sending…' : 'Email me a sign-in link'}
              {!submitting && <ArrowRight aria-hidden="true" className="size-4" />}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}

export function AuthenticationLoading() {
  return (
    <main
      aria-busy="true"
      className="grid min-h-screen place-items-center bg-page px-5 text-foreground"
    >
      <div className="text-center">
        <span className="mx-auto grid size-10 animate-pulse place-items-center rounded-control bg-primary text-primary-foreground motion-reduce:animate-none">
          <Crown aria-hidden="true" className="size-5" />
        </span>
        <p className="mt-4 text-sm font-medium">Restoring your learning workspace…</p>
      </div>
    </main>
  )
}
