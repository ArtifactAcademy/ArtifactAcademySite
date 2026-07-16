import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import { EmptyState } from '../components/ui/empty-state'

interface PlaceholderPageProps { title: string; description: string; icon?: LucideIcon }

export function PlaceholderPage({ title, description, icon = Construction }: PlaceholderPageProps) {
  return <div><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Milestone 0</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p><div className="mt-8 max-w-xl"><EmptyState icon={icon} title={`${title} is coming next`} description="This route is prepared for a future milestone and intentionally contains no backend behavior." /></div></div>
}
