import { ArrowUpRight, Layers3, LayoutPanelTop, Sparkles } from 'lucide-react'
import { artifactExamples } from '../../content/marketing-content'
import { MarketingContainer, SectionHeading } from './marketing-shared'

const artifactIcons = {
  layout: LayoutPanelTop,
  sparkles: Sparkles,
  layers: Layers3,
} as const

export function ArtifactShowcase() {
  return (
    <section className="scroll-mt-16 bg-background py-24 sm:py-36 lg:py-44" id="build">
      <MarketingContainer>
        <SectionHeading eyebrow="What students build" title="Work that exists beyond the lesson">
          <p>The AI Creator Bootcamp is built around making. Each artifact is deployed, reviewed by your instructor, and becomes proof you can keep.</p>
        </SectionHeading>
        <ol className="marketing-reveal border-t border-border-strong">
          {artifactExamples.map((artifact, index) => {
            const Icon = artifactIcons[artifact.icon]
            return (
              <li className="group grid gap-5 border-b border-border py-9 sm:grid-cols-[5rem_minmax(0,1fr)_minmax(14rem,0.7fr)_auto] sm:items-start sm:gap-8 sm:py-12" key={artifact.title}>
                <span className="font-mono text-xs text-subtle">0{index + 1}</span>
                <div className="flex items-start gap-4">
                  <Icon aria-hidden="true" className="mt-1 size-5 shrink-0 text-clay" />
                  <h3 className="text-3xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-5xl">{artifact.title}</h3>
                </div>
                <div>
                  <p className="text-sm leading-6 text-muted sm:text-base sm:leading-7">{artifact.description}</p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-ai">{artifact.tag}</p>
                </div>
                <ArrowUpRight aria-hidden="true" className="hidden size-5 text-subtle transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
              </li>
            )
          })}
        </ol>
      </MarketingContainer>
    </section>
  )
}
