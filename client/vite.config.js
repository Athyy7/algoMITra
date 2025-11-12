import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the 'path' module from Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- ADD THIS 'resolve' SECTION ---
  // This tells Vite that "@" means "src"
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})