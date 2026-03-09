import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
  server: {
    host: true,
    // use PORT environment variable or default to 5173
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5173,
    strictPort: false, // if port is in use, try next available
  }
})
