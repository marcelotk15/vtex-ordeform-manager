import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { EXPECTED_ORDER_FORM_SECTIONS } from '~/lib/order-form-sections'
import type { OrderForm } from '~/types/order-form'

const VTEX_HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  Accept: 'application/json, text/javascript, */*; q=0.01',
} as const

function extractErrorMessage(errorBody: Record<string, unknown> | null, status: number): string {
  const nestedError = errorBody?.error as { message?: string } | undefined
  const message = nestedError?.message ?? (errorBody?.message as string | undefined)

  return message ?? `VTEX request failed with status ${status}`
}

async function vtexFetch(accountName: string, path: string, body: unknown): Promise<OrderForm> {
  const request = getRequest()
  const cookie = request.headers.get('cookie') ?? ''

  const response = await fetch(`https://${accountName}.myvtex.com${path}`, {
    method: 'POST',
    headers: {
      ...VTEX_HEADERS,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  })

  const text = await response.text()
  let data: Record<string, unknown> | null = null

  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : null
  } catch {
    data = { message: text }
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, response.status))
  }

  return data as OrderForm
}

type GetOrderFormInput = {
  accountName: string
  orderFormId: string
}

type UpdateItemAttachmentInput = {
  accountName: string
  orderFormId: string
  itemIndex: number
  attachmentName: string
  content: Record<string, string>
  noSplitItem: boolean
}

export const getOrderFormServer = createServerFn({
  method: 'POST',
  strict: { output: false },
}).handler(async ({ data }: { data: GetOrderFormInput }): Promise<OrderForm> => {
  const { accountName, orderFormId } = data

  if (!accountName.trim() || !orderFormId.trim()) {
    throw new Error('accountName and orderFormId are required.')
  }

  return vtexFetch(
    accountName.trim(),
    `/api/checkout/pub/orderForm/${orderFormId.trim()}?refreshOutdatedData=true`,
    { expectedOrderFormSections: EXPECTED_ORDER_FORM_SECTIONS },
  )
})

export const updateItemAttachmentServer = createServerFn({
  method: 'POST',
  strict: { output: false },
}).handler(async ({ data }: { data: UpdateItemAttachmentInput }): Promise<OrderForm> => {
  const { accountName, orderFormId, itemIndex, attachmentName, content, noSplitItem } = data

  if (!accountName.trim() || !orderFormId.trim() || attachmentName == null || itemIndex == null) {
    throw new Error('Missing required attachment update fields.')
  }

  return vtexFetch(
    accountName.trim(),
    `/api/checkout/pub/orderForm/${orderFormId.trim()}/items/${itemIndex}/attachments/${encodeURIComponent(attachmentName)}`,
    {
      content,
      expectedOrderFormSections: EXPECTED_ORDER_FORM_SECTIONS,
      noSplitItem: noSplitItem ?? false,
    },
  )
})
