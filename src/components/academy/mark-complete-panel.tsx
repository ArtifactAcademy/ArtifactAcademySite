import { Check, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface MarkCompletePanelProps {
  completed: boolean
  hasNextLesson: boolean
  onComplete: () => void
}

export function MarkCompletePanel({ completed, hasNextLesson, onComplete }: MarkCompletePanelProps) {
  return (
    <Card className={completed ? 'border-success/30 bg-success-soft p-5' : 'p-5'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success-soft text-success"><CheckCircle2 aria-hidden="true" className="size-5" /></span>
          <div>
            <h2 className="text-sm font-semibold">{completed ? 'Lesson complete' : 'Finished this lesson?'}</h2>
            <p className="mt-1 text-xs leading-5 text-muted">{completed ? 'This mock completion resets when the page refreshes.' : hasNextLesson ? 'Mark complete to finish this mock lesson and continue.' : 'Mark complete to finish this mock lesson.'}</p>
          </div>
        </div>
        <Button className="shrink-0 sm:min-w-36" disabled={completed} onClick={onComplete}>
          <Check aria-hidden="true" className="size-4" />
          {completed ? 'Completed' : 'Mark complete'}
        </Button>
      </div>
    </Card>
  )
}
