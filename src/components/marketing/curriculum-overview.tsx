import { marketingCurriculum } from '../../content/marketing-content'
import { MarketingContainer, SectionHeading } from './marketing-shared'

export function CurriculumOverview() {
  return (
    <section className="scroll-mt-16 bg-background py-20 sm:py-28 lg:py-32" id="curriculum">
      <MarketingContainer className="grid gap-12 lg:grid-cols-[minmax(16rem,0.55fr)_minmax(0,1fr)] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Curriculum" title="Eight sessions. One throughline.">
            <p>The curriculum is being finalized for the founding cohort. Here is the current shape of the program.</p>
          </SectionHeading>
        </div>
        <ol className="marketing-reveal border-t border-border-strong">
          {marketingCurriculum.map((session) => (
            <li className="grid gap-4 border-b border-border py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-6 sm:py-6" key={session.number}>
              <span className="shrink-0 pt-1 font-mono text-xs font-semibold text-subtle">{String(session.number).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">{session.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{session.description}</p>
              </div>
              <span className="self-start font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-clay">{session.badge}</span>
            </li>
          ))}
        </ol>
      </MarketingContainer>
    </section>
  )
}
