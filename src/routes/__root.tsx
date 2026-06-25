/// <reference types="vite/client" />

import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import faviconUrl from '~/assets/favicon.svg?url'
import { getThemeScript } from '~/hooks/use-theme'
import globalsCssUrl from '~/index.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: 'VTEX OrderForm Editor' },
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: faviconUrl },
      { rel: 'stylesheet', href: globalsCssUrl },
    ],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
