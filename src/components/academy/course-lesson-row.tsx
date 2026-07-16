import { Check, FileText, LockKeyhole, Play, Sparkles } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { CourseLesson } from '../../lib/types'
import { StatusBadge } from '../ui/status-badge'

interface CourseLessonRowProps {
  lesson: CourseLesson
  onOpen: (lesson: CourseLesson) => void
}

const kindIcons = { video: Play, reading: FileText, artifact: FileText, ai: Sparkles }

export function CourseLessonRow({ lesson, onOpen }: CourseLessonRowProps) {
  const Icon = kindIcons[lesson.kind]
  const isLocked = lesson.status === 'locked'
  const statusAccent = lesson.status === 'completed' || lesson.status === 'in-progress' ? 'success' : 'neutral'

  return (
    <button
      aria-label={`${lesson.title}, ${lesson.status}`}
      className={cn(
        'flex w-full items-center gap-3 rounded-control border border-transparent px-3 py-2.5 text-left transition-colors hover:bg-card-secondary disabled:cursor-not-allowed disabled:opacity-60',
        lesson.status === 'in-progress' && 'border-border-strong bg-elevated',
      )}
      disabled={isLocked}
      onClick={() => onOpen(lesson)}
    >
      <span className={cn(
        'grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card-secondary text-muted',
        lesson.status === 'completed' && 'border-success bg-success text-white',
        lesson.status === 'in-progress' && 'border-success text-success',
      )}>
        {lesson.status === 'completed' ? <Check aria-hidden="true" className="size-4" /> : isLocked ? <LockKeyhole aria-hidden="true" className="size-3.5" /> : <Icon aria-hidden="true" className="size-3.5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-foreground">Lesson {lesson.position} · {lesson.title}</span>
        <span className="mt-0.5 block text-[11px] text-subtle">{lesson.kind === 'ai' ? 'AI-assisted' : 'Lesson'} · {lesson.durationMinutes} min</span>
      </span>
      <StatusBadge accent={statusAccent} className="hidden shrink-0 sm:inline-flex">{lesson.status}</StatusBadge>
    </button>
  )
}
