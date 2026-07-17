import type { VideoStatus } from '../lib/types'

export type LearningItemState = 'completed' | 'current' | 'locked'
export type SubmissionStatus = 'submitted' | 'needs-revision' | 'approved'

export interface LearningResource {
  id: string
  title: string
  type: 'Guide' | 'Template' | 'Worksheet'
  description: string
}

export interface LearningSubmission {
  status: SubmissionStatus
  liveUrl: string
  sourceUrl: string
  note: string
  feedback?: string
}

export interface LearningAssignment {
  title: string
  description: string
  deliverables: string[]
}

interface ContentBlockBase {
  id: string
}

export interface ParagraphBlock extends ContentBlockBase {
  type: 'paragraph'
  text: string
}

export interface HeadingBlock extends ContentBlockBase {
  type: 'heading'
  level: 2 | 3
  text: string
}

export interface VideoBlock extends ContentBlockBase {
  type: 'video'
  title: string
  durationMinutes: number
  status: VideoStatus
}

export interface ObjectivesBlock extends ContentBlockBase {
  type: 'objectives'
  items: string[]
}

export interface PromptBlockContent extends ContentBlockBase {
  type: 'prompt'
  title: string
  prompt: string
}

export interface ResourceBlockContent extends ContentBlockBase {
  type: 'resource'
  resources: LearningResource[]
}

export interface InstructorNoteBlock extends ContentBlockBase {
  type: 'instructor-note'
  instructor: string
  message: string
}

export interface ComprehensionOption {
  id: string
  label: string
}

export interface ComprehensionCheckBlock extends ContentBlockBase {
  type: 'comprehension-check'
  question: string
  options: ComprehensionOption[]
  correctOptionId: string
  explanation: string
}

export interface ContextWindowCard {
  id: string
  title: string
  size: number
  impact: 'helpful' | 'harmful'
  explanation: string
}

export interface ContextWindowPackingLabConfig {
  id: string
  title: string
  description: string
  capacity: number
  cards: ContextWindowCard[]
  recommendedCardIds: string[]
}

export interface InteractiveLabBlockContent extends ContentBlockBase {
  type: 'interactive-lab'
  lab: 'context-window-packing'
  config: ContextWindowPackingLabConfig
}

export interface ArtifactAssignmentBlock extends ContentBlockBase {
  type: 'artifact-assignment'
  assignment: LearningAssignment
}

export type LearningContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | VideoBlock
  | ObjectivesBlock
  | PromptBlockContent
  | ResourceBlockContent
  | InstructorNoteBlock
  | ComprehensionCheckBlock
  | InteractiveLabBlockContent
  | ArtifactAssignmentBlock

interface LearningItemBase {
  id: string
  sessionId: string
  sessionNumber: number
  position: number
  title: string
  durationMinutes: number
  blocks: LearningContentBlock[]
}

export interface LearningLesson extends LearningItemBase {
  kind: 'lesson'
  position: 1 | 2
}

export interface LearningAssignmentItem extends LearningItemBase {
  kind: 'assignment'
  position: 3
}

export type LearningItem = LearningLesson | LearningAssignmentItem

export interface LearningSession {
  id: string
  number: number
  title: string
  items: [LearningLesson, LearningLesson, LearningAssignmentItem]
}

export interface LearningCourse {
  id: string
  title: string
  instructor: string
  organization: string
  sessions: [
    LearningSession,
    LearningSession,
    LearningSession,
    LearningSession,
    LearningSession,
    LearningSession,
    LearningSession,
    LearningSession,
  ]
}
