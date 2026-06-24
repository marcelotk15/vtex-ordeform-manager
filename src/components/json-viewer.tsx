import { ScrollArea } from '~/components/ui/scroll-area'
import { useOrderFormStore } from '~/stores/order-form-store'

export function JsonViewer() {
  const orderForm = useOrderFormStore((state) => state.orderForm)

  if (!orderForm) return null

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border bg-muted/30 p-4">
      <pre className="text-xs leading-relaxed whitespace-pre-wrap break-words">
        {JSON.stringify(orderForm, null, 2)}
      </pre>
    </ScrollArea>
  )
}
