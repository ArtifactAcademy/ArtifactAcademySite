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
  LearningCourse,
  LearningItem,
  LearningSubmission,
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

interface LearningSessionSeed {
  id: string
  title: string
  lessonTitles: [string, string]
  artifactTitle: string
}

const learningSessionSeeds: LearningSessionSeed[] = [
  { id: 'foundations', title: 'Foundations of AI creation', lessonTitles: ['Mapping the creation process', 'Working with AI tools'], artifactTitle: 'Creator workflow map' },
  { id: 'prompt-patterns', title: 'Prompt patterns', lessonTitles: ['Prompt anatomy', 'Testing and refining prompts'], artifactTitle: 'Prompt library' },
  { id: 'references', title: 'Working with references', lessonTitles: ['Choosing useful references', 'Directing with constraints'], artifactTitle: 'Reference direction board' },
  { id: 'components', title: 'Building with components', lessonTitles: ['Component thinking', 'Building your layout'], artifactTitle: 'Ship a landing section' },
  { id: 'brand-systems', title: 'Brand systems', lessonTitles: ['Defining a visual direction', 'Applying repeatable rules'], artifactTitle: 'Brand system' },
  { id: 'motion', title: 'Motion and interaction', lessonTitles: ['Motion with purpose', 'Interaction states'], artifactTitle: 'Interactive prototype' },
  { id: 'shipping', title: 'Shipping and deployment', lessonTitles: ['Preparing a release', 'Deployment checks'], artifactTitle: 'Production release' },
  { id: 'capstone', title: 'Capstone artifact', lessonTitles: ['Building the project story', 'Presenting your work'], artifactTitle: 'Capstone showcase' },
]

const seededSubmissions: Record<string, LearningSubmission> = {
  'foundations-artifact': {
    status: 'approved',
    liveUrl: 'https://example.com/creator-workflow',
    sourceUrl: 'https://github.com/jordan/creator-workflow',
    note: 'Mapped the workflow and documented the key handoff.',
    feedback: 'Clear sequence and strong decision points. Approved.',
  },
  'prompt-patterns-artifact': {
    status: 'submitted',
    liveUrl: 'https://example.com/prompt-library',
    sourceUrl: 'https://github.com/jordan/prompt-library',
    note: 'Included the prompts I use most and examples of each output.',
  },
  'references-artifact': {
    status: 'needs-revision',
    liveUrl: 'https://example.com/reference-board',
    sourceUrl: 'https://github.com/jordan/reference-board',
    note: 'Built three directions from the same product brief.',
    feedback: 'The references are useful. Tighten the rationale for direction two and make the constraints more explicit, then resubmit.',
  },
}

function makeLearningLesson(
  seed: LearningSessionSeed,
  sessionIndex: number,
  title: string,
  position: number,
): LearningItem {
  const id = slugify(title)
  const isCurrentLesson = id === 'building-your-layout'
  const initiallyCompleted = sessionIndex < 3 || (sessionIndex === 3 && position === 1)

  return {
    id,
    sessionId: seed.id,
    sessionNumber: sessionIndex + 1,
    position,
    title,
    kind: 'lesson',
    durationMinutes: isCurrentLesson ? 12 : 10,
    initiallyCompleted,
    videoStatus: id === 'motion-with-purpose' ? 'unavailable' : 'available',
    objectives: isCurrentLesson
      ? ['Translate a reference into a clear page hierarchy.', 'Compose the layout from reusable sections.', 'Prepare the result for the session artifact.']
      : [`Explain how ${title.toLowerCase()} supports an AI-assisted workflow.`, 'Apply the idea to a focused practice step.', 'Capture one decision to reuse in the session artifact.'],
    reading: isCurrentLesson
      ? [
          'Begin with the job the page needs to do, then give each section one clear responsibility. A strong layout is a sequence of decisions, not a collection of decorations.',
          'Build with shared components and semantic tokens so the hierarchy remains consistent while the content changes. Review spacing, focus order, and the primary action before you add polish.',
        ]
      : [
          `${title} is one part of the session workflow. Watch the walkthrough, then connect the principle to the artifact you will ship at the end of the session.`,
          'Keep the practice small enough to review in one sitting. Record what worked, what changed, and the rule you would carry into another project.',
        ],
    prompts: [{
      title: isCurrentLesson ? 'Layout critique prompt' : 'Practice prompt',
      prompt: isCurrentLesson
        ? 'Act as a senior product designer. Review this layout for hierarchy, reusable structure, accessibility, and clarity. Return three specific changes in priority order.'
        : `Help me apply “${title}” to a small creator project. Give me three concrete steps and one question I should use to review the result.`,
    }],
    resources: [
      {
        id: `${id}-worksheet`,
        title: isCurrentLesson ? 'Layout planning worksheet' : 'Session practice worksheet',
        type: 'Worksheet',
        description: 'A compact guide for capturing the decisions from this lesson.',
      },
      {
        id: `${id}-template`,
        title: isCurrentLesson ? 'Landing section starter' : 'Artifact starter template',
        type: 'Template',
        description: 'A mock downloadable resource for the cohort workflow.',
      },
    ],
    instructorNote: isCurrentLesson
      ? 'Make the CTA the clear focal point and keep the first pass intentionally small. You can refine the system after the hierarchy works.'
      : 'Stay close to the learning objective and bring one concrete decision into the session artifact.',
    outline: ['Lesson overview', 'Guided example', 'Practice step', 'Artifact connection'],
  }
}

function makeLearningAssignment(seed: LearningSessionSeed, sessionIndex: number): LearningItem {
  const id = `${seed.id}-artifact`
  const submission = seededSubmissions[id]
  return {
    id,
    sessionId: seed.id,
    sessionNumber: sessionIndex + 1,
    position: 3,
    title: seed.artifactTitle,
    kind: 'assignment',
    durationMinutes: 30,
    initiallyCompleted: sessionIndex < 3,
    videoStatus: 'available',
    objectives: [
      `Ship a focused ${seed.artifactTitle.toLowerCase()}.`,
      'Document the live result and source.',
      'Use instructor feedback to make one clear revision.',
    ],
    reading: [
      'Use the work from this session to produce one reviewable artifact. Keep the scope tight enough that the instructor can understand the intent, inspect the result, and respond with specific feedback.',
    ],
    prompts: [],
    resources: [{
      id: `${id}-brief`,
      title: 'Artifact brief',
      type: 'Guide',
      description: 'Submission requirements and the review checklist for this artifact.',
    }],
    instructorNote: 'Submit a working link and source. A short note about the decision you want reviewed is more useful than a long project summary.',
    outline: ['Review the brief', 'Build the artifact', 'Check the requirements', 'Submit for feedback'],
    assignment: {
      title: seed.artifactTitle,
      description: `Complete the Session ${sessionIndex + 1} artifact and submit it here for instructor review.`,
      deliverables: ['A public or preview URL', 'A source repository URL', 'A short note for the instructor'],
      ...(submission ? { submission } : {}),
    },
  }
}

export const learningCourse: LearningCourse = {
  id: 'ai-creator-bootcamp',
  title: 'AI Creator Bootcamp',
  instructor: 'Alireza Alampour',
  organization: 'Artifact Academy',
  sessions: learningSessionSeeds.map((seed, sessionIndex) => ({
    id: seed.id,
    number: sessionIndex + 1,
    title: seed.title,
    items: [
      makeLearningLesson(seed, sessionIndex, seed.lessonTitles[0], 1),
      makeLearningLesson(seed, sessionIndex, seed.lessonTitles[1], 2),
      makeLearningAssignment(seed, sessionIndex),
    ],
  })),
}

export const learningItems = learningCourse.sessions.flatMap((session) => session.items)

export const initialCompletedLearningItemIds = learningItems
  .filter((item) => item.initiallyCompleted)
  .map((item) => item.id)

export function getLearningItem(itemId: string | undefined) {
  return learningItems.find((item) => item.id === itemId)
}

export function getLearningItemState(itemId: string, completedIds: ReadonlySet<string>) {
  if (completedIds.has(itemId)) return 'completed' as const
  const firstIncompleteItem = learningItems.find((item) => !completedIds.has(item.id))
  return firstIncompleteItem?.id === itemId ? 'current' as const : 'locked' as const
}
