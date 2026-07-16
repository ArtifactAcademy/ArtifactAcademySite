import { useState } from 'react'
import { ArrowLeft, Shapes } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { CodeBlock } from '../components/academy/code-block'
import { InstructorCallout } from '../components/academy/instructor-callout'
import { LessonNavigation } from '../components/academy/lesson-navigation'
import { LessonOutline } from '../components/academy/lesson-outline'
import { MarkCompletePanel } from '../components/academy/mark-complete-panel'
import { ObjectivesPanel } from '../components/academy/objectives-panel'
import { PromptBlock } from '../components/academy/prompt-block'
import { VideoPlayer } from '../components/academy/video-player'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { ProgressBar } from '../components/ui/progress-bar'
import { StatusBadge } from '../components/ui/status-badge'
import { currentCourse, getCourseLesson, getCourseSession } from '../lib/mock-data'
import type { CourseLesson } from '../lib/types'
import { NotFoundPage } from './not-found-page'

export function LessonPlayerPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = getCourseLesson(lessonId)
  const session = lesson ? getCourseSession(lesson.sessionId) : undefined
  const [mockCompletedLessonIds, setMockCompletedLessonIds] = useState<Set<string>>(() => new Set())
  const coursePath = `/courses/${currentCourse.id}`

  if (!lesson || !session) return <NotFoundPage />

  if (lesson.status === 'locked') {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Card className="max-w-md p-6 text-center">
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-card-secondary text-subtle"><Shapes aria-hidden="true" className="size-5" /></span>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-subtle">Locked lesson</p>
          <h1 className="mt-2 text-xl font-semibold">{lesson.title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Finish the current available lesson before opening this lesson.</p>
          <Button className="mt-5" onClick={() => void navigate(coursePath)}><ArrowLeft aria-hidden="true" className="size-4" />Back to course</Button>
        </Card>
      </div>
    )
  }

  const previousLesson = session.lessons[lesson.position - 2]
  const nextLesson = session.lessons[lesson.position]
  const completed = lesson.status === 'completed' || mockCompletedLessonIds.has(lesson.id)

  function openLesson(target: CourseLesson | undefined) {
    if (target && target.status !== 'locked') void navigate(`${coursePath}/lessons/${target.id}`)
  }

  return (
    <div>
      <LessonNavigation
        lesson={lesson}
        lessonCount={session.lessons.length}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
        onBack={() => void navigate(coursePath)}
        onPrevious={() => openLesson(previousLesson)}
        onNext={() => openLesson(nextLesson)}
      />

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="mx-auto w-full min-w-0 max-w-3xl space-y-5 xl:mx-0 xl:max-w-none">
          <VideoPlayer durationMinutes={lesson.durationMinutes} status={lesson.videoStatus} title={lesson.title} />

          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Session {lesson.sessionNumber} · Lesson {lesson.position}</p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{lesson.title}</h1>
              <StatusBadge accent={completed ? 'success' : lesson.status === 'in-progress' ? 'success' : 'neutral'}>{completed ? 'completed' : lesson.status}</StatusBadge>
            </div>
            <div className="mt-4 flex items-center gap-3"><ProgressBar className="max-w-xs" label="Watch progress" value={lesson.watchProgress} /><span className="shrink-0 font-mono text-[10px] text-muted">{lesson.watchProgress}% watched</span></div>
          </header>

          <ObjectivesPanel objectives={lesson.objectives} />

          <section aria-labelledby="lesson-reading-heading" className="space-y-4">
            <h2 id="lesson-reading-heading" className="text-lg font-semibold">Lesson reading</h2>
            {lesson.reading.map((paragraph) => <p key={paragraph} className="max-w-[68ch] text-sm leading-7 text-foreground">{paragraph}</p>)}
          </section>

          {lesson.prompts.map((prompt) => <PromptBlock key={prompt.title} prompt={prompt.prompt} title={prompt.title} />)}
          {lesson.codeBlocks.map((block) => <CodeBlock key={block.filename} code={block.code} filename={block.filename} language={block.language} />)}

          <InstructorCallout instructor={`${currentCourse.instructor} · ${currentCourse.organization}`} message={lesson.instructorNote} />

          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-control bg-card-secondary text-muted"><Shapes aria-hidden="true" className="size-4" /></span>
                <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">Artifact assignment</h2><StatusBadge accent={session.artifact.status === 'completed' ? 'success' : 'neutral'}>{session.artifact.status}</StatusBadge></div><p className="mt-2 text-xs leading-5 text-muted">Build and document the {session.artifact.title.toLowerCase()} required for Session {session.number}. This milestone does not publish or persist submissions.</p></div>
              </div>
              <Button className="shrink-0" size="sm" variant="secondary">Open assignment</Button>
            </div>
          </Card>

          <div className="xl:hidden"><LessonOutline lesson={lesson} onOpenLesson={openLesson} sessionLessons={session.lessons} /></div>
          <MarkCompletePanel completed={completed} hasNextLesson={Boolean(nextLesson)} onComplete={() => setMockCompletedLessonIds((current) => new Set(current).add(lesson.id))} />
        </article>

        <aside aria-label="Lesson outline" className="sticky top-24 hidden xl:block">
          <LessonOutline lesson={lesson} onOpenLesson={openLesson} sessionLessons={session.lessons} />
        </aside>
      </div>
    </div>
  )
}
