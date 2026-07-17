import { learningCourse } from './ai-creator-bootcamp/course'
import type {
  ArtifactAssignmentBlock,
  InteractiveLabBlockContent,
  LearningItem,
} from './types'

export { learningCourse }

export const learningItems = learningCourse.sessions.flatMap((session) => session.items)

export function getLearningItem(itemId: string | undefined) {
  return learningItems.find((item) => item.id === itemId)
}

export function getLearningItemState(itemId: string, completedIds: ReadonlySet<string>) {
  if (completedIds.has(itemId)) return 'completed' as const
  const firstIncompleteItem = learningItems.find((item) => !completedIds.has(item.id))
  return firstIncompleteItem?.id === itemId ? 'current' as const : 'locked' as const
}

export function getArtifactAssignmentBlock(item: LearningItem) {
  return item.blocks.find((block): block is ArtifactAssignmentBlock => block.type === 'artifact-assignment')
}

export function getInteractiveLabBlocks(item: LearningItem) {
  return item.blocks.filter((block): block is InteractiveLabBlockContent => block.type === 'interactive-lab')
}
