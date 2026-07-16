import type {
  Artifact,
  ArtifactRequirementStatus,
  Course,
  CourseLesson,
  CourseLessonStatus,
  CourseResource,
  CourseSession,
  Lesson,
  LiveSession,
  Session,
} from './types'

export const currentCourse: Course = {
  id: 'ai-creator-bootcamp',
  title: 'AI Creator Bootcamp',
  eyebrow: 'Artifact Academy program',
  description: 'Build practical AI workflows, reusable interfaces, and a portfolio of shipped artifacts across eight instructor-led sessions.',
  progress: 62,
  sessionsComplete: 3,
  sessionsTotal: 8,
  nextLesson: 'Building with Components',
  activeLessonId: 'building-with-components',
  format: '8 instructor-led sessions',
  duration: '8 instructional hours',
  instructor: 'Alireza Alampour',
  organization: 'Artifact Academy',
}

export const sessions: Session[] = [
  { id: 's1', number: 1, label: 'Foundations', status: 'complete' },
  { id: 's2', number: 2, label: 'Prompts', status: 'complete' },
  { id: 's3', number: 3, label: 'Systems', status: 'complete' },
  { id: 's4', number: 4, label: 'Components', status: 'current' },
  { id: 's5', number: 5, label: 'Data', status: 'upcoming' },
  { id: 's6', number: 6, label: 'Launch', status: 'upcoming' },
  { id: 's7', number: 7, label: 'Refine', status: 'locked' },
  { id: 's8', number: 8, label: 'Showcase', status: 'locked' },
]

export const nextLessons: Lesson[] = [
  {
    id: 'building-with-components',
    title: 'Building with Components',
    meta: 'AI-assisted · 22 min',
    status: 'current',
    kind: 'ai',
  },
  {
    id: 'composing-patterns',
    title: 'Composing reusable patterns',
    meta: 'Video · 18 min',
    status: 'upcoming',
    kind: 'video',
  },
  {
    id: 'component-library',
    title: 'Component library',
    meta: 'Artifact assignment',
    status: 'upcoming',
    kind: 'artifact',
  },
]

export const recentArtifacts: Artifact[] = [
  { id: 'a1', title: 'Portfolio landing page', session: 'Session 3', type: 'Interface', status: 'published', accent: 'green' },
  { id: 'a2', title: 'Creator workflow map', session: 'Session 2', type: 'System', status: 'review', accent: 'clay' },
  { id: 'a3', title: 'Prompt library', session: 'Session 1', type: 'Toolkit', status: 'draft', accent: 'violet' },
]

export const upcomingSession: LiveSession = {
  title: 'Next instructor-led session',
  date: 'Mock schedule',
  time: 'Not connected',
  instructor: 'Alireza Alampour',
}

interface SessionBlueprint {
  id: string
  title: string
  lessonTitles: [string, string, string]
  status: CourseLessonStatus
  progress: number
  artifactTitle: string
  artifactStatus: ArtifactRequirementStatus
}

const sessionBlueprints: SessionBlueprint[] = [
  { id: 'foundations', title: 'Foundations of AI creation', lessonTitles: ['Mapping the creation process', 'Working with AI tools', 'Your first creator workflow'], status: 'completed', progress: 100, artifactTitle: 'Creator workflow map', artifactStatus: 'completed' },
  { id: 'prompting', title: 'Prompting for useful outputs', lessonTitles: ['Prompt anatomy', 'Building a prompt library', 'Testing and refining prompts'], status: 'completed', progress: 100, artifactTitle: 'Prompt library', artifactStatus: 'completed' },
  { id: 'systems', title: 'Build systems, not screens', lessonTitles: ['From tasks to systems', 'Mapping an interface', 'Shipping a portfolio page'], status: 'completed', progress: 100, artifactTitle: 'Portfolio landing page', artifactStatus: 'completed' },
  { id: 'components', title: 'Building with Components', lessonTitles: ['What makes a component', 'Building with Components', 'Composing reusable patterns'], status: 'in-progress', progress: 55, artifactTitle: 'Component library', artifactStatus: 'not-started' },
  { id: 'data', title: 'Data visualization', lessonTitles: ['Choosing the right view', 'Structuring visual data', 'Explaining a data story'], status: 'locked', progress: 0, artifactTitle: 'Data story', artifactStatus: 'locked' },
  { id: 'brand', title: 'Brand systems', lessonTitles: ['Defining a visual direction', 'Creating repeatable rules', 'Applying a brand system'], status: 'locked', progress: 0, artifactTitle: 'Brand system', artifactStatus: 'locked' },
  { id: 'refine', title: 'Review and refinement', lessonTitles: ['Running a useful critique', 'Prioritizing revisions', 'Preparing a final pass'], status: 'locked', progress: 0, artifactTitle: 'Critique record', artifactStatus: 'locked' },
  { id: 'showcase', title: 'Publish and showcase', lessonTitles: ['Writing the project story', 'Preparing the showcase', 'Publishing your work'], status: 'locked', progress: 0, artifactTitle: 'Published showcase', artifactStatus: 'locked' },
]

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function lessonStatus(sessionIndex: number, lessonIndex: number): CourseLessonStatus {
  if (sessionIndex < 3) return 'completed'
  if (sessionIndex > 3) return 'locked'
  if (lessonIndex === 0) return 'completed'
  if (lessonIndex === 1) return 'in-progress'
  return 'available'
}

function createLesson(blueprint: SessionBlueprint, sessionIndex: number, title: string, lessonIndex: number): CourseLesson {
  const isCurrent = sessionIndex === 3 && lessonIndex === 1
  const id = slugify(title)

  return {
    id,
    sessionId: blueprint.id,
    sessionNumber: sessionIndex + 1,
    position: lessonIndex + 1,
    title,
    durationMinutes: isCurrent ? 22 : 18,
    kind: isCurrent ? 'ai' : 'video',
    status: lessonStatus(sessionIndex, lessonIndex),
    watchProgress: isCurrent ? 55 : sessionIndex < 3 || (sessionIndex === 3 && lessonIndex === 0) ? 100 : 0,
    videoStatus: id === 'composing-reusable-patterns' ? 'unavailable' : 'available',
    objectives: isCurrent
      ? ['Recognize reusable UI patterns in a design.', 'Use AI to generate component variations.', 'Assemble a small component library artifact.']
      : [`Understand the role of ${title.toLowerCase()} in a creator workflow.`, 'Apply the lesson pattern to a small practical example.', 'Identify the next step for the session artifact.'],
    reading: isCurrent
      ? [
          'A component is any piece of interface you will reuse—a button, a card, or an input. Instead of designing each screen from scratch, define the component once and compose screens from it.',
          'Start with the shared behavior and tokens, then add only the variants the interface actually needs. This keeps the system understandable as it grows.',
        ]
      : [
          `${title} is part of this session’s practical workflow. Use the lesson video and notes to connect the concept to the session artifact.`,
          'Work in a small pass, review the result against the learning objectives, and record what you would change in the next iteration.',
        ],
    prompts: isCurrent
      ? [{ title: 'Component variants prompt', prompt: 'Design a button component with primary, secondary and ghost variants. Give sizes sm/md/lg and hover + disabled states. Return the token names you used.' }]
      : [{ title: 'Lesson practice prompt', prompt: `Help me apply “${title}” to a small creator project. Give me three concrete steps and one review question.` }],
    codeBlocks: isCurrent
      ? [{ filename: 'Button.tsx', language: 'tsx', code: 'export function Button({ variant = "primary" }) {\n  return <button className={cn(base, variants[variant])} />\n}' }]
      : [],
    instructorNote: isCurrent
      ? 'Ship a small, coherent set of variants first. Refine them when you assemble the full library.'
      : 'Keep the exercise scoped to the learning objective and capture one useful decision before moving on.',
    outline: isCurrent
      ? ['What is a component', 'Generating variants', 'Assembling the library', 'Publishing your artifact']
      : ['Lesson overview', 'Guided example', 'Practice step', 'Artifact connection'],
  }
}

export const courseSessions: CourseSession[] = sessionBlueprints.map((blueprint, sessionIndex) => ({
  id: blueprint.id,
  number: sessionIndex + 1,
  title: blueprint.title,
  status: blueprint.status,
  progress: blueprint.progress,
  lessons: blueprint.lessonTitles.map((title, lessonIndex) => createLesson(blueprint, sessionIndex, title, lessonIndex)),
  artifact: {
    id: `${blueprint.id}-artifact`,
    title: blueprint.artifactTitle,
    description: `Required to complete Session ${sessionIndex + 1}.`,
    status: blueprint.artifactStatus,
  },
}))

export const courseLessons = courseSessions.flatMap((session) => session.lessons)

export const courseResources: CourseResource[] = [
  { id: 'prompt-patterns', title: 'Prompt pattern cheatsheet', type: 'Guide' },
  { id: 'component-starter', title: 'Component starter kit', type: 'Template' },
  { id: 'session-worksheet', title: 'Session worksheet', type: 'Worksheet' },
]

export function getCourseLesson(lessonId: string | undefined) {
  return courseLessons.find((lesson) => lesson.id === lessonId)
}

export function getCourseSession(sessionId: string) {
  return courseSessions.find((session) => session.id === sessionId)
}
