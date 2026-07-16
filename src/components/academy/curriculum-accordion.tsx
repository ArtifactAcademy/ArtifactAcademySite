import { useState } from 'react'
import { Check, ChevronDown, LockKeyhole, Shapes } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { CourseLesson, CourseSession } from '../../lib/types'
import { StatusBadge } from '../ui/status-badge'
import { CourseLessonRow } from './course-lesson-row'

interface CurriculumAccordionProps {
  sessions: CourseSession[]
  onOpenLesson: (lesson: CourseLesson) => void
}

export function CurriculumAccordion({ sessions, onOpenLesson }: CurriculumAccordionProps) {
  const currentSession = sessions.find((session) => session.status === 'in-progress')
  const [expanded, setExpanded] = useState(() => new Set(currentSession ? [currentSession.id] : []))

  function toggle(sessionId: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(sessionId)) next.delete(sessionId)
      else next.add(sessionId)
      return next
    })
  }

  return (
    <div className="space-y-2.5">
      {sessions.map((session) => {
        const isExpanded = expanded.has(session.id)
        const isLocked = session.status === 'locked'
        const statusLabel = session.status === 'completed' ? 'completed' : session.status === 'in-progress' ? 'in progress' : session.status

        return (
          <section key={session.id} className={cn('overflow-hidden rounded-card border border-border bg-card', session.status === 'in-progress' && 'border-border-strong')}>
            <h3>
              <button
                aria-expanded={isExpanded}
                className={cn('flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-card-secondary', isExpanded && 'bg-card-secondary')}
                onClick={() => toggle(session.id)}
              >
                <span className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full border border-border-strong bg-background text-[10px] font-semibold text-muted',
                  session.status === 'completed' && 'border-success bg-success text-white',
                  session.status === 'in-progress' && 'border-2 border-success text-success',
                )}>
                  {session.status === 'completed' ? <Check aria-hidden="true" className="size-3.5" /> : isLocked ? <LockKeyhole aria-hidden="true" className="size-3" /> : session.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold sm:text-[13px]">Session {session.number} · {session.title}</span>
                  <span className="mt-0.5 block text-[11px] text-subtle">3 lessons · 1 artifact · {statusLabel}</span>
                </span>
                {session.status === 'in-progress' && <span className="font-mono text-[10px] text-success">{session.progress}%</span>}
                <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-subtle transition-transform', isExpanded && 'rotate-180')} />
              </button>
            </h3>
            {isExpanded && (
              <div className="border-t border-border p-1.5">
                {session.lessons.map((lesson) => <CourseLessonRow key={lesson.id} lesson={lesson} onOpen={onOpenLesson} />)}
                <div className={cn('mt-1 flex items-center gap-3 rounded-control border border-dashed border-border-strong px-3 py-2.5', session.artifact.status === 'completed' && 'border-success/30 bg-success-soft')}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-control bg-card-secondary text-muted"><Shapes aria-hidden="true" className="size-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold">Artifact · {session.artifact.title}</span>
                    <span className="mt-0.5 block text-[11px] text-subtle">{session.artifact.description}</span>
                  </span>
                  <StatusBadge accent={session.artifact.status === 'completed' ? 'success' : 'neutral'} className="hidden sm:inline-flex">{session.artifact.status}</StatusBadge>
                </div>
                {isLocked && <p className="px-3 py-2 text-[11px] text-subtle">No resources yet. Materials are added as this session unlocks.</p>}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
