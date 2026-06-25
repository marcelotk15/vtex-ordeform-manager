import { StoreErrorAlert } from '~/components/error-alert'
import { ItemAttachmentEditor } from '~/components/item-attachment-editor'
import { ItemsList } from '~/components/items-list'
import { JsonViewer } from '~/components/json-viewer'
import { OrderFormLoader } from '~/components/order-form-loader'
import { PageFooter } from '~/components/page-footer'
import { PageHeader } from '~/components/page-header'
import { Toaster } from '~/components/ui/sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useOrderFormStore } from '~/stores/order-form-store'

export function App() {
  const orderForm = useOrderFormStore((state) => state.orderForm)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <PageHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6">
        <OrderFormLoader />
        <StoreErrorAlert />

        {orderForm && (
          <Tabs defaultValue="items">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto">
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="json">Raw JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-4 space-y-4">
              <ItemsList />
              <ItemAttachmentEditor />
            </TabsContent>

            <TabsContent value="json" className="mt-4">
              <JsonViewer />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <PageFooter />
      <Toaster closeButton />
    </div>
  )
}
