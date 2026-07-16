import { cn } from '../../lib/cn'

interface ProgressBarProps {
  value: number
  label?: string
  showValue?: boolean
  className?: string
}

export function ProgressBar({ value, label = 'Progress', showValue = false, className }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full', className)}>
      {showValue && (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted">{label}</span>
          <span className="font-mono text-success">{safeValue}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        className="h-1.5 overflow-hidden rounded-full bg-card-secondary"
      >
        <div className="h-full rounded-full bg-success transition-[width]" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  )
}
