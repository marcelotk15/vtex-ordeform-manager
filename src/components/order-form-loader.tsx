import { Loader2 } from 'lucide-react'

import { SectionPanel } from '~/components/section-panel'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useOrderFormStore } from '~/stores/order-form-store'

export function OrderFormLoader() {
  const accountName = useOrderFormStore((state) => state.accountName)
  const orderFormId = useOrderFormStore((state) => state.orderFormId)
  const loading = useOrderFormStore((state) => state.loading)
  const setAccountName = useOrderFormStore((state) => state.setAccountName)
  const setOrderFormId = useOrderFormStore((state) => state.setOrderFormId)
  const loadOrderForm = useOrderFormStore((state) => state.loadOrderForm)

  const canLoad = accountName.trim().length > 0 && orderFormId.trim().length > 0

  return (
    <SectionPanel title="Load orderForm" description="Enter the VTEX account and orderForm ID to fetch checkout data.">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="accountName">accountName</Label>
            <Input
              id="accountName"
              placeholder="mystore"
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="orderFormId">orderFormId</Label>
            <Input
              id="orderFormId"
              placeholder="abc123def456"
              value={orderFormId}
              onChange={(event) => setOrderFormId(event.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={() => void loadOrderForm()} disabled={!canLoad || loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Load orderForm
          </Button>
        </div>
      </div>
    </SectionPanel>
  )
}
