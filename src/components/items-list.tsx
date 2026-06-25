import type { KeyboardEvent } from 'react'

import { AlertCircle } from 'lucide-react'

import type { OrderFormItem } from '~/types/order-form'

import { SectionPanel } from '~/components/section-panel'
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

function getRefId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function IdWithRefLine({ id, refId }: { id: string; refId?: string }) {
  return (
    <span className="block truncate font-mono text-muted-foreground" title={refId ? `${id} · Ref. ID ${refId}` : id}>
      <span>{id}</span>
      {refId ? (
        <>
          <span className="text-muted-foreground/50"> · </span>
          <span>Ref. ID {refId}</span>
        </>
      ) : null}
    </span>
  )
}

function NameTableCell({ item }: { item: OrderFormItem }) {
  const productId = item.productId ?? '—'
  const productRefId = getRefId(item.productRefId)

  return (
    <TableCell className="max-w-0">
      <div className="min-w-0" title={item.name}>
        <span className="block truncate font-medium">{item.name}</span>
        <IdWithRefLine id={productId} refId={productRefId} />
      </div>
    </TableCell>
  )
}

function SkuTableCell({ item }: { item: OrderFormItem }) {
  const skuName = item.skuName ?? '—'
  const skuRefId = getRefId(item.refId)

  return (
    <TableCell className="max-w-0">
      <div className="min-w-0" title={skuName}>
        <span className="block truncate">{skuName}</span>
        <IdWithRefLine id={item.id} refId={skuRefId} />
      </div>
    </TableCell>
  )
}

function handleItemKeyDown(event: KeyboardEvent, onSelect: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onSelect()
  }
}

type ItemRowProps = {
  item: OrderFormItem
  index: number
  isSelected: boolean
  onSelect: () => void
}

function ItemMobileCard({ item, index, isSelected, onSelect }: ItemRowProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`Select item ${index}: ${item.name}`}
      className={cn(
        'w-full cursor-pointer border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
        isSelected && 'border-l-2 border-l-primary bg-primary/5',
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{item.name}</p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">{item.id}</p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">#{index}</span>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div>
          <dt className="text-muted-foreground">SKU</dt>
          <dd className="truncate">{item.skuName ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Qty</dt>
          <dd>{item.quantity}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Price</dt>
          <dd>{formatVtexPrice(item.sellingPrice ?? item.price)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Seller</dt>
          <dd className="truncate">{item.seller}</dd>
        </div>
      </dl>
      {item.attachmentOfferings?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.attachmentOfferings.map((offering) => (
            <Badge key={offering.name} variant="secondary" className="text-xs">
              {offering.name}
            </Badge>
          ))}
        </div>
      ) : null}
    </button>
  )
}

export function ItemsList() {
  const orderForm = useOrderFormStore((state) => state.orderForm)
  const selectedItemIndex = useOrderFormStore((state) => state.selectedItemIndex)
  const setSelectedItemIndex = useOrderFormStore((state) => state.setSelectedItemIndex)

  if (!orderForm) return null

  if (orderForm.items.length === 0) {
    return (
      <Alert className="border-l-accent">
        <AlertCircle className="size-4 text-muted-foreground" />
        <AlertTitle>No items</AlertTitle>
        <AlertDescription>This orderForm has no items in the cart.</AlertDescription>
      </Alert>
    )
  }

  return (
    <SectionPanel
      title="Items"
      description={`${orderForm.items.length} item${orderForm.items.length === 1 ? '' : 's'} in cart`}
      compact
    >
      <div className="sm:hidden">
        {orderForm.items.map((item, index) => (
          <ItemMobileCard
            key={item.uniqueId ?? `${item.id}-${index}`}
            item={item}
            index={index}
            isSelected={selectedItemIndex === index}
            onSelect={() => setSelectedItemIndex(index)}
          />
        ))}
      </div>

      <ScrollArea className="hidden w-full sm:block">
        <Table className="table-fixed text-xs">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 text-xs uppercase tracking-wide text-muted-foreground">#</TableHead>
              <TableHead className="w-[28%] text-xs uppercase tracking-wide text-muted-foreground">Name</TableHead>
              <TableHead className="w-[16%] text-xs uppercase tracking-wide text-muted-foreground">SKU</TableHead>
              <TableHead className="w-10 text-right text-xs uppercase tracking-wide text-muted-foreground">
                Qty
              </TableHead>
              <TableHead className="w-[10%] text-xs uppercase tracking-wide text-muted-foreground">Seller</TableHead>
              <TableHead className="w-16 text-right text-xs uppercase tracking-wide text-muted-foreground">
                Price
              </TableHead>
              <TableHead className="w-[12%] text-xs uppercase tracking-wide text-muted-foreground">
                Availability
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Attachments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderForm.items.map((item, index) => {
              const isSelected = selectedItemIndex === index
              const handleSelect = () => setSelectedItemIndex(index)

              return (
                <TableRow
                  key={item.uniqueId ?? `${item.id}-${index}`}
                  tabIndex={0}
                  aria-current={isSelected ? 'true' : undefined}
                  aria-label={`Select item ${index}: ${item.name}`}
                  className={cn(
                    'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                    isSelected && 'border-l-2 border-l-primary bg-primary/5',
                  )}
                  onClick={handleSelect}
                  onKeyDown={(event) => handleItemKeyDown(event, handleSelect)}
                >
                  <TableCell>{index}</TableCell>
                  <NameTableCell item={item} />
                  <SkuTableCell item={item} />
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
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </SectionPanel>
  )
}
