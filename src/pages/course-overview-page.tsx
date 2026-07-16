import { FileText, LockKeyhole } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { CourseHeader } from '../components/academy/course-header'
import { CurriculumAccordion } from '../components/academy/curriculum-accordion'
import { InstructorCallout } from '../components/academy/instructor-callout'
import { Card } from '../components/ui/card'
import { LoadingSkeleton } from '../components/ui/loading-skeleton'
import { StatusBadge } from '../components/ui/status-badge'
import { courseResources, courseSessions, currentCourse } from '../lib/mock-data'
import type { CourseLesson } from '../lib/types'

export function CourseOverviewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const coursePath = `/courses/${currentCourse.id}`
  const isLoading = searchParams.get('state') === 'loading'

  function openLesson(lesson: CourseLesson) {
    if (lesson.status !== 'locked') void navigate(`${coursePath}/lessons/${lesson.id}`)
  }

  if (isLoading) {
    return (
      <div aria-label="Loading course overview" className="space-y-5">
        <LoadingSkeleton className="min-h-52" lines={2} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]"><LoadingSkeleton className="min-h-96" lines={6} /><LoadingSkeleton className="min-h-72" lines={4} /></div>
      </div>
    )
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-muted">
        <Link className="hover:text-foreground" to="/courses">My courses</Link><span aria-hidden="true">/</span><span className="font-medium text-foreground">{currentCourse.title}</span>
      </nav>

      <CourseHeader course={currentCourse} onResume={() => void navigate(`${coursePath}/lessons/${currentCourse.activeLessonId}`)} />

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section aria-labelledby="course-content-heading" className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div><h2 id="course-content-heading" className="text-base font-semibold">Course content</h2><p className="mt-1 text-xs text-muted">Eight sessions · 24 lessons · 8 artifacts</p></div>
            <StatusBadge accent="success">{currentCourse.sessionsComplete} of {currentCourse.sessionsTotal} complete</StatusBadge>
          </div>
          <CurriculumAccordion onOpenLesson={openLesson} sessions={courseSessions} />
        </section>

        <aside aria-label="Course information" className="space-y-4">
          <InstructorCallout instructor={`${currentCourse.instructor} · ${currentCourse.organization}`} message="Instructor guidance and notes are included throughout this eight-session program." />
          <Card className="p-4">
            <h2 className="text-sm font-semibold">Course resources</h2>
            <div className="mt-3 space-y-1">
              {courseResources.map((resource) => (
                <div key={resource.id} className="flex items-center gap-3 rounded-control px-2 py-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-control bg-card-secondary text-muted"><FileText aria-hidden="true" className="size-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-medium">{resource.title}</span><span className="mt-0.5 block font-mono text-[10px] text-subtle">{resource.type}</span></span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-3 rounded-control border border-dashed border-border-strong p-3">
              <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-subtle" />
              <div><p className="text-xs font-medium">No locked-session resources yet</p><p className="mt-1 text-[11px] leading-4 text-muted">Materials are added as each session unlocks.</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <h2 className="text-sm font-semibold">Artifact requirements</h2>
            <p className="mt-1 text-xs leading-5 text-muted">Each session ends with one artifact requirement.</p>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3"><span className="text-xs">Completed</span><StatusBadge accent="success">3</StatusBadge></div>
            <div className="mt-2 flex items-center justify-between gap-3"><span className="text-xs">Not started</span><StatusBadge>1</StatusBadge></div>
            <div className="mt-2 flex items-center justify-between gap-3"><span className="text-xs">Locked</span><StatusBadge>4</StatusBadge></div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
