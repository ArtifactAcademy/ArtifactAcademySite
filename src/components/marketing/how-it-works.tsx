import { programSteps } from '../../content/marketing-content'
import { MarketingContainer, SectionHeading } from './marketing-shared'

export function HowItWorks() {
  return (
    <section className="scroll-mt-16 border-y border-border bg-card py-14 sm:py-22" id="how">
      <MarketingContainer>
        <SectionHeading eyebrow="How the program works" title="A simple loop, repeated eight times" />
        <ol className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {programSteps.map((step, index) => (
            <li className="bg-background p-6" key={step.title}>
              <span className="font-mono text-xs font-medium text-clay">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </MarketingContainer>
    </section>
  )
}
