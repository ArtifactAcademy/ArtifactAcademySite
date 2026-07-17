import type {
  Artifact,
  Course,
  CourseSession,
  Lesson,
  Session,
} from './types'

export const currentCourse: Course = {
  id: 'ai-creator-bootcamp',
  title: 'AI Creator Bootcamp',
  eyebrow: 'Artifact Academy program',
  description: 'Build practical AI workflows, reusable interfaces, and a portfolio of shipped artifacts across eight instructor-led sessions.',
  progress: 42,
  sessionsComplete: 3,
  sessionsTotal: 8,
  nextLesson: 'Packing a useful context window',
  activeLessonId: 'context-window-packing',
  format: '8 instructor-led sessions',
  duration: '8 instructional hours',
  instructor: 'Alireza Alampour',
  organization: 'Artifact Academy',
}

export const sessions: Session[] = [
  { id: 's1', number: 1, label: 'Foundations', status: 'current' },
  { id: 's2', number: 2, label: 'Prompts', status: 'locked' },
  { id: 's3', number: 3, label: 'References', status: 'locked' },
  { id: 's4', number: 4, label: 'Components', status: 'locked' },
  { id: 's5', number: 5, label: 'Brand', status: 'locked' },
  { id: 's6', number: 6, label: 'Motion', status: 'locked' },
  { id: 's7', number: 7, label: 'Shipping', status: 'locked' },
  { id: 's8', number: 8, label: 'Capstone', status: 'locked' },
]

export const nextLessons: Lesson[] = [
  { id: 'context-window-packing', title: 'Packing a useful context window', meta: 'Interactive · 12 min', status: 'current', kind: 'ai' },
  { id: 'foundations-artifact', title: 'Creator workflow map', meta: 'Artifact assignment', status: 'locked', kind: 'artifact' },
]

export const recentArtifacts: Artifact[] = [
  { id: 'a1', title: 'Creator workflow map', session: 'Session 1', type: 'System', status: 'draft', accent: 'violet' },
  { id: 'a2', title: 'Prompt library', session: 'Session 2', type: 'Toolkit', status: 'review', accent: 'clay' },
  { id: 'a3', title: 'Reference board', session: 'Session 3', type: 'Direction', status: 'published', accent: 'green' },
]

const sessionTitles = [
  'Foundations of AI creation',
  'Prompt patterns',
  'Working with references',
  'Building with components',
  'Brand systems',
]

export const courseSessions: CourseSession[] = sessionTitles.map((title, sessionIndex) => ({
  id: `gallery-session-${sessionIndex + 1}`,
  number: sessionIndex + 1,
  title,
  status: sessionIndex === 0 ? 'in-progress' : 'locked',
  progress: sessionIndex === 0 ? 50 : 0,
  lessons: ['Lesson overview', 'Guided practice', 'Review'].map((lessonTitle, lessonIndex) => ({
    id: `gallery-${sessionIndex}-${lessonIndex}`,
    sessionId: `gallery-session-${sessionIndex + 1}`,
    sessionNumber: sessionIndex + 1,
    position: lessonIndex + 1,
    title: lessonTitle,
    durationMinutes: 10,
    kind: 'video',
    status: sessionIndex === 0 && lessonIndex === 0 ? 'completed' : sessionIndex === 0 && lessonIndex === 1 ? 'in-progress' : 'locked',
    watchProgress: sessionIndex === 0 && lessonIndex === 0 ? 100 : 0,
    videoStatus: 'available',
    objectives: ['Understand the lesson concept.', 'Apply it to a focused exercise.'],
    reading: ['Development-gallery fixture content.'],
    prompts: [],
    codeBlocks: [],
    instructorNote: 'Keep the exercise focused.',
    outline: ['Overview', 'Practice', 'Review'],
  })),
  artifact: {
    id: `gallery-artifact-${sessionIndex + 1}`,
    title: `${title} artifact`,
    description: 'Development-gallery fixture.',
    status: sessionIndex === 0 ? 'not-started' : 'locked',
  },
}))
