import { ArrowRight, CalendarDays, ExternalLink, LockKeyhole } from 'lucide-react'
import { useNavigate } from 'react-router'
import { ArtifactCard } from '../components/academy/artifact-card'
import { ContinueLearningCard } from '../components/academy/continue-learning-card'
import { InstructorCallout } from '../components/academy/instructor-callout'
import { LessonRow } from '../components/academy/lesson-row'
import { SessionTimeline } from '../components/academy/session-timeline'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { ProgressBar } from '../components/ui/progress-bar'
import { StatusBadge } from '../components/ui/status-badge'
import { currentCourse, nextLessons, recentArtifacts, sessions, upcomingSession } from '../lib/mock-data'

export function DashboardPage() {
  const navigate = useNavigate()
  const coursePath = `/courses/${currentCourse.id}`
  const activeLessonPath = `${coursePath}/lessons/${currentCourse.activeLessonId}`

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Wednesday · July 15</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Good evening, Jordan.</h1>
          <p className="mt-1.5 text-sm text-muted">You’re one lesson away from shipping your next artifact.</p>
        </div>
        <StatusBadge accent="success" dot>On track</StatusBadge>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-8">
              <ContinueLearningCard courseTitle={currentCourse.title} lesson={2} lessonTitle={currentCourse.nextLesson} minutesRemaining={18} onResume={() => void navigate(activeLessonPath)} onViewCourse={() => void navigate(coursePath)} progress={68} session={4} />
            </div>
            <Card className="flex flex-col p-5 md:col-span-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-wider text-subtle">UPCOMING LIVE SESSION</p>
                <CalendarDays aria-hidden="true" className="size-4 text-subtle" />
              </div>
              <div className="flex flex-1 items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-control bg-clay-soft text-clay"><span className="text-xs font-semibold">MR</span></span>
                <div>
                  <h2 className="text-sm font-semibold">{upcomingSession.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-muted">{upcomingSession.date}<br />{upcomingSession.time} · {upcomingSession.instructor}</p>
                </div>
              </div>
              <Button className="mt-5 w-full" size="sm" variant="secondary">Add to calendar</Button>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-8"><SessionTimeline artifactsShipped={5} progress={62} sessions={sessions} /></div>
            <Card className="p-4 md:col-span-4">
              <div className="mb-2 flex items-center justify-between px-1"><h2 className="text-sm font-semibold">Next steps</h2><span className="font-mono text-[10px] text-subtle">SESSION 4</span></div>
              <div className="space-y-1">{nextLessons.map((lesson) => <LessonRow key={lesson.id} lesson={lesson} />)}</div>
            </Card>
          </div>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><h2 className="text-sm font-semibold">Recent artifacts</h2><p className="mt-1 text-xs text-muted">Your latest shipped work and drafts.</p></div>
              <Button size="sm" variant="ghost">View all <ArrowRight aria-hidden="true" className="size-3.5" /></Button>
            </div>
            <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
              {recentArtifacts.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} compact />)}
            </div>
          </Card>
        </div>

        <aside className="space-y-5" aria-label="Learning updates">
          <InstructorCallout instructor="Alireza Alampour · Artifact Academy" message="Bring your component library draft to the next instructor-led session for review." />
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between"><span className="grid size-9 place-items-center rounded-control bg-card-secondary text-subtle"><LockKeyhole aria-hidden="true" className="size-4" /></span><StatusBadge>Locked</StatusBadge></div>
            <h2 className="text-sm font-semibold">Certificate of completion</h2>
            <p className="mt-2 text-xs leading-5 text-muted">Complete all 8 AI Creator Bootcamp sessions to unlock your certificate.</p>
            <ProgressBar className="mt-5" label="Certificate progress" value={62} />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-subtle"><span>5 sessions to go</span><span>62%</span></div>
          </Card>
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between"><p className="font-mono text-[10px] tracking-wider text-subtle">PORTFOLIO</p><ExternalLink aria-hidden="true" className="size-4 text-subtle" /></div>
            <p className="text-sm font-semibold">3 of 7 artifacts published</p>
            <p className="mt-1 font-mono text-[10px] text-muted">theartifactacademy.com/jordan</p>
            <div className="mt-4 grid grid-cols-3 gap-2">{recentArtifacts.map((artifact) => <div key={artifact.id} aria-label={artifact.title} className="aspect-square rounded-control border border-border bg-[repeating-linear-gradient(45deg,var(--ds-surface-2),var(--ds-surface-2)_7px,var(--ds-elevated)_7px,var(--ds-elevated)_14px)]" />)}</div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
