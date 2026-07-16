export type ProgressStatus = 'complete' | 'current' | 'upcoming' | 'locked'
export type Accent = 'neutral' | 'success' | 'clay' | 'ai' | 'warning'

export interface Course {
  id: string
  title: string
  eyebrow: string
  description: string
  progress: number
  sessionsComplete: number
  sessionsTotal: number
  nextLesson: string
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
