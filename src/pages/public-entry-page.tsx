import { useEffect, useState } from 'react'
import { ArtifactShowcase } from '../components/marketing/artifact-showcase'
import { CurriculumOverview } from '../components/marketing/curriculum-overview'
import { HeroSection } from '../components/marketing/hero-section'
import { InteractiveLearningPreview } from '../components/marketing/interactive-learning-preview'
import { MarketingFooter } from '../components/marketing/marketing-footer'
import { MarketingHeader } from '../components/marketing/marketing-header'
import { MarketingContainer, SectionHeading } from '../components/marketing/marketing-shared'
import { OutcomeStrip } from '../components/marketing/outcome-strip'
import { WaitlistForm } from '../components/marketing/waitlist-form'

function getPreferredTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function PublicEntryPage() {
  const [theme, setTheme] = useState(getPreferredTheme)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: light)')
    const updateTheme = () => setTheme(preference.matches ? 'light' : 'dark')
    preference.addEventListener('change', updateTheme)
    return () => preference.removeEventListener('change', updateTheme)
  }, [])

  return (
    <div className="marketing-page min-h-screen overflow-x-clip bg-background text-foreground" data-theme={theme}>
      <MarketingHeader />
      <main>
        <HeroSection />
        <OutcomeStrip />
        <ArtifactShowcase />
        <InteractiveLearningPreview />
        <CurriculumOverview />
        <section className="marketing-cta bg-card py-24 sm:py-36 lg:py-44" id="join">
          <MarketingContainer className="marketing-reveal">
            <SectionHeading centered eyebrow="Join the founding cohort" title="Build something worth showing.">
              <p>Leave your email and we will share founding-cohort details as the AI Creator Bootcamp is finalized. No spam, no pressure.</p>
            </SectionHeading>
            <div className="mx-auto max-w-2xl">
              <WaitlistForm centered formId="footer-waitlist" source="landing-footer" />
            </div>
          </MarketingContainer>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
