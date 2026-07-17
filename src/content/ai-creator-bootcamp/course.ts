import type { LearningCourse } from '../types'
import { session01 } from './session-01'
import { session02 } from './session-02'
import { session03 } from './session-03'
import { session04 } from './session-04'
import { session05 } from './session-05'
import { session06 } from './session-06'
import { session07 } from './session-07'
import { session08 } from './session-08'

export const learningCourse: LearningCourse = {
  id: 'ai-creator-bootcamp',
  title: 'AI Creator Bootcamp',
  instructor: 'Alireza Alampour',
  organization: 'Artifact Academy',
  sessions: [session01, session02, session03, session04, session05, session06, session07, session08],
}
