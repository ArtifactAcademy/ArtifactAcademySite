import { Check } from 'lucide-react'
import { MarketingContainer, SectionHeading } from './marketing-shared'

const benefits = [
  'Compare snippets against a fixed token budget',
  'See the trade-offs between context and precision',
  'Build habits you can reuse in every artifact',
] as const

const contextItems = [
  { type: 'SYS', title: 'System role and guardrails', tokens: '180', tone: 'success' },
  { type: 'REF', title: 'Two reference examples', tokens: '540', tone: 'ai' },
  { type: 'DOC', title: 'Full style guide—too large', tokens: '+900', tone: 'muted' },
  { type: 'TASK', title: 'The actual request', tokens: '120', tone: 'clay' },
] as const

const toneClasses = {
  success: 'border-success/30 bg-success-soft text-success',
  ai: 'border-ai/30 bg-ai-soft text-ai',
  muted: 'border-dashed border-border-strong bg-card text-subtle',
  clay: 'border-clay/30 bg-clay-soft text-clay',
} as const

export function InteractiveLearningPreview() {
  return (
    <section className="border-y border-border bg-card py-14 sm:py-22">
      <MarketingContainer className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading eyebrow="Interactive learning" title="The Context Window Packing Lab">
            <p>You do not just watch—you practice. Decide what belongs in a limited context window and see how each choice changes the result.</p>
          </SectionHeading>
          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li className="flex items-start gap-3 text-sm leading-6 text-muted" key={benefit}>
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                  <Check aria-hidden="true" className="size-3" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <figure aria-label="Preview of the Context Window Packing Lab" className="overflow-hidden rounded-card border border-border-strong bg-background shadow-floating">
          <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-foreground sm:text-sm">
              <span aria-hidden="true" className="size-2 rounded-sm bg-ai" /> Context Window Packing Lab
            </span>
            <span className="shrink-0 font-mono text-[10px] text-muted sm:text-[11px]">1,024 / 1,200 tokens</span>
          </figcaption>
          <div className="p-4">
            <div aria-label="Context window 85 percent full" aria-valuemax={1200} aria-valuemin={0} aria-valuenow={1024} className="h-1.5 overflow-hidden rounded-full bg-card-secondary" role="progressbar">
              <div className="context-preview-progress h-full rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
              {contextItems.map((item) => (
                <div className={`flex items-center gap-2 rounded-control border p-2.5 ${toneClasses[item.tone]}`} key={item.type}>
                  <span className="w-9 shrink-0 font-mono text-[11px] font-semibold">{item.type}</span>
                  <span className="min-w-0 flex-1 truncate text-xs text-foreground sm:text-sm">{item.title}</span>
                  <span className="font-mono text-[11px] text-muted">{item.tokens}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-control border border-border bg-card-secondary p-3 text-xs leading-5 text-muted">
              Trade the full style guide for two sharp examples and you free up room—with better results.
            </p>
          </div>
        </figure>
      </MarketingContainer>
    </section>
  )
}
