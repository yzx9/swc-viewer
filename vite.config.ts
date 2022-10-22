/// <reference types="@types/node" />
/// <reference types="vite/client" />

import path from "upath"
import { defineConfig } from "vite"

import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    outDir: `lib`,
    lib: {
      entry: path.resolve(__dirname, `src/index.ts`),
      name: `NeuronSwcViewer`,
      fileName: (format) => `neuron-swc-viewer.${format}.js`,
    },
  },
  plugins: [dts()],
})
