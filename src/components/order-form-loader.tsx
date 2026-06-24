import { Loader2 } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle>Load orderForm</CardTitle>
        <CardDescription>Enter the VTEX account and orderForm ID to fetch checkout data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="accountName">accountName</Label>
            <Input
              id="accountName"
              placeholder="mystore"
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
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

        <Button type="button" onClick={() => void loadOrderForm()} disabled={!canLoad || loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Load orderForm
        </Button>

        {loading && <p className="text-sm text-muted-foreground">Loading orderForm...</p>}
      </CardContent>
    </Card>
  )
}
