import { marketingOutcomes } from '../../content/marketing-content'
import { MarketingContainer } from './marketing-shared'

export function OutcomeStrip() {
  return (
    <section aria-label="Program outcomes" className="border-y border-border bg-card py-7">
      <MarketingContainer className="grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-4 lg:gap-0">
        {marketingOutcomes.map((outcome, index) => (
          <div className={index > 0 ? 'lg:border-l lg:border-border lg:pl-7' : ''} key={outcome.value}>
            <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{outcome.value}</p>
            <p className="mt-1.5 text-xs leading-5 text-muted sm:text-sm">{outcome.detail}</p>
          </div>
        ))}
      </MarketingContainer>
    </section>
  )
}
