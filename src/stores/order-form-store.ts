import { create } from 'zustand'

import type { OrderForm } from '~/types/order-form'

import { getOrderFormServer, updateItemAttachmentServer } from '~/lib/api/vtex-api'

type OrderFormState = {
  accountName: string
  orderFormId: string
  orderForm: OrderForm | null
  selectedItemIndex: number | null
  selectedAttachmentName: string | null
  loading: boolean
  saving: boolean
  error: string | null
  lastUpdatedAt: string | null

  setAccountName(accountName: string): void
  setOrderFormId(orderFormId: string): void
  setSelectedItemIndex(index: number | null): void
  setSelectedAttachmentName(name: string | null): void

  loadOrderForm(): Promise<void>
  saveItemAttachment(params: {
    itemIndex: number
    attachmentName: string
    content: Record<string, string>
    noSplitItem: boolean
  }): Promise<void>

  clearError(): void
  reset(): void
}

const initialState = {
  accountName: '',
  orderFormId: '',
  orderForm: null as OrderForm | null,
  selectedItemIndex: null as number | null,
  selectedAttachmentName: null as string | null,
  loading: false,
  saving: false,
  error: null as string | null,
  lastUpdatedAt: null as string | null,
}

function formatRequestError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}

export const useOrderFormStore = create<OrderFormState>((set, get) => ({
  ...initialState,

  setAccountName: (accountName) => set({ accountName }),
  setOrderFormId: (orderFormId) => set({ orderFormId }),
  setSelectedItemIndex: (index) => set({ selectedItemIndex: index, selectedAttachmentName: null }),
  setSelectedAttachmentName: (name) => set({ selectedAttachmentName: name }),

  loadOrderForm: async () => {
    const { accountName, orderFormId } = get()

    if (!accountName.trim() || !orderFormId.trim()) {
      set({ error: 'Enter accountName and orderFormId.' })
      return
    }

    set({ loading: true, error: null })

    try {
      const orderForm = await getOrderFormServer({
        data: {
          accountName: accountName.trim(),
          orderFormId: orderFormId.trim(),
        },
      })

      set({
        orderForm,
        loading: false,
        lastUpdatedAt: new Date().toISOString(),
        selectedItemIndex: null,
        selectedAttachmentName: null,
      })
    } catch (error) {
      set({
        loading: false,
        error: formatRequestError(error),
      })
    }
  },

  saveItemAttachment: async (params) => {
    const { accountName, orderFormId } = get()

    if (!accountName.trim() || !orderFormId.trim()) {
      set({ error: 'Enter accountName and orderFormId.' })
      return
    }

    set({ saving: true, error: null })

    try {
      const orderForm = await updateItemAttachmentServer({
        data: {
          accountName: accountName.trim(),
          orderFormId: orderFormId.trim(),
          ...params,
        },
      })

      const { selectedItemIndex } = get()
      const itemStillExists = selectedItemIndex != null && orderForm.items[selectedItemIndex] != null

      set({
        orderForm,
        saving: false,
        lastUpdatedAt: new Date().toISOString(),
        selectedItemIndex: itemStillExists ? selectedItemIndex : null,
        selectedAttachmentName: itemStillExists ? get().selectedAttachmentName : null,
      })
    } catch (error) {
      set({
        saving: false,
        error: formatRequestError(error),
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}))
