import { MarketingContainer, SectionHeading } from './marketing-shared'

const instructorDetails = ['Lead instructor', 'Direct artifact feedback', 'Project-first learning'] as const

export function InstructorSection() {
  return (
    <section className="scroll-mt-16 border-b border-border bg-card py-14 sm:py-22" id="instructor">
      <MarketingContainer className="grid items-center gap-8 md:grid-cols-[17rem_1fr] md:gap-12">
        <div className="relative aspect-square w-full max-w-68 overflow-hidden rounded-card border border-border bg-card-secondary">
          <div className="grid size-full place-items-center text-6xl font-bold tracking-tight text-clay" aria-hidden="true">AA</div>
          <span className="absolute bottom-3 left-3 rounded-control border border-border bg-background px-2 py-1 font-mono text-[10px] text-subtle">Photo coming soon</span>
        </div>
        <div>
          <SectionHeading eyebrow="Your instructor" title="Alireza Alampour">
            <p className="mb-3 text-sm font-medium text-clay">Lead instructor · Artifact Academy</p>
            <p>Alireza leads the AI Creator Bootcamp with a project-first approach. Lessons pair practical building work with direct, specific feedback on the artifacts you submit.</p>
          </SectionHeading>
          <ul className="-mt-4 flex flex-wrap gap-2 sm:-mt-7">
            {instructorDetails.map((detail) => (
              <li className="rounded-full border border-border-strong bg-background px-3 py-2 text-xs font-medium text-muted" key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </MarketingContainer>
    </section>
  )
}
