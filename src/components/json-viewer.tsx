import { JsonTree } from '~/components/json-tree'
import { SectionPanel } from '~/components/section-panel'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useOrderFormStore } from '~/stores/order-form-store'

export function JsonViewer() {
  const orderForm = useOrderFormStore((state) => state.orderForm)

  if (!orderForm) return null

  return (
    <SectionPanel title="Raw JSON" description="Full orderForm payload">
      <ScrollArea className="h-[70vh] min-h-[400px] w-full overflow-hidden rounded-lg border border-border bg-muted/30 dark:bg-[oklch(0.12_0.01_65)]">
        <div className="p-4">
          <JsonTree value={orderForm} />
        </div>
      </ScrollArea>
    </SectionPanel>
  )
}
