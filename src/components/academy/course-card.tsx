import { ArrowRight, BookOpen } from 'lucide-react'
import type { Course } from '../../lib/types'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { ProgressBar } from '../ui/progress-bar'

interface CourseCardProps {
  course: Course
  onOpen: () => void
}

export function CourseCard({ course, onOpen }: CourseCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <span className="grid size-10 place-items-center rounded-control bg-success-soft text-success">
          <BookOpen aria-hidden="true" className="size-5" />
        </span>
        <span className="font-mono text-xs text-success">{course.progress}%</span>
      </div>
      <p className="font-mono text-[10px] tracking-wider text-subtle">{course.eyebrow.toUpperCase()}</p>
      <h3 className="mt-2 text-base font-semibold">{course.title}</h3>
      <p className="mt-2 text-xs leading-5 text-muted">{course.description}</p>
      <ProgressBar className="mt-5" label={`${course.title} progress`} value={course.progress} />
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-muted">{course.sessionsComplete} of {course.sessionsTotal} sessions</span>
        <Button aria-label={`Open ${course.title}`} onClick={onOpen} size="sm" variant="ghost">Open <ArrowRight aria-hidden="true" className="size-3.5" /></Button>
      </div>
    </Card>
  )
}
