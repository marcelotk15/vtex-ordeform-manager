import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from '~/lib/utils'

type JsonTreeProps = {
  value: unknown
}

type JsonTreeNodeProps = {
  name?: string
  value: unknown
  depth?: number
  isLast?: boolean
}

function isExpandable(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === 'object'
}

function getCollapsedPreview(value: Record<string, unknown> | unknown[]): string {
  if (Array.isArray(value)) {
    return `[${value.length}]`
  }

  const keys = Object.keys(value)
  return `{${keys.length}}`
}

function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null) {
    return <span className="text-muted-foreground">null</span>
  }

  if (typeof value === 'string') {
    return <span className="text-emerald-600 dark:text-emerald-400">&quot;{value}&quot;</span>
  }

  if (typeof value === 'number') {
    return <span className="text-sky-600 dark:text-sky-400">{value}</span>
  }

  if (typeof value === 'boolean') {
    return <span className="text-amber-600 dark:text-amber-400">{String(value)}</span>
  }

  return <span>{String(value)}</span>
}

function JsonKey({ name }: { name: string }) {
  return <span className="text-violet-600 dark:text-violet-400">&quot;{name}&quot;</span>
}

function Bracket({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>
}

function handleToggleKeyDown(event: KeyboardEvent, onToggle: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onToggle()
  }
}

function JsonTreeNode({ name, value, depth = 0, isLast = true }: JsonTreeNodeProps) {
  const expandable = isExpandable(value)
  const [expanded, setExpanded] = useState(depth < 1)

  const handleToggle = () => {
    setExpanded((current) => !current)
  }

  if (!expandable) {
    return (
      <div className="flex flex-wrap items-baseline gap-x-1 py-px">
        {name !== undefined && (
          <>
            <JsonKey name={name} />
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <PrimitiveValue value={value} />
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    )
  }

  const isArray = Array.isArray(value)
  const entries = isArray ? value.map((entry, index) => [String(index), entry] as const) : Object.entries(value)
  const isEmpty = entries.length === 0
  const openBracket = isArray ? '[' : '{'
  const closeBracket = isArray ? ']' : '}'

  if (isEmpty) {
    return (
      <div className="flex flex-wrap items-baseline gap-x-1 py-px">
        {name !== undefined && (
          <>
            <JsonKey name={name} />
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <Bracket>
          {openBracket}
          {closeBracket}
        </Bracket>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    )
  }

  return (
    <div className="py-px">
      <div className="flex flex-wrap items-baseline gap-x-1">
        <button
          type="button"
          onClick={handleToggle}
          onKeyDown={(event) => handleToggleKeyDown(event, handleToggle)}
          aria-expanded={expanded}
          className={cn(
            'inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground',
            'hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          {expanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        </button>

        {name !== undefined && (
          <>
            <JsonKey name={name} />
            <span className="text-muted-foreground">:</span>
          </>
        )}

        {expanded ? (
          <Bracket>{openBracket}</Bracket>
        ) : (
          <>
            <Bracket>{openBracket}</Bracket>
            <span className="text-muted-foreground/80">{getCollapsedPreview(value)}</span>
            <Bracket>{closeBracket}</Bracket>
          </>
        )}

        {!expanded && !isLast && <span className="text-muted-foreground">,</span>}
      </div>

      {expanded && (
        <div className="ml-4 border-l border-border/60 pl-3">
          {entries.map(([entryName, entryValue], index) => (
            <JsonTreeNode
              key={isArray ? index : entryName}
              name={isArray ? undefined : entryName}
              value={entryValue}
              depth={depth + 1}
              isLast={index === entries.length - 1}
            />
          ))}
          <div className="flex items-baseline gap-x-1 py-px">
            <Bracket>{closeBracket}</Bracket>
            {!isLast && <span className="text-muted-foreground">,</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export function JsonTree({ value }: JsonTreeProps) {
  if (!isExpandable(value)) {
    return (
      <div className="font-mono text-xs leading-relaxed text-foreground/90">
        <PrimitiveValue value={value} />
      </div>
    )
  }

  const isArray = Array.isArray(value)
  const entries = isArray ? value.map((entry, index) => [String(index), entry] as const) : Object.entries(value)
  const openBracket = isArray ? '[' : '{'
  const closeBracket = isArray ? ']' : '}'

  if (entries.length === 0) {
    return (
      <div className="font-mono text-xs leading-relaxed text-foreground/90">
        <Bracket>
          {openBracket}
          {closeBracket}
        </Bracket>
      </div>
    )
  }

  return (
    <div className="font-mono text-xs leading-relaxed text-foreground/90">
      <Bracket>{openBracket}</Bracket>
      <div className="ml-4 border-l border-border/60 pl-3">
        {entries.map(([name, entryValue], index) => (
          <JsonTreeNode
            key={isArray ? index : name}
            name={isArray ? undefined : name}
            value={entryValue}
            depth={0}
            isLast={index === entries.length - 1}
          />
        ))}
      </div>
      <Bracket>{closeBracket}</Bracket>
    </div>
  )
}
