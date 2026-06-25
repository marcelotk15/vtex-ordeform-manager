import { ExternalLink } from 'lucide-react'

const REPO_URL = 'https://github.com/marcelotk15/vtex-ordeform-manager'

export function PageFooter() {
  return (
    <footer className="relative mt-auto border-t border-border">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-accent/40 via-border to-primary/40" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:text-left">
        <p className="text-xs text-muted-foreground">
          Made with{' '}
          <span className="text-accent" aria-hidden="true">
            ❤️
          </span>{' '}
          by Marcelo <span className="font-mono text-[0.7rem] text-foreground/80">teka</span> Oliveira
        </p>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  )
}
