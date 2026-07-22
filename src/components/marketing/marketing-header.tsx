import { Link } from 'react-router'
import { BrandMark, MarketingContainer } from './marketing-shared'

const navigation = [
  { href: '#build', label: 'What you build' },
  { href: '#interactive-learning', label: 'How it works' },
  { href: '#curriculum', label: 'Curriculum' },
] as const

export function MarketingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <MarketingContainer className="mt-3 flex h-14 items-center justify-between gap-3 rounded-full border border-border/70 bg-background/75 px-3 shadow-panel backdrop-blur-xl sm:mt-4 sm:h-16 sm:px-5 lg:px-6">
        <a aria-label="Artifact Academy home" href="#top"><BrandMark compact /></a>
        <nav aria-label="Landing page" className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <a className="text-sm text-muted transition-colors hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link className="inline-flex h-9 items-center rounded-control px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-card-secondary sm:px-3 sm:text-sm" to="/login">
            Student login
          </Link>
          <a className="hidden h-9 items-center rounded-control bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex" href="#join">
            Join the cohort
          </a>
        </div>
      </MarketingContainer>
    </header>
  )
}
