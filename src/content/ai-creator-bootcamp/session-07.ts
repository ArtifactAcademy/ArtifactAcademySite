import { createStandardSession } from './session-factory'

export const session07 = createStandardSession({
  id: 'shipping',
  number: 7,
  title: 'Shipping and deployment',
  lessonTitles: ['Preparing a release', 'Deployment checks'],
  artifactTitle: 'Production release',
})
