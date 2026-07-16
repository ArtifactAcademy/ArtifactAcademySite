import type { LucideIcon } from 'lucide-react'
import { TrendingUp } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Accent } from '../../lib/types'
import { Card } from '../ui/card'

interface StatCardProps {
  label: string
  value: string
  helper: string
  icon?: LucideIcon
  accent?: Accent
}

const accentClasses: Record<Accent, string> = {
  neutral: 'bg-card-secondary text-muted',
  success: 'bg-success-soft text-success',
  clay: 'bg-clay-soft text-clay',
  ai: 'bg-ai-soft text-ai',
  warning: 'bg-card-secondary text-warning',
}

export function StatCard({ label, value, helper, icon: Icon = TrendingUp, accent = 'neutral' }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-[11px] text-subtle">{helper}</p>
        </div>
        <span className={cn('grid size-9 place-items-center rounded-control', accentClasses[accent])}><Icon aria-hidden="true" className="size-4" /></span>
      </div>
    </Card>
  )
}
