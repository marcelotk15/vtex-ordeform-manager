import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { AttachmentOffering } from '~/types/order-form'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import { formatVtexPrice } from '~/lib/formatters'
import { useOrderFormStore } from '~/stores/order-form-store'

function buildContentFromSchema(
  offering: AttachmentOffering,
  existingContent?: Record<string, string>,
): Record<string, string> {
  const content: Record<string, string> = {}

  for (const fieldName of Object.keys(offering.schema)) {
    content[fieldName] = existingContent?.[fieldName] ?? ''
  }

  return content
}

type AttachmentFormProps = {
  itemIndex: number
  attachmentName: string
  offering: AttachmentOffering
  existingContent?: Record<string, string>
  saving: boolean
  onSave: (params: {
    itemIndex: number
    attachmentName: string
    content: Record<string, string>
    noSplitItem: boolean
  }) => Promise<void>
}

function AttachmentForm({ itemIndex, attachmentName, offering, existingContent, saving, onSave }: AttachmentFormProps) {
  const [formValues, setFormValues] = useState(() => buildContentFromSchema(offering, existingContent))
  const [noSplitItem, setNoSplitItem] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormValues((current) => ({ ...current, [fieldName]: value }))
  }

  const handleSave = async () => {
    const content = buildContentFromSchema(offering, formValues)

    try {
      await onSave({
        itemIndex,
        attachmentName,
        content,
        noSplitItem,
      })
      setSuccessMessage('Attachment saved successfully.')
    } catch {
      // error handled in store
    }
  }

  return (
    <div className="space-y-4">
      {Object.entries(offering.schema).map(([fieldName, fieldSchema]) => {
        const value = formValues[fieldName] ?? ''

        if (fieldSchema.domain?.length) {
          return (
            <div key={fieldName} className="space-y-2">
              <Label htmlFor={`field-${fieldName}`}>{fieldName}</Label>
              <Select value={value} onValueChange={(nextValue) => handleFieldChange(fieldName, nextValue ?? '')}>
                <SelectTrigger id={`field-${fieldName}`}>
                  <SelectValue placeholder={`Select ${fieldName}`} />
                </SelectTrigger>
                <SelectContent>
                  {fieldSchema.domain.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        }

        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={`field-${fieldName}`}>{fieldName}</Label>
            <Input
              id={`field-${fieldName}`}
              value={value}
              maxLength={fieldSchema.maximumNumberOfCharacters}
              onChange={(event) => handleFieldChange(fieldName, event.target.value)}
            />
          </div>
        )
      })}

      <div className="space-y-2">
        <Label htmlFor="payload-preview">Payload preview</Label>
        <Textarea
          id="payload-preview"
          readOnly
          className="min-h-32 font-mono text-xs"
          value={JSON.stringify(buildContentFromSchema(offering, formValues), null, 2)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="noSplitItem"
          checked={noSplitItem}
          onCheckedChange={(checked) => setNoSplitItem(checked === true)}
        />
        <Label htmlFor="noSplitItem">noSplitItem</Label>
      </div>

      <Button type="button" disabled={saving} onClick={() => void handleSave()}>
        {saving && <Loader2 className="size-4 animate-spin" />}
        Save attachment
      </Button>

      {successMessage && (
        <Alert>
          <CheckCircle2 className="size-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export function ItemAttachmentEditor() {
  const orderForm = useOrderFormStore((state) => state.orderForm)
  const lastUpdatedAt = useOrderFormStore((state) => state.lastUpdatedAt)
  const selectedItemIndex = useOrderFormStore((state) => state.selectedItemIndex)
  const selectedAttachmentName = useOrderFormStore((state) => state.selectedAttachmentName)
  const saving = useOrderFormStore((state) => state.saving)
  const setSelectedAttachmentName = useOrderFormStore((state) => state.setSelectedAttachmentName)
  const saveItemAttachment = useOrderFormStore((state) => state.saveItemAttachment)

  const item = orderForm && selectedItemIndex != null ? orderForm.items[selectedItemIndex] : null

  const selectedOffering = useMemo(() => {
    if (!item || !selectedAttachmentName) return null
    return item.attachmentOfferings?.find((offering) => offering.name === selectedAttachmentName) ?? null
  }, [item, selectedAttachmentName])

  const existingContent = useMemo(() => {
    if (!item || !selectedOffering) return undefined
    return item.attachments?.find((attachment) => attachment.name === selectedOffering.name)?.content
  }, [item, selectedOffering])

  if (selectedItemIndex == null || !item) {
    return (
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>No item selected</AlertTitle>
        <AlertDescription>Select an item in the table to edit its attachments.</AlertDescription>
      </Alert>
    )
  }

  const offerings = item.attachmentOfferings ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachment editor</CardTitle>
        <CardDescription>
          Item #{selectedItemIndex} — {item.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-sm text-muted-foreground">ID</dt>
            <dd className="font-mono text-sm">{item.id}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">SKU</dt>
            <dd className="text-sm">{item.skuName ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Quantity</dt>
            <dd className="text-sm">{item.quantity}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Price</dt>
            <dd className="text-sm">{formatVtexPrice(item.sellingPrice ?? item.price)}</dd>
          </div>
        </dl>

        <Separator />

        {offerings.length === 0 ? (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertTitle>No attachmentOfferings</AlertTitle>
            <AlertDescription>This item has no attachments available for editing.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="attachment-select">Attachment</Label>
              <Select
                value={selectedAttachmentName ?? undefined}
                onValueChange={(value) => setSelectedAttachmentName(value)}
              >
                <SelectTrigger id="attachment-select" className="w-full sm:max-w-md">
                  <SelectValue placeholder="Select an attachment" />
                </SelectTrigger>
                <SelectContent>
                  {offerings.map((offering) => (
                    <SelectItem key={offering.name} value={offering.name}>
                      {offering.name}
                      {offering.required ? ' (required)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAttachmentName && !selectedOffering && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Invalid attachment</AlertTitle>
                <AlertDescription>
                  The selected attachment does not exist in this item&apos;s attachmentOfferings.
                </AlertDescription>
              </Alert>
            )}

            {selectedOffering && selectedAttachmentName != null && (
              <AttachmentForm
                key={`${selectedItemIndex}-${selectedAttachmentName}-${lastUpdatedAt ?? 'initial'}`}
                itemIndex={selectedItemIndex}
                attachmentName={selectedAttachmentName}
                offering={selectedOffering}
                existingContent={existingContent}
                saving={saving}
                onSave={saveItemAttachment}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
