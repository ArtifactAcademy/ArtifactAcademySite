import { createStandardSession } from './session-factory'

export const session02 = createStandardSession({
  id: 'prompt-patterns',
  number: 2,
  title: 'Prompt patterns',
  lessonTitles: ['Prompt anatomy', 'Testing and refining prompts'],
  artifactTitle: 'Prompt library',
})
