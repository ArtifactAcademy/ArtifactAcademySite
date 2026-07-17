import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/use-auth'
import { learningCourse } from '../../content/ai-creator-bootcamp/course'
import {
  getLearningItem,
  learningItems,
} from '../../content/course-content'
import type { LearningSubmission } from '../../content/types'
import { useServices } from '../../lib/services/use-services'
import type { StudentCourseState } from '../../lib/services/types'
import { AccessPendingPage } from '../../pages/access-pending-page'
import { AuthenticationLoading } from '../../pages/login-page'
import { CourseNavigator } from './course-navigator'
import { LearningTopBar } from './learning-top-bar'

export interface LearningShellContext {
  completedIds: ReadonlySet<string>
  completedLabIds: ReadonlySet<string>
  currentItemId: string
  submissions: Readonly<Record<string, LearningSubmission | undefined>>
  completeItem: (itemId: string) => void
  completeLab: (itemId: string, blockId: string) => void
  submitAssignment: (itemId: string, submission: LearningSubmission) => void
}

export function LearningShell() {
  const location = useLocation()
  const { learning } = useServices()
  const { loading: authLoading, signOut, user } = useAuth()
  const [navigatorCollapsed, setNavigatorCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [courseState, setCourseState] = useState<StudentCourseState | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    if (!user) {
      return () => {
        active = false
      }
    }

    void Promise.resolve()
      .then(() => {
        if (active) setLoadError(null)
        return learning.loadCourseState(learningCourse.id)
      })
      .then((state) => {
        if (active) setCourseState(state)
      })
      .catch((caught: unknown) => {
        if (active) {
          setLoadError(caught instanceof Error ? caught.message : 'Unable to load your course.')
        }
      })

    return () => {
      active = false
    }
  }, [learning, user])

  const completedIds = useMemo(
    () => new Set(courseState?.completedItemIds ?? []),
    [courseState?.completedItemIds],
  )
  const completedLabIds = useMemo(
    () => new Set(courseState?.completedLabIds ?? []),
    [courseState?.completedLabIds],
  )
  const submissions = useMemo(
    () => courseState?.submissions ?? {},
    [courseState?.submissions],
  )
  const currentItemId =
    learningItems.find((item) => !completedIds.has(item.id))?.id
    ?? learningItems.at(-1)?.id
    ?? ''
  const routeItemId = location.pathname.startsWith('/learn/')
    ? decodeURIComponent(location.pathname.slice('/learn/'.length))
    : currentItemId
  const activeItem = getLearningItem(routeItemId) ?? getLearningItem(currentItemId)

  const context = useMemo<LearningShellContext>(() => ({
    completedIds,
    completedLabIds,
    currentItemId,
    submissions,
    completeItem(itemId) {
      setActionError(null)
      void learning.completeLesson(learningCourse.id, itemId)
        .then(() => {
          setCourseState((current) => current ? {
            ...current,
            completedItemIds: current.completedItemIds.includes(itemId)
              ? current.completedItemIds
              : [...current.completedItemIds, itemId],
          } : current)
        })
        .catch((caught: unknown) => {
          setActionError(caught instanceof Error ? caught.message : 'Unable to save lesson progress.')
        })
    },
    completeLab(itemId, blockId) {
      setActionError(null)
      void learning.completeLab(learningCourse.id, itemId, blockId)
        .then(() => {
          setCourseState((current) => current ? {
            ...current,
            completedLabIds: current.completedLabIds.includes(blockId)
              ? current.completedLabIds
              : [...current.completedLabIds, blockId],
          } : current)
        })
        .catch((caught: unknown) => {
          setActionError(caught instanceof Error ? caught.message : 'Unable to save lab completion.')
        })
    },
    submitAssignment(itemId, submission) {
      setActionError(null)
      void learning.submitArtifact(learningCourse.id, itemId, {
        liveUrl: submission.liveUrl,
        sourceUrl: submission.sourceUrl,
        note: submission.note,
      })
        .then((savedSubmission) => {
          setCourseState((current) => current ? {
            ...current,
            submissions: { ...current.submissions, [itemId]: savedSubmission },
          } : current)
        })
        .catch((caught: unknown) => {
          setActionError(caught instanceof Error ? caught.message : 'Unable to save your artifact.')
        })
    },
  }), [completedIds, completedLabIds, currentItemId, learning, submissions])

  if (authLoading || (user && courseState?.profile.id !== user.id && !loadError)) {
    return <AuthenticationLoading />
  }
  if (!user) return <Navigate replace state={{ from: location.pathname }} to="/login" />
  if (loadError || !courseState) {
    return (
      <main className="grid min-h-screen place-items-center bg-page px-5 text-foreground">
        <div className="w-full max-w-md rounded-card border border-border bg-card p-6 text-center">
          <h1 className="text-xl font-semibold">We couldn’t load your course.</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{loadError ?? 'Please sign in again.'}</p>
          <button
            className="mt-5 cursor-pointer text-sm font-semibold underline underline-offset-4"
            onClick={() => void signOut()}
            type="button"
          >
            Sign out
          </button>
        </div>
      </main>
    )
  }
  if (courseState.enrollmentStatus !== 'active') {
    return <AccessPendingPage onSignOut={signOut} />
  }

  return (
    <div className="min-h-screen bg-page text-foreground">
      <LearningTopBar
        onOpenNavigator={() => setDrawerOpen(true)}
        onSignOut={signOut}
        profile={courseState.profile}
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
          {actionError && (
            <p
              aria-live="polite"
              className="mx-auto mb-4 w-full max-w-4xl rounded-control border border-clay/30 bg-clay-soft px-3 py-2 text-xs text-foreground"
            >
              {actionError}
            </p>
          )}
          <Outlet context={context} />
        </main>
      </div>
    </div>
  )
}
