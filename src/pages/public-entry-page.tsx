import { ArrowRight, Crown } from 'lucide-react'
import { Link } from 'react-router'

interface PublicEntryPageProps {
  login?: boolean
}

export function PublicEntryPage({ login = false }: PublicEntryPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-page px-5 py-10 text-foreground">
      <div className="w-full max-w-lg rounded-card border border-border bg-card p-6 shadow-panel sm:p-8">
        <span className="grid size-10 place-items-center rounded-control bg-primary text-primary-foreground">
          <Crown aria-hidden="true" className="size-5" />
        </span>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Artifact Academy</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {login ? 'Sign in is coming next.' : 'Learn by shipping useful work.'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          {login
            ? 'Authentication is intentionally a placeholder for the first-cohort MVP. Continue to the mock learning workspace.'
            : 'AI Creator Bootcamp is an eight-session learning path built around focused lessons, practical artifacts, and direct instructor feedback.'}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="inline-flex h-10 items-center gap-2 rounded-control bg-primary px-4 text-sm font-semibold text-primary-foreground" to="/learn">
            Enter learning workspace <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          {!login && <Link className="inline-flex h-10 items-center rounded-control border border-border-strong px-4 text-sm font-semibold text-foreground hover:bg-card-secondary" to="/login">Log in</Link>}
        </div>
      </div>
    </main>
  )
}
