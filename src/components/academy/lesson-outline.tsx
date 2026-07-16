import { Check, Circle, LockKeyhole } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { CourseLesson } from '../../lib/types'
import { Card } from '../ui/card'

interface LessonOutlineProps {
  className?: string
  lesson: CourseLesson
  sessionLessons: CourseLesson[]
  onOpenLesson: (lesson: CourseLesson) => void
}

export function LessonOutline({ className, lesson, sessionLessons, onOpenLesson }: LessonOutlineProps) {
  return (
    <Card className={cn('p-4', className)}>
      <h2 className="font-mono text-[10px] tracking-wider text-subtle">LESSON OUTLINE</h2>
      <ol className="mt-3 space-y-2 border-b border-border pb-4">
        {lesson.outline.map((item, index) => <li key={item} className="flex items-center gap-2 text-xs text-muted"><span className="font-mono text-[10px] text-subtle">{String(index + 1).padStart(2, '0')}</span>{item}</li>)}
      </ol>
      <h2 className="mt-4 font-mono text-[10px] tracking-wider text-subtle">IN THIS SESSION</h2>
      <div className="mt-2 space-y-1">
        {sessionLessons.map((sessionLesson) => {
          const isCurrent = sessionLesson.id === lesson.id
          return (
            <button
              key={sessionLesson.id}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn('flex w-full items-center gap-2 rounded-control px-2 py-2 text-left text-xs text-muted hover:bg-card-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60', isCurrent && 'bg-card-secondary font-semibold text-foreground')}
              disabled={sessionLesson.status === 'locked'}
              onClick={() => onOpenLesson(sessionLesson)}
            >
              {sessionLesson.status === 'completed' ? <Check aria-hidden="true" className="size-3.5 text-success" /> : sessionLesson.status === 'locked' ? <LockKeyhole aria-hidden="true" className="size-3.5" /> : <Circle aria-hidden="true" className={cn('size-3.5', isCurrent && 'fill-success text-success')} />}
              <span className="min-w-0 flex-1 truncate">Lesson {sessionLesson.position} · {sessionLesson.title}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
