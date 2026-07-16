import { MessageCircleMore } from 'lucide-react'
import { cn } from '../../lib/cn'

interface InstructorCalloutProps {
  instructor: string
  message: string
  className?: string
}

export function InstructorCallout({ instructor, message, className }: InstructorCalloutProps) {
  return (
    <aside className={cn('rounded-card border border-clay/20 bg-clay-soft p-4', className)} aria-label={`Message from ${instructor}`}>
      <div className="mb-3 flex items-center gap-2 text-clay">
        <span className="grid size-7 place-items-center rounded-control bg-clay/15"><MessageCircleMore aria-hidden="true" className="size-4" /></span>
        <span className="font-mono text-[10px] tracking-wider">INSTRUCTOR NOTE</span>
      </div>
      <p className="text-sm leading-6 text-foreground">{message}</p>
      <p className="mt-3 text-xs font-semibold text-clay">{instructor}</p>
    </aside>
  )
}
