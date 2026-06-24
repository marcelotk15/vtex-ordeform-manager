import { StoreErrorAlert } from '~/components/error-alert'
import { ItemAttachmentEditor } from '~/components/item-attachment-editor'
import { ItemsList } from '~/components/items-list'
import { JsonViewer } from '~/components/json-viewer'
import { OrderFormLoader } from '~/components/order-form-loader'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useOrderFormStore } from '~/stores/order-form-store'

export function App() {
  const orderForm = useOrderFormStore((state) => state.orderForm)

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">VTEX OrderForm Editor</h1>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <OrderFormLoader />
        <StoreErrorAlert />

        {orderForm && (
          <>
            <Separator />
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="json">Raw JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-4 space-y-6">
                <ItemsList />
                <ItemAttachmentEditor />
              </TabsContent>

              <TabsContent value="json" className="mt-4">
                <JsonViewer />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  )
}
