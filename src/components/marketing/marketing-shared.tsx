import { Crown } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function MarketingContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12', className)} {...props} />
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={cn('grid place-items-center rounded-control bg-primary text-primary-foreground', compact ? 'size-7' : 'size-8')}>
        <Crown aria-hidden="true" className={compact ? 'size-3.5' : 'size-4'} />
      </span>
      <span className={cn('font-semibold tracking-tight text-foreground', compact ? 'text-sm' : 'text-[15px]')}>
        Artifact Academy
      </span>
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  centered = false,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  centered?: boolean
}) {
  return (
    <div className={cn('mb-10 max-w-4xl sm:mb-16', centered && 'mx-auto text-center')}>
      <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-clay">{eyebrow}</p>
      <h2 className="text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">{title}</h2>
      {children && <div className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{children}</div>}
    </div>
  )
}
