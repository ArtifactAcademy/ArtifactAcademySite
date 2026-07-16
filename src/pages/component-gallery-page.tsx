import type { ReactNode } from 'react'
import { Award, Clock3, Layers3 } from 'lucide-react'
import { ArtifactCard } from '../components/academy/artifact-card'
import { ContinueLearningCard } from '../components/academy/continue-learning-card'
import { CodeBlock } from '../components/academy/code-block'
import { CourseHeader } from '../components/academy/course-header'
import { CourseCard } from '../components/academy/course-card'
import { CurriculumAccordion } from '../components/academy/curriculum-accordion'
import { InstructorCallout } from '../components/academy/instructor-callout'
import { LessonRow } from '../components/academy/lesson-row'
import { MarkCompletePanel } from '../components/academy/mark-complete-panel'
import { ObjectivesPanel } from '../components/academy/objectives-panel'
import { PromptBlock } from '../components/academy/prompt-block'
import { SessionTimeline } from '../components/academy/session-timeline'
import { StatCard } from '../components/academy/stat-card'
import { Button } from '../components/ui/button'
import { EmptyState } from '../components/ui/empty-state'
import { LoadingSkeleton } from '../components/ui/loading-skeleton'
import { ProgressBar } from '../components/ui/progress-bar'
import { StatusBadge } from '../components/ui/status-badge'
import { courseSessions, currentCourse, nextLessons, recentArtifacts, sessions } from '../lib/mock-data'

const previewAction = () => undefined

export function ComponentGalleryPage() {
  return (
    <div className="space-y-10">
      <div><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ai">Development route</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Artifact Learning OS components</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Reusable patterns and semantic states for product surfaces. Green communicates progress, clay communicates people, and violet communicates AI assistance.</p></div>
      <GallerySection title="Modes"><div className="grid gap-4 md:grid-cols-3"><ModeCard label="Dark product" theme="dark" /><ModeCard label="Light product" theme="light" /><ModeCard label="Warm marketing" theme="light" mode="marketing" /></div></GallerySection>
      <GallerySection title="Actions and status"><div className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-card p-5"><Button>Primary action</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><StatusBadge accent="success" dot>Completed</StatusBadge><StatusBadge accent="clay">Instructor</StatusBadge><StatusBadge accent="ai">AI-assisted</StatusBadge><StatusBadge accent="warning">Needs attention</StatusBadge></div></GallerySection>
      <GallerySection title="Learning progress"><div className="grid gap-5 xl:grid-cols-2"><ContinueLearningCard courseTitle="AI Creator Bootcamp" lesson={2} lessonTitle="Building with Components" minutesRemaining={18} onResume={previewAction} onViewCourse={previewAction} progress={68} session={4} /><CourseCard course={currentCourse} onOpen={previewAction} /><div className="xl:col-span-2"><SessionTimeline artifactsShipped={5} progress={62} sessions={sessions} /></div></div></GallerySection>
      <GallerySection title="Course overview patterns"><div className="space-y-5"><CourseHeader course={currentCourse} onResume={previewAction} /><CurriculumAccordion onOpenLesson={previewAction} sessions={courseSessions.slice(0, 5)} /></div></GallerySection>
      <GallerySection title="Lesson player patterns"><div className="grid gap-5 lg:grid-cols-2"><ObjectivesPanel objectives={courseSessions[3]?.lessons[1]?.objectives ?? []} /><MarkCompletePanel completed={false} hasNextLesson onComplete={previewAction} /><div className="lg:col-span-2"><CodeBlock code={'export function Button() {\n  return <button>Continue</button>\n}'} filename="Button.tsx" language="tsx" /></div></div></GallerySection>
      <GallerySection title="Rows, stats, and artifacts"><div className="grid gap-5 md:grid-cols-3"><div className="rounded-card border border-border bg-card p-3 md:col-span-2">{nextLessons.map((lesson) => <LessonRow key={lesson.id} lesson={lesson} />)}</div><StatCard accent="success" helper="of 8 sessions" icon={Award} label="Sessions complete" value="3" />{recentArtifacts.map((artifact) => <ArtifactCard key={artifact.id} artifact={artifact} />)}<StatCard accent="ai" helper="this week" icon={Clock3} label="Learning time" value="4h 20m" /><StatCard accent="clay" helper="component state" icon={Layers3} label="Instructor notes" value="3" /></div></GallerySection>
      <GallerySection title="Guidance and prompt patterns"><div className="grid gap-5 lg:grid-cols-2"><InstructorCallout instructor="Alireza Alampour · Artifact Academy" message="Bring your component library draft to the next instructor-led session for review." /><PromptBlock title="AI critique prompt" prompt={'Review this interface for hierarchy, interaction clarity, and accessibility.\nReturn three specific improvements.'} /></div></GallerySection>
      <GallerySection title="Empty and loading states"><div className="grid gap-5 md:grid-cols-2"><EmptyState actionLabel="Browse lessons" /><LoadingSkeleton /></div><div className="mt-5 max-w-md rounded-card border border-border bg-card p-5"><ProgressBar label="Course progress" showValue value={62} /></div></GallerySection>
    </div>
  )
}

function GallerySection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="mb-4 text-lg font-semibold">{title}</h2>{children}</section>
}

function ModeCard({ label, theme, mode }: { label: string; theme: 'dark' | 'light'; mode?: 'marketing' }) {
  const modeProps = mode ? { 'data-mode': mode } : {}
  return <div data-theme={theme} {...modeProps} className="rounded-card border border-border bg-background p-4 text-foreground shadow-panel"><div className="rounded-control border border-border bg-card p-4"><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted">Semantic surface preview</p><div className="mt-4 flex gap-2"><span className="h-2 flex-1 rounded-full bg-success" /><span className="h-2 flex-1 rounded-full bg-clay" /><span className="h-2 flex-1 rounded-full bg-ai" /></div></div></div>
}
