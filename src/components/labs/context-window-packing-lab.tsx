import { useRef, useState, type DragEvent, type PointerEvent } from 'react'
import { Check, GripVertical, Plus, RotateCcw, Sparkles, X } from 'lucide-react'
import type { ContextWindowCard, ContextWindowPackingLabConfig } from '../../content/types'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { ProgressBar } from '../ui/progress-bar'
import { StatusBadge } from '../ui/status-badge'

interface ContextWindowPackingLabProps {
  config: ContextWindowPackingLabConfig
  onComplete: () => void
}

interface TouchDrag {
  cardId: string
  x: number
  y: number
}

export function ContextWindowPackingLab({ config, onComplete }: ContextWindowPackingLabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')
  const [checked, setChecked] = useState(false)
  const [touchDrag, setTouchDrag] = useState<TouchDrag>()
  const completionEmitted = useRef(false)

  const selectedCards = selectedIds
    .map((id) => config.cards.find((card) => card.id === id))
    .filter((card): card is ContextWindowCard => Boolean(card))
  const availableCards = config.cards.filter((card) => !selectedIds.includes(card.id))
  const usedCapacity = selectedCards.reduce((total, card) => total + card.size, 0)
  const correct = selectedIds.length === config.recommendedCardIds.length
    && config.recommendedCardIds.every((id) => selectedIds.includes(id))

  function addCard(cardId: string) {
    const card = config.cards.find((candidate) => candidate.id === cardId)
    if (!card || selectedIds.includes(cardId)) return
    if (usedCapacity + card.size > config.capacity) {
      setFeedback(`${card.title} does not fit. Remove a card or choose a smaller one.`)
      return
    }
    setSelectedIds((current) => [...current, cardId])
    setFeedback(`${card.title} added to the context window.`)
    setChecked(false)
  }

  function removeCard(cardId: string) {
    const card = config.cards.find((candidate) => candidate.id === cardId)
    setSelectedIds((current) => current.filter((id) => id !== cardId))
    setFeedback(`${card?.title ?? 'Card'} removed from the context window.`)
    setChecked(false)
  }

  function reset() {
    setSelectedIds([])
    setFeedback('Lab reset. The context window is empty.')
    setChecked(false)
  }

  function checkAnswer() {
    setChecked(true)
    if (correct) {
      setFeedback('Context packed well. Every selected card directly supports the goal.')
      if (!completionEmitted.current) {
        completionEmitted.current = true
        onComplete()
      }
    } else {
      setFeedback('Not quite. Keep the governing instruction, goal, relevant reference, and output format—without unrelated or conflicting context.')
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const cardId = event.dataTransfer.getData('text/plain')
    addCard(cardId)
  }

  function startTouchDrag(event: PointerEvent<HTMLButtonElement>, cardId: string) {
    if (event.pointerType === 'mouse') return
    event.currentTarget.setPointerCapture(event.pointerId)
    setTouchDrag({ cardId, x: event.clientX, y: event.clientY })
  }

  function moveTouchDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!touchDrag) return
    setTouchDrag({ ...touchDrag, x: event.clientX, y: event.clientY })
  }

  function endTouchDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!touchDrag) return
    const target = document.elementFromPoint(event.clientX, event.clientY)
    if (target?.closest('[data-context-dropzone]')) addCard(touchDrag.cardId)
    else setFeedback('Card not added. Drag it into the context window or use its Add button.')
    setTouchDrag(undefined)
  }

  return (
    <section aria-labelledby={`${config.id}-heading`} className="overflow-hidden rounded-card border border-ai/25 bg-card">
      <div className="border-b border-border bg-ai-soft p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-control bg-ai text-white">
            <Sparkles aria-hidden="true" className="size-4" />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ai">Interactive lab</p>
            <h2 className="mt-1 text-lg font-semibold" id={`${config.id}-heading`}>{config.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{config.description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Information cards</h3>
            <span className="font-mono text-[10px] text-subtle">{availableCards.length} available</span>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">Drag a card into the window, or use Add for touch and keyboard access.</p>
          <ul className="mt-3 space-y-2">
            {availableCards.map((card) => (
              <li
                className="rounded-control border border-border bg-background p-3"
                data-testid={`context-card-${card.id}`}
                draggable
                key={card.id}
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', card.id)
                  event.dataTransfer.effectAllowed = 'move'
                }}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    aria-label={`Drag ${card.title} to context window`}
                    className="grid size-8 shrink-0 touch-none cursor-grab place-items-center rounded-control text-subtle hover:bg-card-secondary hover:text-foreground"
                    onPointerCancel={() => setTouchDrag(undefined)}
                    onPointerDown={(event) => startTouchDrag(event, card.id)}
                    onPointerMove={moveTouchDrag}
                    onPointerUp={endTouchDrag}
                    type="button"
                  >
                    <GripVertical aria-hidden="true" className="size-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{card.title}</p>
                    <p className="font-mono text-[10px] text-subtle">{card.size} capacity {card.size === 1 ? 'unit' : 'units'}</p>
                  </div>
                  <Button aria-label={`Add ${card.title} to context`} onClick={() => addCard(card.id)} size="sm" variant="secondary">
                    <Plus aria-hidden="true" className="size-3.5" />
                    Add
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Context window</h3>
            <span className="font-mono text-[10px] text-subtle">{usedCapacity} / {config.capacity}</span>
          </div>
          <ProgressBar
            className="mt-3"
            label={`Context capacity: ${usedCapacity} of ${config.capacity} units used`}
            value={(usedCapacity / config.capacity) * 100}
          />
          <div
            aria-label="Context window drop area"
            className="mt-3 min-h-48 rounded-card border border-dashed border-border-strong bg-background p-3"
            data-context-dropzone
            data-testid="context-window"
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
            }}
            onDrop={handleDrop}
          >
            {selectedCards.length === 0 ? (
              <div className="grid min-h-40 place-items-center px-4 text-center">
                <p className="text-xs leading-5 text-subtle">Drop useful information here.<br />The window holds {config.capacity} capacity units.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {selectedCards.map((card) => (
                  <li className="rounded-control border border-border bg-card p-3" key={card.id}>
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">{card.title}</p>
                          {checked && <StatusBadge accent={card.impact === 'helpful' ? 'success' : 'warning'}>{card.impact === 'helpful' ? 'Helps' : 'Hurts'}</StatusBadge>}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-muted">{card.explanation}</p>
                      </div>
                      <button
                        aria-label={`Remove ${card.title} from context`}
                        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-control text-subtle hover:bg-card-secondary hover:text-foreground"
                        onClick={() => removeCard(card.id)}
                        type="button"
                      >
                        <X aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:p-5">
        <div aria-live="polite" className={cn('min-h-5 flex-1 text-xs leading-5', checked && correct ? 'text-success' : 'text-muted')}>
          {feedback}
        </div>
        <Button onClick={reset} size="sm" variant="outline"><RotateCcw aria-hidden="true" className="size-3.5" />Reset</Button>
        <Button disabled={selectedIds.length === 0} onClick={checkAnswer} size="sm">
          {checked && correct && <Check aria-hidden="true" className="size-3.5" />}
          {checked && correct ? 'Answer checked' : 'Check answer'}
        </Button>
      </div>

      {touchDrag && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 max-w-48 rounded-control border border-ai bg-card px-3 py-2 text-xs font-semibold shadow-floating"
          style={{ left: touchDrag.x + 12, top: touchDrag.y + 12 }}
        >
          {config.cards.find((card) => card.id === touchDrag.cardId)?.title}
        </div>
      )}
    </section>
  )
}
