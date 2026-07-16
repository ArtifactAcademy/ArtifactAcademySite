import { ArrowUpRight, FileCode2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { Artifact } from '../../lib/types'
import { StatusBadge } from '../ui/status-badge'

interface ArtifactCardProps {
  artifact: Artifact
  compact?: boolean
}

const accents = {
  green: 'from-success-soft to-card-secondary text-success',
  clay: 'from-clay-soft to-card-secondary text-clay',
  violet: 'from-ai-soft to-card-secondary text-ai',
}

export function ArtifactCard({ artifact, compact = false }: ArtifactCardProps) {
  const statusAccent = artifact.status === 'published' ? 'success' : artifact.status === 'review' ? 'clay' : 'ai'
  return (
    <article className={cn('group min-w-0 overflow-hidden rounded-card border border-border bg-background', compact && 'min-w-52')}>
      <div className={cn('flex h-24 items-end justify-between bg-gradient-to-br p-3', accents[artifact.accent])}>
        <span className="grid size-8 place-items-center rounded-control border border-current/20 bg-card/70"><FileCode2 aria-hidden="true" className="size-4" /></span>
        <ArrowUpRight aria-hidden="true" className="size-4 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-subtle">{artifact.session}</span>
          <StatusBadge accent={statusAccent} className="px-2 py-0.5">{artifact.status}</StatusBadge>
        </div>
        <h3 className="truncate text-xs font-semibold">{artifact.title}</h3>
        <p className="mt-1 text-[11px] text-muted">{artifact.type}</p>
      </div>
    </article>
  )
}
