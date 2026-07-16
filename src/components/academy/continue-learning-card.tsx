import { ArrowUpRight, Play } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { ProgressBar } from '../ui/progress-bar'
import { StatusBadge } from '../ui/status-badge'

interface ContinueLearningCardProps {
  courseTitle: string
  session: number
  lesson: number
  lessonTitle: string
  minutesRemaining: number
  progress: number
}

export function ContinueLearningCard({
  courseTitle,
  session,
  lesson,
  lessonTitle,
  minutesRemaining,
  progress,
}: ContinueLearningCardProps) {
  return (
    <Card className="group relative overflow-hidden p-5 sm:p-6">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[38%] border-l border-border bg-[repeating-linear-gradient(135deg,var(--ds-surface-2),var(--ds-surface-2)_10px,var(--ds-elevated)_10px,var(--ds-elevated)_11px)] opacity-40 md:block" />
      <div className="relative max-w-2xl md:max-w-[62%]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-subtle">
            <span className="size-1.5 rounded-full bg-success" />
            CONTINUE LEARNING
          </p>
          <StatusBadge accent="success">{progress}%</StatusBadge>
        </div>
        <p className="mb-1 text-xs text-muted">{courseTitle} · Session {session}</p>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{lessonTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Lesson {lesson} of 3 · About {minutesRemaining} minutes remaining.</p>
        <ProgressBar className="mt-5" label={`${courseTitle} lesson progress`} value={progress} />
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button className="h-11 flex-1 sm:flex-none">
            <Play aria-hidden="true" className="size-4 fill-current" />
            Resume lesson
          </Button>
          <Button aria-label="View lesson syllabus" variant="ghost">
            View syllabus
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
