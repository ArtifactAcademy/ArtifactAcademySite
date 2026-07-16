import { Clock3, Play, Presentation } from 'lucide-react'
import type { Course } from '../../lib/types'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { ProgressBar } from '../ui/progress-bar'
import { StatusBadge } from '../ui/status-badge'

interface CourseHeaderProps {
  course: Course
  onResume: () => void
}

export function CourseHeader({ course, onResume }: CourseHeaderProps) {
  return (
    <Card className="overflow-hidden">
      <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-clay to-ai" />
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge>Course</StatusBadge>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-subtle"><Presentation aria-hidden="true" className="size-3.5" />{course.format}</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-subtle"><Clock3 aria-hidden="true" className="size-3.5" />{course.duration}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{course.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{course.description}</p>
        </div>
        <div>
          <ProgressBar label="Overall course progress" showValue value={course.progress} />
          <Button className="mt-5 h-11 w-full" onClick={onResume}>
            <Play aria-hidden="true" className="size-4 fill-current" />
            Resume current lesson
          </Button>
          <p className="mt-2 text-center font-mono text-[10px] text-subtle">Session 4 · Lesson 2</p>
        </div>
      </div>
    </Card>
  )
}
