import type {
  LearningContentBlock,
  LearningSubmission,
} from '../../content/types'
import { ArtifactSubmission } from '../academy/artifact-submission'
import { InstructorCallout } from '../academy/instructor-callout'
import { ObjectivesPanel } from '../academy/objectives-panel'
import { PromptBlock } from '../academy/prompt-block'
import { ResourceBlock } from '../academy/resource-block'
import { VideoPlayer } from '../academy/video-player'
import { InteractiveLabBlock } from '../labs/interactive-lab-block'
import { ComprehensionCheckBlock } from './comprehension-check-block'

interface LearningContentProps {
  blocks: LearningContentBlock[]
  completedLabIds: ReadonlySet<string>
  submission: LearningSubmission | undefined
  onLabComplete: (blockId: string) => void
  onSubmit: (submission: LearningSubmission) => void
}

export function LearningContent({
  blocks,
  completedLabIds,
  submission,
  onLabComplete,
  onSubmit,
}: LearningContentProps) {
  return blocks.map((block) => {
    switch (block.type) {
      case 'paragraph':
        return <p className="max-w-[68ch] text-sm leading-7 text-foreground" key={block.id}>{block.text}</p>
      case 'heading':
        return block.level === 2
          ? <h2 className="text-lg font-semibold" key={block.id}>{block.text}</h2>
          : <h3 className="text-base font-semibold" key={block.id}>{block.text}</h3>
      case 'video':
        return <VideoPlayer durationMinutes={block.durationMinutes} key={block.id} status={block.status} title={block.title} />
      case 'objectives':
        return <ObjectivesPanel key={block.id} objectives={block.items} />
      case 'prompt':
        return <PromptBlock key={block.id} prompt={block.prompt} title={block.title} />
      case 'resource':
        return <ResourceBlock key={block.id} resources={block.resources} />
      case 'instructor-note':
        return <InstructorCallout instructor={block.instructor} key={block.id} message={block.message} />
      case 'comprehension-check':
        return <ComprehensionCheckBlock block={block} key={block.id} />
      case 'interactive-lab':
        return (
          <div key={block.id}>
            <InteractiveLabBlock block={block} onComplete={() => onLabComplete(block.id)} />
            {completedLabIds.has(block.id) && <p className="mt-2 font-mono text-[10px] text-success">LAB COMPLETE · LESSON CAN BE COMPLETED</p>}
          </div>
        )
      case 'artifact-assignment':
        return <ArtifactSubmission assignment={block.assignment} key={block.id} onSubmit={onSubmit} submission={submission} />
    }
  })
}
