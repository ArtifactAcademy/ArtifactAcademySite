import { Clock3, Crown, LogOut } from 'lucide-react'
import { Button } from '../components/ui/button'

export function AccessPendingPage({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <main className="grid min-h-screen place-items-center bg-page px-5 py-10 text-foreground">
      <div className="w-full max-w-lg rounded-card border border-border bg-card p-6 shadow-panel sm:p-8">
        <span className="grid size-10 place-items-center rounded-control bg-primary text-primary-foreground">
          <Crown aria-hidden="true" className="size-5" />
        </span>
        <div className="mt-6 flex items-center gap-2 text-clay">
          <Clock3 aria-hidden="true" className="size-4" />
          <p className="font-mono text-[10px] uppercase tracking-[0.12em]">Access pending</p>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your account is ready.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Your cohort enrollment has not been activated yet. Once the instructor adds your enrollment,
          sign in again to open AI Creator Bootcamp.
        </p>
        <Button className="mt-7" onClick={() => void onSignOut()} variant="secondary">
          <LogOut aria-hidden="true" className="size-4" />
          Sign out
        </Button>
      </div>
    </main>
  )
}
