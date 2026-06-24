/// <reference types="vite/client" />

import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import faviconUrl from '~/assets/favicon.svg?url'
import globalsCssUrl from '~/index.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    title: 'VTEX OrderForm Editor',
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: faviconUrl },
      { rel: 'stylesheet', href: globalsCssUrl },
    ],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
