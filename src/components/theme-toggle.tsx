import { Monitor, Moon, Sun } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { useTheme } from '~/hooks/use-theme'

const themeLabels = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System theme',
} as const

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme()

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:text-primary"
      onClick={cycleTheme}
      aria-label={themeLabels[theme]}
      title={themeLabels[theme]}
    >
      <Icon className="size-4" />
    </Button>
  )
}
