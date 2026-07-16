import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import type { CourseLesson } from '../../lib/types'
import { Button } from '../ui/button'

interface LessonNavigationProps {
  lesson: CourseLesson
  lessonCount: number
  previousLesson: CourseLesson | undefined
  nextLesson: CourseLesson | undefined
  onBack: () => void
  onPrevious: () => void
  onNext: () => void
}

export function LessonNavigation({ lesson, lessonCount, previousLesson, nextLesson, onBack, onPrevious, onNext }: LessonNavigationProps) {
  return (
    <nav aria-label="Lesson navigation" className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground" onClick={onBack}><ArrowLeft aria-hidden="true" className="size-3.5" />Session {lesson.sessionNumber}</button>
      <span className="order-3 w-full text-center font-mono text-[10px] text-subtle sm:order-none sm:w-auto">Lesson {lesson.position} of {lessonCount}</span>
      <div className="flex gap-2">
        <Button aria-label="Previous lesson" disabled={!previousLesson} onClick={onPrevious} size="sm" variant="secondary"><ChevronLeft aria-hidden="true" className="size-3.5" /><span className="hidden sm:inline">Previous</span></Button>
        <Button aria-label="Next lesson" disabled={!nextLesson || nextLesson.status === 'locked'} onClick={onNext} size="sm" variant="secondary"><span className="hidden sm:inline">Next</span><ChevronRight aria-hidden="true" className="size-3.5" /></Button>
      </div>
    </nav>
  )
}
