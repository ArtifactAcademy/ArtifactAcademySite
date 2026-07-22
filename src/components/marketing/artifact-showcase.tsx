import { BookOpen, Layers3, LayoutPanelTop, Monitor, PenTool, Sparkles } from 'lucide-react'
import { artifactExamples, audienceGroups } from '../../content/marketing-content'
import { MarketingContainer, SectionHeading } from './marketing-shared'

const artifactIcons = {
  layout: LayoutPanelTop,
  sparkles: Sparkles,
  layers: Layers3,
} as const

const audienceIcons = {
  pen: PenTool,
  monitor: Monitor,
  book: BookOpen,
} as const

export function ArtifactShowcase() {
  return (
    <section className="scroll-mt-16 bg-background py-14 sm:py-22" id="build">
      <MarketingContainer>
        <SectionHeading eyebrow="What you build" title="Ship real things, session by session">
          <p>The AI Creator Bootcamp is built around making. Each artifact is deployed, reviewed by your instructor, and becomes proof you can keep.</p>
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-3">
          {artifactExamples.map((artifact) => {
            const Icon = artifactIcons[artifact.icon]
            return (
              <article className="flex flex-col rounded-card border border-border bg-card p-6" key={artifact.title}>
                <span className="grid size-10 place-items-center rounded-control border border-border bg-card-secondary text-clay">
                  <Icon aria-hidden="true" className="size-4.5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{artifact.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{artifact.description}</p>
                <span className="mt-5 self-start rounded-full border border-border bg-card-secondary px-2.5 py-1 font-mono text-[11px] text-muted">{artifact.tag}</span>
              </article>
            )
          })}
        </div>

        <div className="mt-16 border-t border-border pt-14 sm:mt-22 sm:pt-20">
          <SectionHeading eyebrow="Who it’s for" title="Made for people who would rather build" />
          <div className="grid gap-4 md:grid-cols-3">
            {audienceGroups.map((group) => {
              const Icon = audienceIcons[group.icon]
              return (
                <article className="rounded-card border border-border bg-card p-6" key={group.title}>
                  <span className="grid size-10 place-items-center rounded-control border border-clay/30 bg-clay-soft text-clay">
                    <Icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-foreground">{group.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{group.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </MarketingContainer>
    </section>
  )
}
