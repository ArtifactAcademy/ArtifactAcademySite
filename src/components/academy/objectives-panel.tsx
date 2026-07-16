import { Check } from 'lucide-react'
import { Card } from '../ui/card'

interface ObjectivesPanelProps {
  objectives: string[]
}

export function ObjectivesPanel({ objectives }: ObjectivesPanelProps) {
  return (
    <Card className="p-4 sm:p-5">
      <h2 className="font-mono text-[10px] tracking-wider text-subtle">LEARNING OBJECTIVES</h2>
      <ul className="mt-3 space-y-2.5">
        {objectives.map((objective) => <li key={objective} className="flex gap-2.5 text-sm leading-5"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />{objective}</li>)}
      </ul>
    </Card>
  )
}
