export type OrderForm = {
  orderFormId: string
  salesChannel?: string
  loggedIn?: boolean
  value?: number
  items: OrderFormItem[]
  totalizers?: OrderFormTotalizer[]
  clientProfileData?: unknown
  shippingData?: unknown
  paymentData?: unknown
  messages?: unknown[]
  [key: string]: unknown
}

export type OrderFormItem = {
  uniqueId?: string
  id: string
  productId?: string
  name: string
  skuName?: string
  quantity: number
  seller: string
  price?: number
  sellingPrice?: number
  availability?: string
  attachments?: ItemAttachment[]
  attachmentOfferings?: AttachmentOffering[]
  [key: string]: unknown
}

export type ItemAttachment = {
  name: string
  content: Record<string, string>
}

export type AttachmentOffering = {
  name: string
  required?: boolean
  schema: Record<
    string,
    {
      maximumNumberOfCharacters?: number
      domain?: string[]
    }
  >
}

export type OrderFormTotalizer = {
  id: string
  name: string
  value: number
}
