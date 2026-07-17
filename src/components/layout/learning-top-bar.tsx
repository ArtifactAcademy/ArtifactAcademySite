import { useState } from 'react'
import { ChevronDown, Crown, LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router'
import type { StudentProfile } from '../../lib/services/types'
import { ProgressBar } from '../ui/progress-bar'

interface LearningTopBarProps {
  sessionNumber: number
  profile: StudentProfile
  onOpenNavigator: () => void
  onSignOut: () => Promise<void>
}

function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'AA'
}

export function LearningTopBar({
  sessionNumber,
  profile,
  onOpenNavigator,
  onSignOut,
}: LearningTopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false)

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

        <div className="relative">
          <button
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label={`Open profile menu for ${profile.fullName}`}
            className="flex cursor-pointer items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => setProfileOpen((open) => !open)}
            type="button"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-clay text-[11px] font-semibold text-white">
              {initials(profile.fullName)}
            </span>
            <ChevronDown aria-hidden="true" className="hidden size-3 text-subtle sm:block" />
          </button>
          {profileOpen && (
            <div
              aria-label="Profile menu"
              className="absolute right-0 top-11 w-56 rounded-card border border-border bg-card p-2 shadow-panel"
              role="menu"
            >
              <div className="border-b border-border px-2 pb-2">
                <p className="truncate text-xs font-semibold">{profile.fullName}</p>
                <p className="mt-0.5 text-[10px] capitalize text-subtle">{profile.role}</p>
              </div>
              <button
                className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-control px-2 py-2 text-left text-xs font-semibold text-muted hover:bg-card-secondary hover:text-foreground"
                onClick={() => void onSignOut()}
                role="menuitem"
                type="button"
              >
                <LogOut aria-hidden="true" className="size-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
