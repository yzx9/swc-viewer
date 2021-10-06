import esbuild from "rollup-plugin-esbuild"

export default {
  input: "src/index.ts",
  output: {
    file: "lib/swc-viewer.js",
    format: "esm",
  },
  plugins: [
    esbuild({
      sourceMap: false,
      minify: true,
      target: "esnext",
    }),
  ],
}
