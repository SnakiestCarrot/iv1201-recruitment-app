import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Needed for Hot Reload in Docker on some systems
    },
    host: true, // Expose to Docker network (0.0.0.0)
    strictPort: true,
    port: 3000, // We want port 3000, not 5173
  },
});
