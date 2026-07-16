import { BookOpen, Boxes, LayoutDashboard, Library } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '../../lib/cn'

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/artifacts', label: 'Artifacts', icon: Boxes },
  { to: '/portfolio', label: 'Portfolio', icon: Library },
]

export function MobileNavigation() {
  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => cn('flex min-h-12 flex-col items-center justify-center gap-1 rounded-control text-[10px] text-subtle', isActive && 'bg-card-secondary font-medium text-foreground')}>
              <Icon aria-hidden="true" className="size-4.5" />
              {item.label}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
