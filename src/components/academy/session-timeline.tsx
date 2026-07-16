import { Check, LockKeyhole } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Session } from '../../lib/types'
import { Card } from '../ui/card'
import { StatusBadge } from '../ui/status-badge'

interface SessionTimelineProps {
  sessions: Session[]
  progress: number
  artifactsShipped: number
}

export function SessionTimeline({ sessions, progress, artifactsShipped }: SessionTimelineProps) {
  return (
    <Card className="p-5">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">Bootcamp progress</h2>
          <p className="mt-1 text-xs text-muted">3 of 8 sessions complete · {artifactsShipped} artifacts shipped</p>
        </div>
        <StatusBadge accent="success">{progress}%</StatusBadge>
      </div>
      <ol aria-label="Course session progress" className="grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-8">
        {sessions.map((session, index) => (
          <li key={session.id} aria-current={session.status === 'current' ? 'step' : undefined} className="relative text-center">
            {index < sessions.length - 1 && <span aria-hidden="true" className="absolute left-[calc(50%+14px)] top-3 hidden h-px w-[calc(100%-20px)] bg-border sm:block" />}
            <span
              className={cn(
                'relative mx-auto grid size-7 place-items-center rounded-full border text-[11px] font-semibold',
                session.status === 'complete' && 'border-success bg-success text-primary-foreground',
                session.status === 'current' && 'border-success bg-success-soft text-success ring-2 ring-success/20',
                session.status === 'upcoming' && 'border-border-strong bg-card-secondary text-muted',
                session.status === 'locked' && 'border-border bg-background text-subtle',
              )}
            >
              {session.status === 'complete' ? <Check aria-hidden="true" className="size-3.5" /> : session.status === 'locked' ? <LockKeyhole aria-hidden="true" className="size-3" /> : session.number}
            </span>
            <span className={cn('mt-2 block truncate text-[10px]', session.status === 'current' ? 'font-semibold text-foreground' : 'text-subtle')}>{session.label}</span>
          </li>
        ))}
      </ol>
    </Card>
  )
}
