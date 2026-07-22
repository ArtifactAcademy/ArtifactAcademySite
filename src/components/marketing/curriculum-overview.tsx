import { marketingCurriculum } from '../../content/marketing-content'
import { MarketingContainer, SectionHeading } from './marketing-shared'

export function CurriculumOverview() {
  return (
    <section className="scroll-mt-16 bg-background py-14 sm:py-22" id="curriculum">
      <MarketingContainer>
        <SectionHeading eyebrow="Curriculum" title="Eight sessions, one throughline">
          <p>The curriculum is being finalized for the founding cohort. Here is the current shape of the program.</p>
        </SectionHeading>
        <ol className="grid gap-3 md:grid-cols-2">
          {marketingCurriculum.map((session) => (
            <li className="flex items-start gap-3 rounded-card border border-border bg-card p-4 sm:p-5" key={session.number}>
              <span className="w-6 shrink-0 pt-0.5 font-mono text-sm font-semibold text-subtle">{String(session.number).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">{session.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{session.description}</p>
              </div>
              <span className="shrink-0 rounded-full border border-clay/30 bg-clay-soft px-2 py-1 font-mono text-[10px] font-semibold text-clay">{session.badge}</span>
            </li>
          ))}
        </ol>
      </MarketingContainer>
    </section>
  )
}
