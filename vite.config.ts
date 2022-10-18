/// <reference types="@types/node" />
/// <reference types="vite/client" />

import path from "upath"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    outDir: `lib`,
    lib: {
      entry: path.resolve(__dirname, `src/index.ts`),
      name: `SwcViewer`,
      fileName: (format) => `swc-viewer.${format}.js`,
    },
  },
})
