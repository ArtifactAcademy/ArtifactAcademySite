import { learningCourse } from './ai-creator-bootcamp/course'

export const marketingOutcomes = [
  { value: '8 sessions', detail: 'Instructor-led, project-based' },
  { value: 'Real artifacts', detail: 'Deployed and reviewed, not quizzes' },
  { value: 'Shareable proof', detail: 'Published work you can show' },
  { value: 'Direct feedback', detail: 'From your instructor, on your work' },
] as const

export const artifactExamples = [
  {
    title: 'A landing page',
    description: 'A polished, deployed marketing section built from reusable components and a real spacing system.',
    tag: 'Live URL + source',
    icon: 'layout',
  },
  {
    title: 'A prompt system',
    description: 'A documented set of prompts and patterns you can reuse across your own projects with confidence.',
    tag: 'Reusable patterns',
    icon: 'sparkles',
  },
  {
    title: 'A capstone artifact',
    description: 'An end-to-end project of your own, built with everything you have learned and published as proof of your work.',
    tag: 'Final project',
    icon: 'layers',
  },
] as const

const curriculumDescriptions = [
  'How modern AI tools work, and how to think like a builder from day one.',
  'Reusable prompting structures that produce more reliable output.',
  'Use context, examples, and constraints to steer results with intent.',
  'Assemble reusable pieces into a real, deployed landing section.',
  'Give your work a consistent voice through type, color, and tone.',
  'Add purposeful movement and interactive detail without the noise.',
  'Take a project from local to live and make it easy to open.',
  'Bring everything together in an end-to-end final project.',
] as const

export const marketingCurriculum = learningCourse.sessions.map((session, index) => ({
  number: session.number,
  title: session.title,
  description: curriculumDescriptions[index] ?? '',
  badge: index === 0 ? 'Warm-up' : index === learningCourse.sessions.length - 1 ? 'Capstone' : 'Artifact',
}))

export interface MarketingSocialLink {
  label: string
  url: string
}

// Add verified social profiles here. Empty or non-HTTPS entries are not rendered.
export const marketingSocialLinks: MarketingSocialLink[] = []
