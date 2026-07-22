import { ArrowLeft, CircleAlert } from 'lucide-react'
import { Link } from 'react-router'
import { BrandMark, MarketingContainer } from '../components/marketing/marketing-shared'

const legalContent = {
  privacy: {
    title: 'Privacy starter notice',
    summary: 'This editable starter explains the early-interest form at a high level. It has not been legally reviewed and must be replaced or approved before a full public launch.',
    sections: [
      ['What the form collects', 'The early-interest form collects your email address, consent time, form source, and any UTM campaign values present in the page URL. It does not ask for age, phone number, address, or sensitive information.'],
      ['How the information is used', 'The intended use is to send Artifact Academy launch and founding-cohort updates. No marketing-email provider is connected yet.'],
      ['Your choices', 'Launch emails should include an unsubscribe option. Add the approved privacy contact and data-retention process here before launch.'],
    ],
  },
  terms: {
    title: 'Terms starter notice',
    summary: 'This is editable starter content for counsel or the site owner. It has not been legally reviewed and is not presented as final terms.',
    sections: [
      ['Early-interest list', 'Joining the list records interest only. It does not enroll you in a course, reserve a seat, or create a payment obligation.'],
      ['Program details', 'Dates, schedule, availability, and pricing are still being finalized. Final enrollment terms should be published before enrollment opens.'],
      ['Site use', 'Add the approved acceptable-use, intellectual-property, limitation-of-liability, governing-law, and contact provisions here before launch.'],
    ],
  },
} as const

export function LegalPage({ type }: { type: keyof typeof legalContent }) {
  const content = legalContent[type]

  return (
    <div className="min-h-screen bg-background text-foreground" data-theme="dark">
      <header className="border-b border-border bg-card">
        <MarketingContainer className="flex h-16 items-center justify-between gap-4">
          <Link to="/"><BrandMark compact /></Link>
          <Link className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground" to="/">
            <ArrowLeft aria-hidden="true" className="size-4" /> Back to landing page
          </Link>
        </MarketingContainer>
      </header>
      <main className="py-12 sm:py-18">
        <MarketingContainer className="max-w-3xl">
          <div className="rounded-card border border-clay/30 bg-clay-soft p-4 text-sm leading-6 text-foreground">
            <p className="flex items-center gap-2 font-semibold text-clay"><CircleAlert aria-hidden="true" className="size-4" /> Editable legal placeholder</p>
            <p className="mt-1 text-muted">Not legal advice. This content still requires review and approval.</p>
          </div>
          <h1 className="mt-9 text-3xl font-bold tracking-tight sm:text-4xl">{content.title}</h1>
          <p className="mt-4 text-base leading-7 text-muted">{content.summary}</p>
          <div className="mt-10 space-y-8">
            {content.sections.map(([heading, body]) => (
              <section key={heading}>
                <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
              </section>
            ))}
          </div>
        </MarketingContainer>
      </main>
    </div>
  )
}
