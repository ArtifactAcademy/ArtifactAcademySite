import { ArrowRight, Check } from 'lucide-react'
import { MarketingContainer } from './marketing-shared'
import { WaitlistForm } from './waitlist-form'

export function HeroSection() {
  return (
    <section className="marketing-hero overflow-hidden py-12 sm:py-20 lg:py-24" id="top">
      <MarketingContainer className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-3 py-1.5 text-xs font-medium text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-clay" />
            AI Creator Bootcamp · early interest open
          </p>
          <h1 className="text-4xl font-extrabold leading-none tracking-tight text-foreground sm:text-6xl">
            Build with AI.<br />Leave with proof.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Artifact Academy is a focused, instructor-led program where you learn by building. Every session ends in a real, published artifact—not a certificate of attendance.
          </p>
          <div className="mt-7 w-full max-w-xl">
            <WaitlistForm formId="hero-waitlist" source="landing-hero" />
          </div>
        </div>

        <aside aria-label="Example student artifact" className="relative mx-auto aspect-[4/3] w-full max-w-lg">
          <div className="absolute inset-0 overflow-hidden rounded-card border border-border-strong bg-card shadow-floating">
            <div className="flex h-11 items-center gap-2 border-b border-border bg-card-secondary px-4">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-border-strong" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-border-strong" />
              <span aria-hidden="true" className="size-2.5 rounded-full bg-border-strong" />
              <span className="ml-2 truncate font-mono text-[11px] text-subtle">student-artifact.example</span>
              <span className="ml-auto hidden items-center gap-1 rounded-full bg-success-soft px-2 py-1 font-mono text-[10px] font-semibold text-success sm:inline-flex">
                <span aria-hidden="true" className="size-1 rounded-full bg-success" /> APPROVED
              </span>
            </div>
            <div className="p-5 sm:p-7">
              <div aria-hidden="true" className="h-3 w-1/2 rounded-full bg-foreground" />
              <div aria-hidden="true" className="mt-3 h-2 w-4/5 rounded-full bg-border-strong" />
              <div aria-hidden="true" className="mt-2 h-2 w-2/3 rounded-full bg-border-strong" />
              <div className="mt-5 inline-flex h-9 items-center gap-2 rounded-control bg-clay px-4 text-xs font-semibold text-white">
                Get started <ArrowRight aria-hidden="true" className="size-3.5" />
              </div>
              <div aria-hidden="true" className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                <div className="h-14 rounded-control border border-border bg-card-secondary sm:h-20" />
                <div className="h-14 rounded-control border border-border bg-card-secondary sm:h-20" />
                <div className="h-14 rounded-control border border-border bg-card-secondary sm:h-20" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-border bg-card-secondary px-4 py-3">
              <span className="grid size-7 place-items-center rounded-full bg-clay text-xs font-semibold text-white">A</span>
              <span className="text-xs text-muted"><strong className="font-semibold text-foreground">Alireza</strong> approved this artifact</span>
              <Check aria-hidden="true" className="ml-auto size-4 text-success" />
            </div>
          </div>
          <span className="absolute -bottom-3 left-4 rounded-full bg-clay px-3 py-2 text-xs font-semibold text-white shadow-panel lg:-left-3">
            Session 4 · student artifact
          </span>
        </aside>
      </MarketingContainer>
    </section>
  )
}
