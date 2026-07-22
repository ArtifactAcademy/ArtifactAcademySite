import { ArtifactShowcase } from '../components/marketing/artifact-showcase'
import { CurriculumOverview } from '../components/marketing/curriculum-overview'
import { FAQSection } from '../components/marketing/faq-section'
import { HeroSection } from '../components/marketing/hero-section'
import { HowItWorks } from '../components/marketing/how-it-works'
import { InstructorSection } from '../components/marketing/instructor-section'
import { InteractiveLearningPreview } from '../components/marketing/interactive-learning-preview'
import { MarketingFooter } from '../components/marketing/marketing-footer'
import { MarketingHeader } from '../components/marketing/marketing-header'
import { OutcomeStrip } from '../components/marketing/outcome-strip'
import { MarketingContainer, SectionHeading } from '../components/marketing/marketing-shared'
import { WaitlistForm } from '../components/marketing/waitlist-form'

export function PublicEntryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" data-theme="dark">
      <MarketingHeader />
      <main>
        <HeroSection />
        <OutcomeStrip />
        <ArtifactShowcase />
        <HowItWorks />
        <CurriculumOverview />
        <InteractiveLearningPreview />
        <InstructorSection />
        <FAQSection />
        <section className="bg-background py-14 sm:py-22" id="join">
          <MarketingContainer>
            <div className="marketing-cta mx-auto max-w-3xl rounded-card border border-border-strong bg-card px-5 py-9 text-center shadow-panel sm:px-10 sm:py-12">
              <SectionHeading centered eyebrow="Join the founding cohort" title="Be first in line when doors open">
                <p>Leave your email and we will share founding-cohort details as the course is finalized. No spam, no pressure.</p>
              </SectionHeading>
              <div className="mx-auto max-w-xl">
                <WaitlistForm centered formId="footer-waitlist" source="landing-footer" />
              </div>
            </div>
          </MarketingContainer>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
