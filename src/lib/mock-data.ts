import type { Artifact, Course, Lesson, LiveSession, Session } from './types'

export const currentCourse: Course = {
  id: 'ai-creator-bootcamp',
  title: 'AI Creator Bootcamp',
  eyebrow: 'Flagship cohort · Spring 2026',
  description: 'Build practical AI workflows, reusable interfaces, and a portfolio of shipped artifacts.',
  progress: 62,
  sessionsComplete: 3,
  sessionsTotal: 8,
  nextLesson: 'Build systems, not screens',
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
    id: 'l1',
    title: 'Composing reusable patterns',
    meta: 'AI-assisted · 22 min',
    status: 'current',
    kind: 'ai',
  },
  {
    id: 'l2',
    title: 'Component library brief',
    meta: 'Artifact assignment',
    status: 'upcoming',
    kind: 'artifact',
  },
  {
    id: 'l3',
    title: 'Instructor review checklist',
    meta: 'Reading · 8 min',
    status: 'upcoming',
    kind: 'reading',
  },
]

export const recentArtifacts: Artifact[] = [
  { id: 'a1', title: 'Portfolio landing page', session: 'Session 3', type: 'Interface', status: 'published', accent: 'green' },
  { id: 'a2', title: 'Creator workflow map', session: 'Session 2', type: 'System', status: 'review', accent: 'clay' },
  { id: 'a3', title: 'Prompt library', session: 'Session 1', type: 'Toolkit', status: 'draft', accent: 'violet' },
]

export const upcomingSession: LiveSession = {
  title: 'Component systems lab',
  date: 'Friday, July 17',
  time: '3:00 PM PT',
  instructor: 'Maya R.',
}
