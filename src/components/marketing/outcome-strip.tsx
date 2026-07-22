import { marketingOutcomes } from '../../content/marketing-content'
import { MarketingContainer } from './marketing-shared'

export function OutcomeStrip() {
  return (
    <section aria-label="Program outcomes" className="bg-card py-16 sm:py-24">
      <MarketingContainer className="marketing-reveal grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-10">
        {marketingOutcomes.map((outcome, index) => (
          <div className={index % 2 === 1 ? 'pl-2 sm:pl-6 lg:pl-0' : ''} key={outcome.value}>
            <p className="text-2xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">{outcome.value}</p>
            <p className="mt-3 max-w-48 text-xs leading-5 text-muted sm:text-sm">{outcome.detail}</p>
          </div>
        ))}
      </MarketingContainer>
    </section>
  )
}
