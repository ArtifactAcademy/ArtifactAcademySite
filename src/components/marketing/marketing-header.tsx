import { Link } from 'react-router'
import { BrandMark, MarketingContainer } from './marketing-shared'

const navigation = [
  { href: '#build', label: 'What you build' },
  { href: '#how', label: 'How it works' },
  { href: '#curriculum', label: 'Curriculum' },
  { href: '#instructor', label: 'Instructor' },
  { href: '#faq', label: 'FAQ' },
] as const

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <MarketingContainer className="flex h-15 items-center justify-between gap-4">
        <a aria-label="Artifact Academy home" href="#top"><BrandMark /></a>
        <nav aria-label="Landing page" className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <a className="text-sm text-muted transition-colors hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link className="hidden h-9 items-center rounded-control border border-border-strong px-3 text-sm font-medium text-foreground transition-colors hover:bg-card-secondary sm:inline-flex" to="/login">
            Student login
          </Link>
          <a className="inline-flex h-9 items-center rounded-control bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90" href="#join">
            Join the cohort
          </a>
        </div>
      </MarketingContainer>
    </header>
  )
}
