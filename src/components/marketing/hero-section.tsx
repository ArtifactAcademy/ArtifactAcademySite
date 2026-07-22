import { ArrowDownRight } from 'lucide-react'
import { MarketingContainer } from './marketing-shared'
import { WaitlistForm } from './waitlist-form'

export function HeroSection() {
  return (
    <section className="marketing-hero relative isolate flex min-h-[90svh] overflow-hidden" id="top">
      <div aria-hidden="true" className="marketing-hero-placeholder absolute inset-0">
        <span className="artifact-silhouette artifact-silhouette-one" />
        <span className="artifact-silhouette artifact-silhouette-two" />
        <span className="artifact-silhouette artifact-silhouette-three" />
      </div>
      <picture aria-hidden="true" className="absolute inset-0">
        <source
          media="(prefers-color-scheme: light)"
          sizes="100vw"
          srcSet="/marketing/artifact-constellation-light-960.webp 960w, /marketing/artifact-constellation-light.webp 1672w"
          type="image/webp"
        />
        <img
          alt=""
          className="marketing-hero-media size-full object-cover"
          decoding="async"
          fetchPriority="high"
          height="941"
          loading="eager"
          sizes="100vw"
          src="/marketing/artifact-constellation.webp"
          srcSet="/marketing/artifact-constellation-960.webp 960w, /marketing/artifact-constellation.webp 1672w"
          width="1672"
        />
      </picture>
      <div aria-hidden="true" className="marketing-hero-scrim absolute inset-0" />

      <MarketingContainer className="relative flex flex-1 items-end pb-12 pt-28 sm:pb-16 sm:pt-36 lg:items-center lg:pb-20 lg:pt-32">
        <div className="marketing-hero-copy w-full max-w-5xl">
          <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-clay sm:mb-7">
            Practical AI education
          </p>
          <h1 className="text-[clamp(2.65rem,8vw,7.75rem)] font-semibold leading-[0.84] tracking-[-0.065em] text-foreground">
            Build with AI.<br />Leave with proof.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:mt-9 sm:text-xl sm:leading-8">
            Learn modern AI workflows by creating real projects, receiving focused feedback, and publishing work you can show.
          </p>
          <div className="mt-8 max-w-2xl sm:mt-10">
            <WaitlistForm formId="hero-waitlist" source="landing-hero" variant="hero" />
          </div>
          <a className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground" href="#interactive-learning">
            See how it works <ArrowDownRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </MarketingContainer>
    </section>
  )
}
