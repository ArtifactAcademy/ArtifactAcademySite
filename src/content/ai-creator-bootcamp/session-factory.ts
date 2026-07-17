import type {
  LearningAssignmentItem,
  LearningSession,
  LearningSubmission,
} from '../types'

interface StandardSessionInput {
  id: string
  number: number
  title: string
  lessonTitles: [string, string]
  artifactTitle: string
  initiallyCompleted?: [boolean, boolean, boolean]
  submission?: LearningSubmission
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function createStandardSession({
  id,
  number,
  title,
  lessonTitles,
  artifactTitle,
  initiallyCompleted = [false, false, false],
  submission,
}: StandardSessionInput): LearningSession {
  const lessons = lessonTitles.map((lessonTitle, index) => {
    const lessonId = slugify(lessonTitle)
    const position = (index + 1) as 1 | 2
    return {
      id: lessonId,
      sessionId: id,
      sessionNumber: number,
      position,
      title: lessonTitle,
      kind: 'lesson' as const,
      durationMinutes: 10,
      initiallyCompleted: initiallyCompleted[index] ?? false,
      blocks: [
        {
          id: `${lessonId}-video`,
          type: 'video' as const,
          title: lessonTitle,
          durationMinutes: 10,
          status: lessonId === 'motion-with-purpose' ? 'unavailable' as const : 'available' as const,
        },
        {
          id: `${lessonId}-objectives`,
          type: 'objectives' as const,
          items: [
            `Explain how ${lessonTitle.toLowerCase()} supports an AI-assisted workflow.`,
            'Apply the idea to a focused practice step.',
            'Capture one decision to reuse in the session artifact.',
          ],
        },
        { id: `${lessonId}-heading`, type: 'heading' as const, level: 2 as const, text: 'Lesson content' },
        {
          id: `${lessonId}-paragraph-1`,
          type: 'paragraph' as const,
          text: `${lessonTitle} is one part of this session workflow. Watch the walkthrough, then connect the principle to the artifact you will ship at the end of the session.`,
        },
        {
          id: `${lessonId}-paragraph-2`,
          type: 'paragraph' as const,
          text: 'Keep the practice small enough to review in one sitting. Record what worked, what changed, and the rule you would carry into another project.',
        },
        {
          id: `${lessonId}-prompt`,
          type: 'prompt' as const,
          title: 'Practice prompt',
          prompt: `Help me apply “${lessonTitle}” to a small creator project. Give me three concrete steps and one question I should use to review the result.`,
        },
        {
          id: `${lessonId}-resources`,
          type: 'resource' as const,
          resources: [{
            id: `${lessonId}-worksheet`,
            title: 'Session practice worksheet',
            type: 'Worksheet' as const,
            description: 'A compact guide for capturing the decisions from this lesson.',
          }],
        },
        {
          id: `${lessonId}-note`,
          type: 'instructor-note' as const,
          instructor: 'Alireza Alampour · Artifact Academy',
          message: 'Stay close to the learning objective and bring one concrete decision into the session artifact.',
        },
      ],
    }
  }) as LearningSession['items'] extends [infer First, infer Second, LearningAssignmentItem]
    ? [First, Second]
    : never

  const artifactId = `${id}-artifact`
  const artifact: LearningAssignmentItem = {
    id: artifactId,
    sessionId: id,
    sessionNumber: number,
    position: 3,
    title: artifactTitle,
    kind: 'assignment',
    durationMinutes: 30,
    initiallyCompleted: initiallyCompleted[2],
    blocks: [
      { id: `${artifactId}-heading`, type: 'heading', level: 2, text: 'Assignment brief' },
      {
        id: `${artifactId}-paragraph`,
        type: 'paragraph',
        text: 'Use the work from this session to produce one reviewable artifact. Keep the scope tight enough that the instructor can understand the intent and respond with specific feedback.',
      },
      {
        id: `${artifactId}-resources`,
        type: 'resource',
        resources: [{
          id: `${artifactId}-brief`,
          title: 'Artifact brief',
          type: 'Guide',
          description: 'Submission requirements and the review checklist for this artifact.',
        }],
      },
      {
        id: `${artifactId}-note`,
        type: 'instructor-note',
        instructor: 'Alireza Alampour · Artifact Academy',
        message: 'Submit a working link and source. A short note about the decision you want reviewed is more useful than a long project summary.',
      },
      {
        id: `${artifactId}-assignment`,
        type: 'artifact-assignment',
        assignment: {
          title: artifactTitle,
          description: `Complete the Session ${number} artifact and submit it here for instructor review.`,
          deliverables: ['A public or preview URL', 'A source repository URL', 'A short note for the instructor'],
          ...(submission ? { submission } : {}),
        },
      },
    ],
  }

  return {
    id,
    number,
    title,
    items: [lessons[0], lessons[1], artifact],
  }
}
