import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { useTheme } from '~/hooks/use-theme'

const toastStyle = {
  '--normal-bg': 'var(--toast-bg)',
  '--normal-text': 'var(--toast-foreground)',
  '--normal-border': 'var(--toast-border)',
  '--success-bg': 'var(--toast-bg)',
  '--success-text': 'var(--toast-foreground)',
  '--success-border': 'var(--toast-border)',
  '--error-bg': 'var(--toast-bg)',
  '--error-text': 'var(--toast-foreground)',
  '--error-border': 'var(--toast-border)',
  '--warning-bg': 'var(--toast-bg)',
  '--warning-text': 'var(--toast-foreground)',
  '--warning-border': 'var(--toast-border)',
  '--info-bg': 'var(--toast-bg)',
  '--info-text': 'var(--toast-foreground)',
  '--info-border': 'var(--toast-border)',
  '--border-radius': 'var(--radius)',
} as CSSProperties

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-muted-foreground" />,
        warning: <TriangleAlertIcon className="size-4 text-accent" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-muted-foreground" />,
      }}
      style={toastStyle}
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
