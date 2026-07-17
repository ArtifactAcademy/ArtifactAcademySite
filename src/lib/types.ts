export type ProgressStatus = 'complete' | 'current' | 'upcoming' | 'locked'
export type Accent = 'neutral' | 'success' | 'clay' | 'ai' | 'warning'

export type CourseLessonStatus = 'completed' | 'in-progress' | 'available' | 'locked'
export type ArtifactRequirementStatus = 'completed' | 'not-started' | 'locked'
export type VideoStatus = 'available' | 'unavailable'

export interface Course {
  id: string
  title: string
  eyebrow: string
  description: string
  progress: number
  sessionsComplete: number
  sessionsTotal: number
  nextLesson: string
  activeLessonId: string
  format: string
  duration: string
  instructor: string
  organization: string
}

export interface Session {
  id: string
  number: number
  label: string
  status: ProgressStatus
}

export interface Lesson {
  id: string
  title: string
  meta: string
  status: ProgressStatus
  kind: 'video' | 'reading' | 'artifact' | 'ai'
}

export interface Artifact {
  id: string
  title: string
  session: string
  type: string
  status: 'published' | 'draft' | 'review'
  accent: 'green' | 'clay' | 'violet'
}

export interface LiveSession {
  title: string
  date: string
  time: string
  instructor: string
}

export interface LessonPrompt {
  title: string
  prompt: string
}

export interface LessonCode {
  filename: string
  language: string
  code: string
}

export interface ArtifactRequirement {
  id: string
  title: string
  description: string
  status: ArtifactRequirementStatus
}

export interface CourseLesson {
  id: string
  sessionId: string
  sessionNumber: number
  position: number
  title: string
  durationMinutes: number
  kind: 'video' | 'reading' | 'artifact' | 'ai'
  status: CourseLessonStatus
  watchProgress: number
  videoStatus: VideoStatus
  objectives: string[]
  reading: string[]
  prompts: LessonPrompt[]
  codeBlocks: LessonCode[]
  instructorNote: string
  outline: string[]
}

export interface CourseSession {
  id: string
  number: number
  title: string
  status: CourseLessonStatus
  progress: number
  lessons: CourseLesson[]
  artifact: ArtifactRequirement
}

export interface CourseResource {
  id: string
  title: string
  type: string
}
