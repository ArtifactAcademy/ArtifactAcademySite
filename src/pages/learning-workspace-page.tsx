import { useEffect } from 'react'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { useNavigate, useOutletContext, useParams } from 'react-router'
import { ArtifactSubmission } from '../components/academy/artifact-submission'
import { InstructorCallout } from '../components/academy/instructor-callout'
import { LearningControls } from '../components/academy/learning-controls'
import { ObjectivesPanel } from '../components/academy/objectives-panel'
import { PromptBlock } from '../components/academy/prompt-block'
import { ResourceBlock } from '../components/academy/resource-block'
import { VideoPlayer } from '../components/academy/video-player'
import type { LearningShellContext } from '../components/layout/learning-shell'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { StatusBadge } from '../components/ui/status-badge'
import {
  getLearningItem,
  getLearningItemState,
  learningCourse,
  learningItems,
} from '../lib/mock-data'
import { NotFoundPage } from './not-found-page'

export function LearningWorkspacePage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const {
    completedIds,
    completeItem,
    currentItemId,
    submissions,
    submitAssignment,
  } = useOutletContext<LearningShellContext>()
  const item = getLearningItem(lessonId)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [lessonId])

  if (!item) return <NotFoundPage />

  const itemIndex = learningItems.findIndex((candidate) => candidate.id === item.id)
  const previousItem = learningItems[itemIndex - 1]
  const nextItem = learningItems[itemIndex + 1]
  const itemState = getLearningItemState(item.id, completedIds)
  const submission = submissions[item.id]

  if (itemState === 'locked') {
    return (
      <div className="grid min-h-[65vh] place-items-center">
        <Card className="w-full max-w-md p-6 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-card-secondary text-subtle">
            <LockKeyhole aria-hidden="true" className="size-5" />
          </span>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Locked lesson</p>
          <h1 className="mt-2 text-xl font-semibold">{item.title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Complete the current course item before opening this lesson.</p>
          <Button className="mt-5" onClick={() => void navigate(`/learn/${currentItemId}`)}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Return to current lesson
          </Button>
        </Card>
      </div>
    )
  }

  const nextState = nextItem ? getLearningItemState(nextItem.id, completedIds) : undefined
  const completed = itemState === 'completed'
  const assignmentCanComplete = item.kind !== 'assignment' || submission?.status === 'approved'

  return (
    <article className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">
            Session {item.sessionNumber} · {item.kind === 'assignment' ? 'Artifact' : `Lesson ${item.position} of 2`}
          </p>
          <StatusBadge accent={completed ? 'success' : item.kind === 'assignment' ? 'ai' : 'neutral'} dot={itemState === 'current'}>
            {completed ? 'Completed' : 'Current'}
          </StatusBadge>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{item.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {item.kind === 'assignment' ? 'Project · Live link and source required' : `${item.durationMinutes} min video · Reading · Practice`}
        </p>
      </header>

      {item.kind === 'lesson' && (
        <VideoPlayer durationMinutes={item.durationMinutes} status={item.videoStatus} title={item.title} />
      )}

      <ObjectivesPanel objectives={item.objectives} />

      <section aria-labelledby="lesson-content-heading" className="space-y-4">
        <h2 className="text-lg font-semibold" id="lesson-content-heading">
          {item.kind === 'assignment' ? 'Assignment brief' : 'Lesson content'}
        </h2>
        {item.reading.map((paragraph) => (
          <p className="max-w-[68ch] text-sm leading-7 text-foreground" key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {item.prompts.map((prompt) => <PromptBlock key={prompt.title} prompt={prompt.prompt} title={prompt.title} />)}

      <ResourceBlock resources={item.resources} />

      <InstructorCallout
        instructor={`${learningCourse.instructor} · ${learningCourse.organization}`}
        message={item.instructorNote}
      />

      {item.assignment && (
        <ArtifactSubmission
          assignment={item.assignment}
          key={item.id}
          onSubmit={(nextSubmission) => submitAssignment(item.id, nextSubmission)}
          submission={submission}
        />
      )}

      <LearningControls
        completeDisabled={!assignmentCanComplete}
        completed={completed}
        hasNext={Boolean(nextItem)}
        hasPrevious={Boolean(previousItem)}
        nextLocked={nextState === 'locked'}
        onComplete={() => completeItem(item.id)}
        onNext={() => nextItem && void navigate(`/learn/${nextItem.id}`)}
        onPrevious={() => previousItem && void navigate(`/learn/${previousItem.id}`)}
      />
    </article>
  )
}
