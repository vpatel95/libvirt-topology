import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      commonjsOptions: { transformMixedEsModules: true },
    },
    server: {
        open: true,
        port: 3000,
    },
    plugins: [react()],
  };
});
