import { Award, BookOpen, Boxes, Crown, LayoutDashboard, Library, UsersRound } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '../../lib/cn'
import { ProgressBar } from '../ui/progress-bar'

const groups = [
  {
    label: 'Learn',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/courses', label: 'My courses', icon: BookOpen },
      { to: '/artifacts', label: 'Artifacts', icon: Boxes },
      { to: '/portfolio', label: 'Portfolio', icon: Library },
    ],
  },
  {
    label: 'Progress',
    items: [
      { to: '/certificate', label: 'Certificate', icon: Award },
      { to: '/community', label: 'Community', icon: UsersRound },
    ],
  },
]

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-62 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <NavLink to="/dashboard" className="flex items-center gap-2.5 px-4 py-4" aria-label="Artifact Academy dashboard">
        <span className="grid size-8 place-items-center rounded-control bg-primary text-primary-foreground"><Crown aria-hidden="true" className="size-4" /></span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold">Artifact Academy</span>
          <span className="block font-mono text-[10px] text-subtle">Learning OS</span>
        </span>
      </NavLink>

      <nav aria-label="Primary navigation" className="flex-1 px-3 py-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-2.5 pb-1 pt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-subtle">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => cn(
                      'flex items-center gap-2.5 rounded-control border border-transparent px-2.5 py-2 text-[13px] text-muted transition-colors hover:bg-card-secondary hover:text-foreground',
                      isActive && 'border-border bg-elevated font-medium text-foreground',
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3">
        <div className="rounded-card border border-border bg-background p-3">
          <ProgressBar label="AI Creator Bootcamp progress" showValue value={62} />
        </div>
        <NavLink to="/components" className="mt-2 flex items-center gap-2 rounded-control px-2.5 py-2 text-xs text-subtle transition-colors hover:bg-card-secondary hover:text-foreground">
          <Boxes aria-hidden="true" className="size-4" />
          Component gallery
        </NavLink>
        <div className="mt-2 flex items-center gap-2 border-t border-border px-1 pt-3">
          <span className="grid size-8 place-items-center rounded-full bg-clay text-xs font-semibold text-white">JD</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium">Jordan Diaz</span>
            <span className="block truncate text-[10px] text-subtle">Student</span>
          </span>
        </div>
      </div>
    </aside>
  )
}
