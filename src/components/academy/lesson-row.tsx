import { Bot, Check, FileText, LockKeyhole, Play, Shapes } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Lesson } from '../../lib/types'

interface LessonRowProps {
  lesson: Lesson
}

const icons = { video: Play, reading: FileText, artifact: Shapes, ai: Bot }

export function LessonRow({ lesson }: LessonRowProps) {
  const Icon = icons[lesson.kind]
  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-control border border-transparent p-2.5 text-left transition-colors hover:bg-card-secondary',
        lesson.status === 'current' && 'border-border bg-elevated',
      )}
      disabled={lesson.status === 'locked'}
    >
      <span className={cn('grid size-8 shrink-0 place-items-center rounded-control bg-card-secondary text-muted', lesson.kind === 'ai' && 'bg-ai-soft text-ai')}>
        {lesson.status === 'complete' ? <Check aria-hidden="true" className="size-4 text-success" /> : lesson.status === 'locked' ? <LockKeyhole aria-hidden="true" className="size-4" /> : <Icon aria-hidden="true" className="size-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-foreground">{lesson.title}</span>
        <span className="mt-0.5 block text-[11px] text-subtle">{lesson.meta}</span>
      </span>
    </button>
  )
}
