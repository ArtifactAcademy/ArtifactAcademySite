import { createStandardSession } from './session-factory'

export const session02 = createStandardSession({
  id: 'prompt-patterns',
  number: 2,
  title: 'Prompt patterns',
  lessonTitles: ['Prompt anatomy', 'Testing and refining prompts'],
  artifactTitle: 'Prompt library',
  submission: {
    status: 'submitted',
    liveUrl: 'https://example.com/prompt-library',
    sourceUrl: 'https://github.com/jordan/prompt-library',
    note: 'Included the prompts I use most and examples of each output.',
  },
})
