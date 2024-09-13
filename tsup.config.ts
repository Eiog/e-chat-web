import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./server/index.ts'],
  outDir: 'dist-server',
  clean: true,
  format: ['cjs', 'esm'],
  external: [],
  dts: false,
  minify: false,
})
