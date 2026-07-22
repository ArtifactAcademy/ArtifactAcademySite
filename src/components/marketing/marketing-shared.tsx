import { Crown } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function MarketingContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12', className)} {...props} />
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
    <div className={cn('mb-8 max-w-2xl sm:mb-12', centered && 'mx-auto text-center')}>
      <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-clay">{eyebrow}</p>
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {children && <div className="mt-4 max-w-xl text-[15px] leading-7 text-muted">{children}</div>}
    </div>
  )
}
