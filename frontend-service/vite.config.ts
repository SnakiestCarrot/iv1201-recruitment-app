import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // We will create this next
  },
  server: {
    watch: {
      usePolling: true, // Needed for Hot Reload in Docker on some systems
    },
    host: true, // Expose to Docker network (0.0.0.0)
    strictPort: true,
    port: 3000, // We want port 3000, not 5173
    allowedHosts: [
      'ec2-18-193-22-98.eu-central-1.compute.amazonaws.com',
      'localhost',
    ],
  },
});
