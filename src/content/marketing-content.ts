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

export const programSteps = [
  { title: 'Learn', description: 'Watch a focused lesson and read concise notes—no filler or marathon lectures.' },
  { title: 'Practice', description: 'Work through interactive exercises that turn concepts into useful intuition.' },
  { title: 'Build', description: 'Ship an artifact with a live URL and source, submitted inside the lesson.' },
  { title: 'Get feedback', description: 'Your instructor reviews the work and gives you a clear next step.' },
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

export const audienceGroups = [
  { title: 'Creators and makers', description: 'You have ideas and want to turn them into real, shippable things with AI in the loop.', icon: 'pen' },
  { title: 'Career switchers', description: 'You want tangible proof of skill—not just a list of courses you have watched.', icon: 'monitor' },
  { title: 'Self-taught builders', description: 'You have learned in scattered pieces and want a structured path with real feedback.', icon: 'book' },
] as const

export const marketingFaqs = [
  {
    question: 'Is the course available now?',
    answer: 'Not yet. The AI Creator Bootcamp is in active development for its founding cohort. Joining the list is how you will hear first, with real dates and details as they are confirmed.',
  },
  {
    question: 'What does “leave with proof” mean?',
    answer: 'Every session produces a real artifact: deployed work with a live URL and source. You leave with work you can keep and share.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Founding-cohort pricing has not been finalized. Everyone on the list will receive the details before enrollment opens, and joining the list is not a commitment to enroll.',
  },
  {
    question: 'Do I need to be a programmer?',
    answer: 'No. The program is designed for creators, career switchers, and self-taught builders. You will work with AI as a collaborator and learn practical building skills as you go.',
  },
  {
    question: 'How is it taught?',
    answer: 'Through focused lessons, interactive exercises, artifacts you build and submit, and direct instructor feedback from Alireza Alampour.',
  },
  {
    question: 'How much time will it take?',
    answer: 'It is designed as eight focused, project-based sessions. Exact pacing for the founding cohort will be shared when the schedule is confirmed.',
  },
] as const
