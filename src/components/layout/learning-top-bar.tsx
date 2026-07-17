import { Crown, Menu } from 'lucide-react'
import { Link } from 'react-router'
import { ProgressBar } from '../ui/progress-bar'

interface LearningTopBarProps {
  sessionNumber: number
  onOpenNavigator: () => void
}

export function LearningTopBar({ sessionNumber, onOpenNavigator }: LearningTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-5">
        <button
          aria-label="Open lesson outline"
          className="grid size-9 cursor-pointer place-items-center rounded-control border border-border bg-card text-muted transition-colors hover:bg-card-secondary hover:text-foreground lg:hidden"
          onClick={onOpenNavigator}
          type="button"
        >
          <Menu aria-hidden="true" className="size-4" />
        </button>

        <Link className="flex min-w-0 items-center gap-2.5" to="/learn">
          <span className="grid size-8 shrink-0 place-items-center rounded-control bg-primary text-primary-foreground">
            <Crown aria-hidden="true" className="size-4" />
          </span>
          <span className="truncate text-xs font-semibold tracking-tight sm:text-sm">Artifact Academy</span>
        </Link>

        <div className="ml-auto flex items-center sm:w-48 sm:gap-3 sm:rounded-full sm:border sm:border-border sm:bg-card sm:px-3 sm:py-2">
          <span className="shrink-0 text-[11px] font-medium text-muted sm:text-xs">Session {sessionNumber} of 8</span>
          <ProgressBar
            className="hidden min-w-0 sm:block"
            label={`Session ${sessionNumber} of 8`}
            value={(sessionNumber / 8) * 100}
          />
        </div>

        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-clay text-[11px] font-semibold text-white" aria-label="Profile placeholder for Jordan Diaz">
          JD
        </span>
      </div>
    </header>
  )
}
