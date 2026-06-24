import { AlertCircle, X } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { useOrderFormStore } from '~/stores/order-form-store'

type ErrorAlertProps = {
  message: string
  onDismiss?: () => void
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-start justify-between gap-4">
        <span>{message}</span>
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-destructive hover:text-destructive"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function StoreErrorAlert() {
  const error = useOrderFormStore((state) => state.error)
  const clearError = useOrderFormStore((state) => state.clearError)

  if (!error) return null

  return <ErrorAlert message={error} onDismiss={clearError} />
}
