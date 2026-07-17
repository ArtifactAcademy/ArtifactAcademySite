import type { InteractiveLabBlockContent } from '../../content/types'
import { ContextWindowPackingLab } from './context-window-packing-lab'

interface InteractiveLabBlockProps {
  block: InteractiveLabBlockContent
  onComplete: () => void
}

export function InteractiveLabBlock({ block, onComplete }: InteractiveLabBlockProps) {
  switch (block.lab) {
    case 'context-window-packing':
      return <ContextWindowPackingLab config={block.config} onComplete={onComplete} />
  }
}
