import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { Accent } from '../../lib/types'

interface StatusBadgeProps {
  children: ReactNode
  accent?: Accent
  dot?: boolean
  className?: string
}

const accents: Record<Accent, string> = {
  neutral: 'border-border bg-card-secondary text-muted',
  success: 'border-success/20 bg-success-soft text-success',
  clay: 'border-clay/20 bg-clay-soft text-clay',
  ai: 'border-ai/20 bg-ai-soft text-ai',
  warning: 'border-warning/20 bg-card-secondary text-warning',
}

export function StatusBadge({ children, accent = 'neutral', dot = false, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold', accents[accent], className)}>
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
