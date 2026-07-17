import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

interface LearningControlsProps {
  completed: boolean
  completeDisabled?: boolean
  hasNext: boolean
  hasPrevious: boolean
  nextLocked: boolean
  onComplete: () => void
  onNext: () => void
  onPrevious: () => void
}

export function LearningControls({
  completed,
  completeDisabled = false,
  hasNext,
  hasPrevious,
  nextLocked,
  onComplete,
  onNext,
  onPrevious,
}: LearningControlsProps) {
  return (
    <nav aria-label="Lesson controls" className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
      <Button className="sm:mr-auto" disabled={!hasPrevious} onClick={onPrevious} variant="outline">
        <ChevronLeft aria-hidden="true" className="size-4" />
        Previous
      </Button>
      <Button
        className="sm:min-w-40"
        disabled={completed || completeDisabled}
        onClick={onComplete}
        variant="secondary"
      >
        <Check aria-hidden="true" className="size-4" />
        {completed ? 'Completed' : 'Mark complete'}
      </Button>
      <Button className="sm:ml-auto" disabled={!hasNext || nextLocked} onClick={onNext}>
        Next
        <ChevronRight aria-hidden="true" className="size-4" />
      </Button>
    </nav>
  )
}
