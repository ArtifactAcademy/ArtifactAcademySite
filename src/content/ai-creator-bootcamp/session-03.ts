import { createStandardSession } from './session-factory'

export const session03 = createStandardSession({
  id: 'references',
  number: 3,
  title: 'Working with references',
  lessonTitles: ['Choosing useful references', 'Directing with constraints'],
  artifactTitle: 'Reference direction board',
  submission: {
    status: 'needs-revision',
    liveUrl: 'https://example.com/reference-board',
    sourceUrl: 'https://github.com/jordan/reference-board',
    note: 'Built three directions from the same product brief.',
    feedback: 'The references are useful. Tighten the rationale for direction two and make the constraints more explicit, then resubmit.',
  },
})
