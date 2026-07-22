import { Circle } from 'lucide-react'
import { contextWindowPackingLab } from '../../content/ai-creator-bootcamp/session-01'
import { ContextWindowPackingLab } from '../labs/context-window-packing-lab'
import { MarketingContainer, SectionHeading } from './marketing-shared'

export function InteractiveLearningPreview() {
  return (
    <section className="scroll-mt-16 overflow-hidden bg-card py-24 sm:py-36 lg:py-44" id="interactive-learning">
      <MarketingContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(18rem,0.4fr)] lg:items-end lg:gap-20">
          <SectionHeading eyebrow="Interactive learning" title="Practice inside the lesson." />
          <p className="mb-10 max-w-md text-base leading-7 text-muted sm:mb-16 sm:text-lg sm:leading-8">
            Decide what belongs in a limited context window. See the trade-offs, revise your choices, and build intuition you can use on the next project.
          </p>
        </div>

        <div className="marketing-product-frame marketing-reveal overflow-hidden rounded-card border border-border-strong bg-page shadow-floating">
          <div className="flex h-11 items-center gap-2 border-b border-border bg-background px-4">
            <Circle aria-hidden="true" className="size-2.5 fill-clay text-clay" />
            <Circle aria-hidden="true" className="size-2.5 fill-success text-success" />
            <Circle aria-hidden="true" className="size-2.5 fill-ai text-ai" />
            <span className="ml-2 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">Artifact Learning OS · Session 01</span>
            <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.1em] text-success sm:block">Live preview</span>
          </div>
          <div className="p-3 sm:p-6 lg:p-10">
            <ContextWindowPackingLab config={contextWindowPackingLab} onComplete={() => undefined} />
          </div>
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Try it: add information cards, then check your answer.</p>
      </MarketingContainer>
    </section>
  )
}
