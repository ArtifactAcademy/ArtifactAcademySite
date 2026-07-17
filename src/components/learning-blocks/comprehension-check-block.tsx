import { useState, type FormEvent } from 'react'
import { CheckCircle2, CircleHelp } from 'lucide-react'
import type { ComprehensionCheckBlock as ComprehensionCheckContent } from '../../content/types'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface ComprehensionCheckBlockProps {
  block: ComprehensionCheckContent
}

export function ComprehensionCheckBlock({ block }: ComprehensionCheckBlockProps) {
  const [selectedOptionId, setSelectedOptionId] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = selectedOptionId === block.correctOptionId

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChecked(true)
  }

  return (
    <Card className="p-5">
      <div className="flex gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-control bg-ai-soft text-ai">
          <CircleHelp aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ai">Comprehension check</p>
          <h2 className="mt-2 text-sm font-semibold">{block.question}</h2>
        </div>
      </div>
      <form className="mt-4" onSubmit={handleSubmit}>
        <fieldset className="space-y-2">
          <legend className="sr-only">{block.question}</legend>
          {block.options.map((option) => (
            <label className="flex cursor-pointer items-start gap-3 rounded-control border border-border px-3 py-3 text-sm hover:bg-card-secondary" key={option.id}>
              <input
                checked={selectedOptionId === option.id}
                className="mt-0.5 size-4 accent-ai"
                name={block.id}
                onChange={() => {
                  setSelectedOptionId(option.id)
                  setChecked(false)
                }}
                type="radio"
                value={option.id}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
        <Button className="mt-4" disabled={!selectedOptionId} size="sm" type="submit" variant="secondary">Check answer</Button>
      </form>
      {checked && (
        <div
          aria-live="polite"
          className={cn('mt-4 rounded-control border p-3 text-sm', correct ? 'border-success/30 bg-success-soft' : 'border-clay/30 bg-clay-soft')}
        >
          <p className="flex items-center gap-2 font-semibold">
            {correct && <CheckCircle2 aria-hidden="true" className="size-4 text-success" />}
            {correct ? 'Correct' : 'Try again'}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">{correct ? block.explanation : 'Review which information directly reduces ambiguity for the current request.'}</p>
        </div>
      )}
    </Card>
  )
}
