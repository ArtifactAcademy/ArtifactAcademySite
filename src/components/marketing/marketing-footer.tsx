import { Link } from 'react-router'
import { BrandMark, MarketingContainer } from './marketing-shared'

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card pt-10 sm:pt-14">
      <MarketingContainer>
        <div className="flex flex-col gap-8 pb-9 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <a aria-label="Back to the top" href="#top"><BrandMark compact /></a>
            <p className="mt-3 text-xs leading-5 text-subtle">Build with AI. Leave with proof.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">Program</p>
              <nav aria-label="Program" className="mt-3 flex flex-col gap-2.5">
                <a className="text-sm text-muted hover:text-foreground" href="#build">What you build</a>
                <a className="text-sm text-muted hover:text-foreground" href="#curriculum">Curriculum</a>
                <a className="text-sm text-muted hover:text-foreground" href="#instructor">Instructor</a>
              </nav>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">Legal</p>
              <nav aria-label="Legal" className="mt-3 flex flex-col gap-2.5">
                <Link className="text-sm text-muted hover:text-foreground" to="/privacy">Privacy</Link>
                <Link className="text-sm text-muted hover:text-foreground" to="/terms">Terms</Link>
                <Link className="text-sm text-muted hover:text-foreground" to="/login">Student login</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-border py-5 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Artifact Academy. All rights reserved.</span>
          <span>Founding cohort in development.</span>
        </div>
      </MarketingContainer>
    </footer>
  )
}
