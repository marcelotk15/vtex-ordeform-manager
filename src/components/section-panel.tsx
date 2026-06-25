import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

type SectionPanelProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  compact?: boolean
  className?: string
}

export function SectionPanel({ title, description, action, children, compact, className }: SectionPanelProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card shadow-[inset_0_1px_0_0_oklch(0.93_0.035_85/4%)] dark:shadow-[inset_0_1px_0_0_oklch(0.93_0.035_85/4%)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border bg-muted/20 px-4 py-3">
        <div className="min-w-0">
          <h2 className="font-heading font-medium tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn(compact ? 'p-0' : 'px-4 py-3')}>{children}</div>
    </section>
  )
}
