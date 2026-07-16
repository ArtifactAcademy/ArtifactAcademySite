import { Link } from 'react-router'

export function NotFoundPage() {
  return <div className="grid min-h-[60vh] place-items-center text-center"><div><p className="font-mono text-sm text-ai">404</p><h1 className="mt-2 text-3xl font-semibold">Page not found</h1><p className="mt-2 text-sm text-muted">This learning path does not exist.</p><Link className="mt-5 inline-flex h-10 items-center rounded-control bg-primary px-4 text-sm font-semibold text-primary-foreground" to="/dashboard">Return to dashboard</Link></div></div>
}
