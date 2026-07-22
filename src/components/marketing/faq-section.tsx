import { Plus } from 'lucide-react'
import { marketingFaqs } from '../../content/marketing-content'
import { MarketingContainer, SectionHeading } from './marketing-shared'

export function FAQSection() {
  return (
    <section className="scroll-mt-16 bg-background py-14 sm:py-22" id="faq">
      <MarketingContainer className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Honest answers, launch-stage" />
        <div className="space-y-2.5">
          {marketingFaqs.map((faq, index) => (
            <details className="group rounded-card border border-border bg-card" key={faq.question} open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-left font-medium text-foreground sm:px-5 [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span className="grid size-7 shrink-0 place-items-center rounded-control border border-border bg-card-secondary text-muted transition-transform group-open:rotate-45">
                  <Plus aria-hidden="true" className="size-4" />
                </span>
              </summary>
              <p className="px-4 pb-5 text-sm leading-6 text-muted sm:px-5">{faq.answer}</p>
            </details>
          ))}
        </div>
      </MarketingContainer>
    </section>
  )
}
