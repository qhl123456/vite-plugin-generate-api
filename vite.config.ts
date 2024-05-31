import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      fileName: 'index',
    },
    rollupOptions: {
      external: [/^node:.*$/],
      output: [
        {
          esModule: true,
          exports: 'named',
          format: 'es',
        },
      ],
    },
    sourcemap: true,
    target: 'esnext',
  },
});
