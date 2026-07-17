import { useEffect, useRef, useState } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  FileCheck2,
  LockKeyhole,
  Play,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '../../lib/cn'
import { getLearningItemState, learningCourse } from '../../lib/mock-data'
import type { LearningItem } from '../../lib/types'
import { ProgressBar } from '../ui/progress-bar'

interface CourseNavigatorProps {
  activeItemId: string
  collapsed: boolean
  completedIds: ReadonlySet<string>
  onCloseDrawer: () => void
  onToggleCollapsed: () => void
  open: boolean
}

function NavigatorContent({
  activeItemId,
  collapsed,
  completedIds,
  onNavigate,
  onToggleCollapsed,
  mobile = false,
}: Omit<CourseNavigatorProps, 'open' | 'onCloseDrawer'> & { mobile?: boolean; onNavigate?: () => void }) {
  const activeSession = learningCourse.sessions.find((session) =>
    session.items.some((item) => item.id === activeItemId),
  )
  const [openSessions, setOpenSessions] = useState<Set<string>>(() => new Set())
  const completedCount = completedIds.size
  const totalCount = learningCourse.sessions.flatMap((session) => session.items).length

  if (collapsed && !mobile) {
    return (
      <div className="flex h-full flex-col items-center py-3">
        <button
          aria-label="Expand course navigator"
          className="mb-3 grid size-9 cursor-pointer place-items-center rounded-control border border-border text-muted hover:bg-card-secondary hover:text-foreground"
          onClick={onToggleCollapsed}
          type="button"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
        <nav aria-label="Course navigator" className="flex flex-col gap-1">
          {learningCourse.sessions.map((session) => {
            const firstAccessible = session.items.find((item) =>
              getLearningItemState(item.id, completedIds) !== 'locked',
            )
            const isActive = session.id === activeSession?.id
            return firstAccessible ? (
              <NavLink
                aria-label={`Session ${session.number}: ${session.title}`}
                className={cn(
                  'grid size-9 place-items-center rounded-control text-xs font-semibold text-muted hover:bg-card-secondary hover:text-foreground',
                  isActive && 'border border-border bg-elevated text-foreground',
                )}
                key={session.id}
                to={`/learn/${firstAccessible.id}`}
              >
                {session.number}
              </NavLink>
            ) : (
              <span
                aria-label={`Session ${session.number}: ${session.title}, locked`}
                className="grid size-9 place-items-center rounded-control text-subtle"
                key={session.id}
              >
                <LockKeyhole aria-hidden="true" className="size-3.5" />
              </span>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-subtle">Course</p>
          <p className="mt-1 truncate text-sm font-semibold">{learningCourse.title}</p>
        </div>
        {!mobile && (
          <button
            aria-label="Collapse course navigator"
            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-control text-muted hover:bg-card-secondary hover:text-foreground"
            onClick={onToggleCollapsed}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      <div className="border-b border-border px-4 pb-4">
        <ProgressBar
          label={`${completedCount} of ${totalCount} course items complete`}
          showValue
          value={(completedCount / totalCount) * 100}
        />
      </div>

      <nav aria-label="Course navigator" className="flex-1 overflow-y-auto p-2">
        {learningCourse.sessions.map((session) => {
          const isOpen = openSessions.has(session.id) || session.id === activeSession?.id
          const sessionStates = session.items.map((item) => getLearningItemState(item.id, completedIds))
          const sessionCompleted = sessionStates.every((state) => state === 'completed')
          const sessionLocked = sessionStates.every((state) => state === 'locked')
          const sessionCurrent = sessionStates.includes('current')

          return (
            <section className="mb-1" key={session.id}>
              <button
                aria-expanded={isOpen}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 rounded-control px-2 py-2 text-left hover:bg-card-secondary',
                  sessionCurrent && 'border border-border bg-elevated',
                )}
                onClick={() => setOpenSessions((current) => {
                  const next = new Set(current)
                  if (next.has(session.id)) next.delete(session.id)
                  else next.add(session.id)
                  return next
                })}
                type="button"
              >
                <SessionStateIcon completed={sessionCompleted} current={sessionCurrent} locked={sessionLocked} number={session.number} />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.08em] text-subtle">Session {session.number}</span>
                  <span className={cn('block truncate text-xs text-muted', sessionCurrent && 'font-semibold text-foreground')}>{session.title}</span>
                </span>
                <ChevronRight aria-hidden="true" className={cn('size-3.5 shrink-0 text-subtle transition-transform', isOpen && 'rotate-90')} />
              </button>

              {isOpen && (
                <div className="ml-4 border-l border-border py-1 pl-3">
                  {session.items.map((item) => (
                    <NavigatorItem
                      active={item.id === activeItemId}
                      item={item}
                      key={item.id}
                      onNavigate={onNavigate}
                      state={getLearningItemState(item.id, completedIds)}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </nav>
    </div>
  )
}

function SessionStateIcon({ completed, current, locked, number }: { completed: boolean; current: boolean; locked: boolean; number: number }) {
  if (completed) return <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success text-white"><Check aria-hidden="true" className="size-3" /></span>
  if (locked) return <span className="grid size-5 shrink-0 place-items-center rounded-full border border-border-strong text-subtle"><LockKeyhole aria-hidden="true" className="size-2.5" /></span>
  return <span className={cn('grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold', current ? 'bg-foreground text-background' : 'border border-border-strong text-muted')}>{number}</span>
}

function NavigatorItem({ active, item, onNavigate, state }: { active: boolean; item: LearningItem; onNavigate: (() => void) | undefined; state: 'completed' | 'current' | 'locked' }) {
  const Icon = item.kind === 'assignment' ? FileCheck2 : Play
  const label = `${item.kind === 'assignment' ? 'Artifact' : `Lesson ${item.position}`} · ${item.title}`
  const content = (
    <>
      {state === 'completed' ? <Check aria-hidden="true" className="size-3.5 shrink-0 text-success" /> : state === 'locked' ? <LockKeyhole aria-hidden="true" className="size-3.5 shrink-0 text-subtle" /> : <Icon aria-hidden="true" className={cn('size-3.5 shrink-0', item.kind === 'assignment' ? 'text-ai' : 'text-foreground')} />}
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </>
  )

  if (state === 'locked') {
    return (
      <button
        aria-label={`${label}, locked`}
        className="flex w-full cursor-not-allowed items-center gap-2 rounded-control px-2 py-2 text-left text-xs text-subtle"
        disabled
        type="button"
      >
        {content}
      </button>
    )
  }

  return (
    <NavLink
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2 rounded-control border border-transparent px-2 py-2 text-xs text-muted hover:bg-card-secondary hover:text-foreground',
        active && 'border-border bg-card-secondary font-semibold text-foreground',
      )}
      onClick={onNavigate}
      to={`/learn/${item.id}`}
    >
      {content}
    </NavLink>
  )
}

export function CourseNavigator(props: CourseNavigatorProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { onCloseDrawer, open } = props

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseDrawer()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCloseDrawer, open])

  return (
    <>
      <aside className={cn('sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-border bg-card transition-[width] lg:block', props.collapsed ? 'w-16' : 'w-68')}>
        <NavigatorContent {...props} />
      </aside>

      {props.open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close lesson outline" className="absolute inset-0 cursor-default bg-black/60" onClick={props.onCloseDrawer} type="button" />
          <div aria-label="Lesson outline" aria-modal="true" className="absolute inset-y-0 left-0 w-[min(21rem,88vw)] border-r border-border bg-card shadow-floating" role="dialog">
            <div className="absolute right-3 top-3 z-10">
              <button
                aria-label="Close lesson outline"
                className="grid size-8 cursor-pointer place-items-center rounded-control border border-border bg-background text-muted"
                onClick={props.onCloseDrawer}
                ref={closeButtonRef}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 border-b border-border px-4 py-4 pr-14">
              <span className="grid size-7 place-items-center rounded-control bg-primary text-primary-foreground"><Crown aria-hidden="true" className="size-3.5" /></span>
              <span className="text-xs font-semibold">Artifact Academy</span>
            </div>
            <div className="h-[calc(100%-3.75rem)]">
              <NavigatorContent {...props} mobile onNavigate={props.onCloseDrawer} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
