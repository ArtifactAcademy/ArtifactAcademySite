import type { LucideIcon } from 'lucide-react'
import { FilePlus2 } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  actionLabel?: string
}

export function EmptyState({
  icon: Icon = FilePlus2,
  title = 'No artifacts yet',
  description = 'Finish a session to ship your first one.',
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-card border border-dashed border-border-strong p-6 text-center">
      <span className="mb-3 grid size-10 place-items-center rounded-control border border-border bg-card-secondary text-muted">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-56 text-xs leading-5 text-muted">{description}</p>
      {actionLabel && <Button className="mt-4" size="sm" variant="outline">{actionLabel}</Button>}
    </div>
  )
}
