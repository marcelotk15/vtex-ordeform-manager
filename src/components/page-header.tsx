import { ThemeToggle } from '~/components/theme-toggle'

export function PageHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-primary/40 via-border to-accent/40" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">VTEX OrderForm Editor</h1>
          <p className="text-xs text-muted-foreground">Checkout attachment editor</p>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
