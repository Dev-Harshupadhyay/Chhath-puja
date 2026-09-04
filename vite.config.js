import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* Sandboxes and preview tunnels serve the app on generated hosts,
   so allow the *.e2b.app family (and localhost) explicitly. */
const ALLOWED_HOSTS = ['.e2b.app', '.e2b.dev', 'localhost', '127.0.0.1'];

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173, strictPort: false, allowedHosts: ALLOWED_HOSTS },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: ALLOWED_HOSTS },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    // Vendor chunking only makes sense for the browser bundle;
    // the SSR build (used by the route smoke test) externalises them.
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              react: ['react', 'react-dom', 'react-router-dom'],
            },
          },
        },
  },
}));
