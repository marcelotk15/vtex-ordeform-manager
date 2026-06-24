# VTEX OrderForm Editor

A React visual tool to load a VTEX Checkout `orderForm` and edit **cart item attachments**.

Uses **[TanStack Start](https://tanstack.com/router/v1/docs/guide/ssr)** (`vite dev` / `vite build`) with SSR and `createServerFn` to proxy VTEX Checkout API calls on the server, avoiding browser CORS issues.

## Goal

Allow developers and operators to view an orderForm and update item attachments (for example, an attachment like `Destinatario` when it exists in `attachmentOfferings`) without changing other checkout sections.

## Requirements

- [Bun](https://bun.sh) installed

## Installation

```bash
bun install
```

## Run

```bash
bun dev      # SSR dev server (Vite + TanStack Start)
bun run build
bun run start
```

Lint and format:

```bash
bun run lint
bun run lint:fix
bun run format
bun run format:check
```

## Usage

1. Open the URL printed in the terminal (e.g. `http://localhost:5173`).
2. Enter the store `accountName` (e.g. `mystore`).
3. Enter the cart `orderFormId`.
4. Click **Load orderForm**.
5. Browse the tabs: **Items**, **Raw JSON**.
6. On **Items**, select an item, choose an attachment, edit schema fields, and save.

## Architecture

```txt
Browser  →  createServerFn RPC  →  Vite SSR server  →  VTEX Checkout API
Browser  →  /* (pages)            →  TanStack Router SSR
```

VTEX calls run in server functions (`src/lib/api/vtex-api.ts`). The server forwards the browser `Cookie` header to VTEX when present.

No separate `server.js` — Vite + `@tanstack/react-start` handle dev, build, and SSR (same pattern as the admin app in this monorepo).

## Security notice

**Do not paste cookies, tokens, or sensitive headers into the code.**

Server functions forward cookies from the incoming request. No credentials are hardcoded.

## Session note

SSR removes **CORS** blocking, but VTEX session cookies are still required. Cookies for `*.myvtex.com` are not sent to `localhost` automatically — you may need a browser extension, a VTEX-allowed domain, or a VTEX admin context for local dev.

## Stack

- React + TypeScript
- Vite + TanStack Router + TanStack Start (SSR)
- Zustand
- shadcn/ui + Tailwind CSS
- oxlint + oxfmt

## References

- [TanStack Router — Installation with Vite](https://tanstack.com/router/v1/docs/installation/with-vite)
- [TanStack Router — SSR guide](https://tanstack.com/router/v1/docs/guide/ssr)
