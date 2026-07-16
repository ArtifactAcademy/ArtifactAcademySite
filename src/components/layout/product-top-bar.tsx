import { useEffect, useRef, useState } from 'react'
import { Popover } from '@base-ui/react/popover'
import { Bell, CheckCircle2, Crown, Moon, Search, Sun } from 'lucide-react'
import { NavLink } from 'react-router'
import { Button } from '../ui/button'

type Theme = 'dark' | 'light'

export function ProductTopBar() {
  const desktopSearchRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('artifact-theme') === 'light' ? 'light' : 'dark'))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('artifact-theme', theme)
  }, [theme])

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        const target = window.matchMedia('(min-width: 640px)').matches ? desktopSearchRef : mobileSearchRef
        target.current?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <NavLink to="/dashboard" className="mr-auto flex items-center gap-2 lg:hidden" aria-label="Artifact Academy dashboard">
          <span className="grid size-8 place-items-center rounded-control bg-primary text-primary-foreground"><Crown aria-hidden="true" className="size-4" /></span>
          <span className="hidden text-sm font-semibold sm:block">Artifact Academy</span>
        </NavLink>

        <label className="relative hidden flex-1 sm:block sm:max-w-sm lg:max-w-md">
          <span className="sr-only">Search lessons and artifacts</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            ref={desktopSearchRef}
            id="academy-search"
            type="search"
            placeholder="Search lessons, artifacts…"
            className="h-9 w-full rounded-control border border-border-strong bg-card pl-9 pr-12 text-sm text-foreground placeholder:text-subtle"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 font-mono text-[9px] text-subtle">⌘K</kbd>
        </label>

        <Button
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
          size="icon"
          variant="ghost"
        >
          {theme === 'dark' ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
        </Button>

        <Popover.Root>
          <Popover.Trigger className="relative grid size-9 cursor-pointer place-items-center rounded-control border border-transparent text-muted transition-colors hover:bg-card-secondary hover:text-foreground" aria-label="Open notifications">
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-clay" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner align="end" sideOffset={8} className="z-50 outline-none">
              <Popover.Popup className="w-72 rounded-card border border-border bg-card p-4 text-foreground shadow-floating outline-none">
                <Popover.Title className="text-sm font-semibold">Notifications</Popover.Title>
                <Popover.Description className="mt-1 text-xs text-muted">Updates from your course and instructors.</Popover.Description>
                <div className="mt-4 flex gap-3 rounded-control bg-success-soft p-3">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  <div>
                    <p className="text-xs font-medium">Artifact published</p>
                    <p className="mt-1 text-[11px] leading-4 text-muted">Portfolio landing page is now live.</p>
                  </div>
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <button aria-label="Open profile menu" className="grid size-8 cursor-pointer place-items-center rounded-full bg-clay text-[11px] font-semibold text-white">JD</button>
      </div>
      <div className="px-4 pb-3 sm:hidden">
        <label className="relative block">
          <span className="sr-only">Search lessons and artifacts</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input ref={mobileSearchRef} type="search" placeholder="Search lessons, artifacts…" className="h-10 w-full rounded-control border border-border-strong bg-card pl-9 pr-3 text-sm" />
        </label>
      </div>
    </header>
  )
}
