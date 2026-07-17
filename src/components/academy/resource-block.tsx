import { FileText, Layers3, PanelsTopLeft } from 'lucide-react'
import type { LearningResource } from '../../content/types'
import { Card } from '../ui/card'

interface ResourceBlockProps {
  resources: LearningResource[]
}

const icons = {
  Guide: FileText,
  Template: PanelsTopLeft,
  Worksheet: Layers3,
}

export function ResourceBlock({ resources }: ResourceBlockProps) {
  return (
    <section aria-labelledby="lesson-resources-heading">
      <h2 className="text-base font-semibold" id="lesson-resources-heading">Resources</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {resources.map((resource) => {
          const Icon = icons[resource.type]
          return (
            <Card className="flex gap-3 p-4" key={resource.id}>
              <span className="grid size-9 shrink-0 place-items-center rounded-control bg-card-secondary text-muted">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-subtle">{resource.type}</p>
                <h3 className="mt-1 text-sm font-semibold">{resource.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted">{resource.description}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
