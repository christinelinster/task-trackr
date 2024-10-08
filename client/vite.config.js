import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:3000", // Your Express server URL
        changeOrigin: true,               // Changes the origin of the host header to the target URL
        secure: false,                    // Set to true if using HTTPS in production
        // rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path to match backend routes
      },
    },
  },
});
