import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { formatVtexPrice } from '~/lib/formatters'
import { cn } from '~/lib/utils'
import { useOrderFormStore } from '~/stores/order-form-store'

function TruncatedTableCell({ value, className }: { value: string; className?: string }) {
  return (
    <TableCell className="max-w-0">
      <span className={cn('block truncate', className)} title={value}>
        {value}
      </span>
    </TableCell>
  )
}

export function ItemsList() {
  const orderForm = useOrderFormStore((state) => state.orderForm)
  const selectedItemIndex = useOrderFormStore((state) => state.selectedItemIndex)
  const setSelectedItemIndex = useOrderFormStore((state) => state.setSelectedItemIndex)

  if (!orderForm) return null

  if (orderForm.items.length === 0) {
    return (
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>No items</AlertTitle>
        <AlertDescription>This orderForm has no items in the cart.</AlertDescription>
      </Alert>
    )
  }

  return (
    <ScrollArea className="w-full rounded-md border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead className="w-[22%]">Name</TableHead>
            <TableHead className="w-[14%]">SKU</TableHead>
            <TableHead className="w-[12%]">ID</TableHead>
            <TableHead className="w-12 text-right">Qty</TableHead>
            <TableHead className="w-[10%]">Seller</TableHead>
            <TableHead className="w-16 text-right">Price</TableHead>
            <TableHead className="w-[12%]">Availability</TableHead>
            <TableHead>Attachments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderForm.items.map((item, index) => (
            <TableRow
              key={item.uniqueId ?? `${item.id}-${index}`}
              className={cn('cursor-pointer', selectedItemIndex === index && 'bg-muted/60')}
              onClick={() => setSelectedItemIndex(index)}
            >
              <TableCell>{index}</TableCell>
              <TruncatedTableCell value={item.name} className="font-medium" />
              <TruncatedTableCell value={item.skuName ?? '—'} />
              <TruncatedTableCell value={item.id} className="font-mono text-xs" />
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TruncatedTableCell value={item.seller} />
              <TableCell className="text-right">{formatVtexPrice(item.sellingPrice ?? item.price)}</TableCell>
              <TruncatedTableCell value={item.availability ?? '—'} />
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.attachmentOfferings?.length ? (
                    item.attachmentOfferings.map((offering) => (
                      <Badge key={offering.name} variant="secondary">
                        {offering.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
