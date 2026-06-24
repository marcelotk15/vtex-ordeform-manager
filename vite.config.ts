import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~': path.join(rootDir, 'src'),
    },
    tsconfigPaths: true,
  },
  server: {
    port: 5173,
  },
  plugins: [tanstackStart(), react(), tailwindcss()],
})
