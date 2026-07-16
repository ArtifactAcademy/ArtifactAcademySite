import { cn } from '../../lib/cn'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading content" className={cn('rounded-card border border-border bg-card p-4', className)}>
      <div className="mb-4 h-20 animate-[shimmer_1.4s_ease-in-out_infinite] rounded-control bg-[linear-gradient(90deg,var(--ds-surface-2)_25%,var(--ds-elevated)_37%,var(--ds-surface-2)_63%)] bg-[length:200%_100%]" />
      <div className="space-y-2.5">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className="h-2.5 animate-[shimmer_1.4s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,var(--ds-surface-2)_25%,var(--ds-elevated)_37%,var(--ds-surface-2)_63%)] bg-[length:200%_100%]"
            style={{ width: `${92 - index * 16}%` }}
          />
        ))}
      </div>
    </div>
  )
}
