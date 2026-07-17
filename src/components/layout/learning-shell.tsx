import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import {
  getLearningItem,
  initialCompletedLearningItemIds,
  learningItems,
} from '../../lib/mock-data'
import type { LearningSubmission } from '../../lib/types'
import { CourseNavigator } from './course-navigator'
import { LearningTopBar } from './learning-top-bar'

export interface LearningShellContext {
  completedIds: ReadonlySet<string>
  currentItemId: string
  submissions: Readonly<Record<string, LearningSubmission | undefined>>
  completeItem: (itemId: string) => void
  submitAssignment: (itemId: string, submission: LearningSubmission) => void
}

const initialSubmissions = Object.fromEntries(
  learningItems
    .filter((item) => item.assignment?.submission)
    .map((item) => [item.id, item.assignment?.submission]),
)

export function LearningShell() {
  const location = useLocation()
  const [navigatorCollapsed, setNavigatorCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(initialCompletedLearningItemIds),
  )
  const [submissions, setSubmissions] = useState<Record<string, LearningSubmission | undefined>>(
    initialSubmissions,
  )

  const currentItemId = learningItems.find((item) => !completedIds.has(item.id))?.id ?? learningItems.at(-1)?.id ?? ''
  const routeItemId = location.pathname.startsWith('/learn/')
    ? decodeURIComponent(location.pathname.slice('/learn/'.length))
    : currentItemId
  const activeItem = getLearningItem(routeItemId) ?? getLearningItem(currentItemId)

  const context = useMemo<LearningShellContext>(() => ({
    completedIds,
    currentItemId,
    submissions,
    completeItem(itemId) {
      setCompletedIds((current) => new Set(current).add(itemId))
    },
    submitAssignment(itemId, submission) {
      setSubmissions((current) => ({ ...current, [itemId]: submission }))
    },
  }), [completedIds, currentItemId, submissions])

  return (
    <div className="min-h-screen bg-page text-foreground">
      <LearningTopBar
        onOpenNavigator={() => setDrawerOpen(true)}
        sessionNumber={activeItem?.sessionNumber ?? 1}
      />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px] bg-background">
        <CourseNavigator
          activeItemId={activeItem?.id ?? currentItemId}
          collapsed={navigatorCollapsed}
          completedIds={completedIds}
          onCloseDrawer={() => setDrawerOpen(false)}
          onToggleCollapsed={() => setNavigatorCollapsed((value) => !value)}
          open={drawerOpen}
        />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-10">
          <Outlet context={context} />
        </main>
      </div>
    </div>
  )
}
