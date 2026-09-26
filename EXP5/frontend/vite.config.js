import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone Frontend Server running independently on port 5173
// Makes direct Cross-Origin (CORS) HTTP requests to Spring Boot on port 8080
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost'
  }
});
